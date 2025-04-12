import type { Guild } from 'discord.js';
import type { CommandKit } from 'commandkit';

export default function (g: Guild, handler: CommandKit) {
  console.log(`Joined a new guild ${g.name} (${g.id})`);
  console.log(`Guild owner: ${g.members.me?.user.tag} (${g.members.me?.user.id})`);
};