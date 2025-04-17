import type { BaseInteraction} from "discord.js";
import { EmbedBuilder } from "discord.js";

export default async function (interaction: BaseInteraction) {
    if (!interaction.isButton()) return;

    if (interaction.customId !== "approve_promotion" && interaction.customId !== "reject_promotion") return;

    const oldEmbed = interaction.message.embeds[0];
    if (oldEmbed === undefined) {
        return interaction.reply({
            content: "This session has expired or data was not found.",
            ephemeral: true
        });
    }
    const embed = EmbedBuilder.from(oldEmbed);

    if (interaction.customId === "approve_promotion") {
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

    return await interaction.update({
        embeds: [embed],
        components: []
    });
}
