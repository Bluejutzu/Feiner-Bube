import type { BaseInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";

import { raLogCache } from "../../../commands/RideAlong/ra.js";

export default async function (interaction: BaseInteraction) {
    if (!interaction.isButton()) return;

    const buttonIdPattern = /^(approve_promotion|reject_promotion):(\d{17,20}_\d{10,})$/;
    const match = interaction.customId.match(buttonIdPattern);

    if (!match || match[1] === undefined || match[2] === undefined) {
        return interaction.reply({
            content: `This session has expired or the button is invalid, ${interaction.customId}`,
            ephemeral: true
        });
    }

    const [, action, cacheKey] = match;

    const oldEmbed = interaction.message.embeds[0];
    if (!oldEmbed) {
        return interaction.reply({
            content: "This session has expired or data was not found.",
            ephemeral: true
        });
    }

    const embed = EmbedBuilder.from(oldEmbed);

    if (action === "approve_promotion") {
        embed
            .setAuthor({ name: "Status: Approved" })
            .setColor("Green")
            .spliceFields(0, 1, { name: "Pass/Fail", value: "Approved" });
    } else {
        embed
            .setAuthor({ name: "Status: Rejected" })
            .setColor("Red")
            .spliceFields(0, 1, { name: "Pass/Fail", value: "Rejected" });
    }

    raLogCache.delete(cacheKey);

    return await interaction.update({
        embeds: [embed],
        components: []
    });
}
