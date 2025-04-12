import type { Client } from 'discord.js';
import type { CommandKit } from 'commandkit';

export default function (c: Client<true>, handler: CommandKit) {
  console.log(`${c.user.username} is ready!`);
};