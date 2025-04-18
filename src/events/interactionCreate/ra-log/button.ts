import type { ButtonInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";

import { raLogCache } from "../../../commands/RideAlong/ra.js";

type ButtonAction = "approve_promotion" | "reject_promotion";

interface ButtonMatch {
    action: ButtonAction;
    cacheKey: string;
}

const parseButtonId = (customId: string): ButtonMatch | null => {
    const buttonIdPattern = /^(approve_promotion|reject_promotion):(\d{17,20}_\d{10,})$/;
    const match = customId.match(buttonIdPattern);

    if (!match || match[1] === undefined || match[2] === undefined) {
        return null;
    }

    return {
        action: match[1] as ButtonAction,
        cacheKey: match[2]
    };
};

export default async function (interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    const buttonMatch = parseButtonId(interaction.customId);
    if (!buttonMatch) {
        return interaction.reply({
            content: `This session has expired or the button is invalid: ${interaction.customId}`,
            ephemeral: true
        });
    }

    const { action, cacheKey } = buttonMatch;

    const oldEmbed = interaction.message.embeds[0];
    if (!oldEmbed) {
        return interaction.reply({
            content: "This session has expired or data was not found.",
            ephemeral: true
        });
    }

    const embed = EmbedBuilder.from(oldEmbed);

    try {
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
    } catch (error) {
        console.error("Error processing button interaction:", error);
        return await interaction.reply({
            content: "An error occurred while processing your request.",
            ephemeral: true
        });
    }
}
