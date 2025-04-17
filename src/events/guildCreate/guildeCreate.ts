import type { Guild } from "discord.js";

export default function (g: Guild) {
    console.log(`Joined a new guild ${g.name} (${g.id})`);
    console.log(`Guild owner: ${g.members.me?.user.tag} (${g.members.me?.user.id})`);
}
