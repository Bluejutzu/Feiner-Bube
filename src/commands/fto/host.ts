import 'dotenv/config';

import type { CommandData, SlashCommandProps, CommandOptions } from "commandkit";
import * as CONSTANTS from '../../utils/constants';
import { EmbedBuilder } from 'discord.js';

const API_ENDPOINT = process.env.DISCORD_API_ENDPOINT + `/channels/${CONSTANTS.MEDIA_CHANNEL_ID}/messages?limit=10`

export const data: CommandData = {
    name: "host",
    description: "Host a training/shift",
    options: [
        {
            name: "type",
            description: "Type of training",
            type: 3,
            required: true,
            choices: [
                { name: "Shift", value: "shift" },
                { name: "Training", value: "training" }
            ]
        }
    ]
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
    let curr_thumbnail = null;
    let curr_res = null;

    await interaction.reply("Sending message <a:Loading:1345093666196291644>...");

    const type = interaction.options.getString("type", true).toLowerCase();

    if (!type || (type !== "shift" && type !== "training")) {
        return interaction.followUp(
            `Something went horribly wrong. Inform <@!953708302058012702> about this in a support ticket and show the value below. ${type} ${interaction.user}`
        );
    }
    
    const embed = new EmbedBuilder()
    .setColor("#02221E")
    .setAuthor({name: "OCSO Management"})
    .setTitle(`${type}`)
    
}

export const options: CommandOptions = {
    userPermissions: ["Administrator", "AddReactions"],
    botPermissions: ["Administrator", "AddReactions"],
    deleted: false
};
