import { Plugin } from 'vencord';
import { PresenceUpdate } from 'discord-api-types/v9'; // Adjust the import based on the version you use
import { MessageEvents } from '@api/index';
import { MessageExtra, MessageObject } from '@api/MessageEvents';
import definePlugin from '@utils/types';

class CheckOnlineStatus extends Plugin {
    private presenceUpdates: Map<string, PresenceUpdate>;

    constructor() {
        super();
        this.presenceUpdates = new Map();
    }

    start() {
        // Hook into Discord's presence update event
        this.onPresenceUpdate = this.onPresenceUpdate.bind(this);
        this.addEventListener('PRESENCE_UPDATE', this.onPresenceUpdate);

        // Hook into message events to track user activity
        MessageEvents.on('MESSAGE_CREATE', this.onMessageCreate.bind(this));
    }

    stop() {
        // Clean up any listeners or intervals
        this.removeEventListener('PRESENCE_UPDATE', this.onPresenceUpdate);
        MessageEvents.off('MESSAGE_CREATE', this.onMessageCreate.bind(this));
    }

    private onPresenceUpdate(presence: PresenceUpdate) {
        const userId = presence.user.id;
        const status = presence.status; // 'online', 'offline', 'idle', 'dnd', or 'invisible'

        // Store the presence update
        this.presenceUpdates.set(userId, presence);

        if (status === 'offline') {
            // Logic to check if the user is truly offline or appearing offline
            this.checkIfTrulyOffline(userId);
        }

        // Update your UI or handle the presence update as needed
    }

    private onMessageCreate(message: MessageObject, extra: MessageExtra) {
        const userId = message.author.id;
        // Update the presence updates map or handle the message event as needed
        // This is to track user activity and determine if they're truly offline or appearing offline
        const currentPresence = this.presenceUpdates.get(userId) || {} as PresenceUpdate;
        this.presenceUpdates.set(userId, {
            ...currentPresence,
            lastMessageTimestamp: Date.now(),
        });
    }

    private async checkIfTrulyOffline(userId: string) {
        const presence = this.presenceUpdates.get(userId);

        if (!presence) return;

        // Check if the user has recent activity indicating they might be invisible
        const recentActivity = await this.getRecentActivity(userId);

        if (recentActivity) {
            console.log(`User ${userId} is appearing offline.`);
            // Update your UI or handle the user status accordingly
        } else {
            console.log(`User ${userId} is truly offline.`);
            // Update your UI or handle the user status accordingly
        }
    }

    private async getRecentActivity(userId: string): Promise<boolean> {
        // Implement logic to fetch recent activity for the user
        // This could be message history, presence updates, etc.
        // For example, you might check if the user has sent any messages in the last few minutes

        try {
            // Fetch recent messages or activity data for the user
            const recentPresence = this.presenceUpdates.get(userId);
            if (recentPresence && recentPresence.lastMessageTimestamp) {
                const now = Date.now();
                const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
                return now - recentPresence.lastMessageTimestamp < tenMinutes;
            }

            // You might also check other types of activity here

            return false;
        } catch (error) {
            console.error(`Error fetching recent activity for user ${userId}:`, error);
            return false;
        }
    }
}

export default definePlugin({
    name: "StatusX",
    description: "Shows if somebody is appearing offline or actually offline",
    authors: [{ name: "z4kl", id: 991098850930466816n }],
    start: () => new CheckOnlineStatus(),
    stop: (plugin) => plugin.stop(),
});
