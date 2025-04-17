import "dotenv/config";

import { dirname as dn } from "node:path";
import { fileURLToPath } from "node:url";

import { CommandKit } from "commandkit";
import { Client, IntentsBitField } from "discord.js";

const dirname = dn(fileURLToPath(import.meta.url));

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

new CommandKit({
    bulkRegister: true,
    client,
    eventsPath: `${dirname}/events`,
    commandsPath: `${dirname}/commands`
});

client.login(process.env.TOKEN);
