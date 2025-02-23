/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

export default definePlugin({
    name: "noAppsAllowed",
    description: "returns the bot's tag :skulk:",
    authors: [{ name: "z4kl", id: 991098850930466816n }],

    patches: [
        {
            find: "\"APP_TAG\"",
            replacement: {
                match: /"APP_TAG":".*?"/,
                replace: "\"APP_TAG\":\"BOT\""
            }
        },
        {
            find: ",APP_TAG:\"",
            replacement: {
                match: /APP_TAG:".*?"/,
                replace: "APP_TAG:\"BOT\""
            }
        }
    ],

});
