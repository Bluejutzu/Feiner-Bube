import type { Client } from "discord.js";

export default function (c: Client<true>) {
    console.log(`${c.user.username} is ready!`);
    console.log(`${c.user.username} registered on ${c.guilds.cache.size} servers!`);
}
