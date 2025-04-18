import "dotenv/config";

import { dirname as dn } from "node:path";
import { fileURLToPath } from "node:url";

import { CommandKit } from "commandkit";
import type { ClientOptions } from "discord.js";
import { Client, IntentsBitField } from "discord.js";

const dirname = dn(fileURLToPath(import.meta.url));

if (!process.env.TOKEN) {
    throw new Error("Discord bot token not found in environment variables");
}

const clientConfig: ClientOptions = {
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
};

const client = new Client(clientConfig);

new CommandKit({
    bulkRegister: true,
    client,
    eventsPath: `${dirname}/events`,
    commandsPath: `${dirname}/commands`
});

client.login(process.env.TOKEN).catch(error => {
    console.error("Failed to login:", error);
    process.exit(1);
});
