import type { Client, Guild } from "discord.js";

export default async function (guild: Guild, client: Client<true>) {
    try {
        console.log(`Joined guild: ${guild.name} (${guild.id})`);
        console.log(`Now in ${client.guilds.cache.size} guilds`);

        const owner = await guild.fetchOwner();
        console.log(`Guild owner: ${owner.user.tag} (${owner.id})`);
    } catch (error) {
        console.error(`Error handling guild create event for guild ${guild.id}:`, error);
    }
}
