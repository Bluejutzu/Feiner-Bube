import type { ModalSubmitInteraction } from "discord.js";
import { ActionRowBuilder, ButtonBuilder } from "discord.js";
import { ButtonStyle, EmbedBuilder } from "discord.js";

import type { RaLogCacheData } from "../../../../interface/types.js";
import { raLogCache } from "../../../commands/RideAlong/ra.js";

export default async function (interaction: ModalSubmitInteraction) {
    const modalIdPattern = /^(\d{17,20}_\d{10,})$/;
    const match = interaction.customId.match(modalIdPattern);
    if (!match || match[1] === undefined) {
        return interaction.reply({
            content: "This session has expired or data was not found.",
            ephemeral: true
        });
    }

    const cacheKey = match[1];
    const cached = raLogCache.get(cacheKey) as RaLogCacheData | undefined;

    if (!cached) {
        return interaction.reply({
            content: `This session has expired or data was not found, ${cacheKey}.`,
            ephemeral: true
        });
    }

    const performance = interaction.fields.getTextInputValue("performance");
    const notes = interaction.fields.getTextInputValue("notes") || "No notes provided.";
    const callsign = interaction.fields.getTextInputValue("callsign");

    const embed = new EmbedBuilder()
        .setTitle("Ride Along Results")
        .setAuthor({
            name: cached.passFail === "fail" ? "Status: Failed" : "Status: Pending Promotion"
        })
        .setColor(cached.passFail === "fail" ? "Red" : "Blue")
        .setDescription(
            `
**Pass/Fail:** ${cached.passFail}
**Recruit:** <@${cached.recruit}>
**Overall Score:** ${cached.total}
**Driving:** ${cached.driving}
**Grammar:** ${cached.grammar}
**Field‐Officer:** ${interaction.user}
**Performance Notes:** ${performance}
**Additional Notes:** ${notes}

Time logged: ${new Date().toLocaleString()}
Awaiting decision by a High‐Ranking member or FTO Supervisor.
            `.trim()
        );

    const components: ActionRowBuilder<ButtonBuilder>[] = [];
    if (cached.passFail === "pass") {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`approve_promotion:${cacheKey}`)
                .setLabel("Approve Promotion")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`reject_promotion:${cacheKey}`)
                .setLabel("Reject Promotion")
                .setStyle(ButtonStyle.Danger)
        );
        components.push(row);
    }

    raLogCache.set(interaction.id, {
        ...cached,
        callsign: callsign
    });

    return await interaction.reply({
        embeds: [embed],
        components
    });
}
