import type { Client } from "discord.js";
import type { CommandKit } from "commandkit";

export default function (c: Client<true>) {
    console.log(`${c.user.username} is ready!`);
    console.log(`${c.user.username} registered on ${c.guilds.cache.size} servers!`);
}
