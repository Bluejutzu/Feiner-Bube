import type { CommandData, SlashCommandProps } from "commandkit";
import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

import type { RaLogCacheData } from "../../../interface/types.js"; 

export const raLogCache = new Map<string, RaLogCacheData>();

export const data: CommandData = {
    name: "ra",
    description: "Ride along panel",
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "request",
            description: "Request a ride along"
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "log",
            description: "Log a ride along",
            options: [
                {
                    name: "recruit",
                    description: "The recruit you did an R/A with",
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: "pass-fail",
                    description: "Did the recruit fail or pass?",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: "Pass", value: "pass" },
                        { name: "Fail", value: "fail" }
                    ]
                },
                {
                    name: "driving-score",
                    description: "Was the recruit abiding to road laws? Out of 10.",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                },
                {
                    name: "grammar-score",
                    description: "Was the recruit using sufficient grammar? Out of 10.",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                },
                {
                    name: "total-score",
                    description: "How would you rate the recruit overall? Out of 10.",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }
            ]
        }
    ]
};

export async function run({ interaction }: SlashCommandProps) {
    const sub = interaction.options.getSubcommand(true);

    if (sub === "request") {
        // You can handle this later or prompt a DM/modal for a request
    }

    if (sub === "log") {
        const recruit = interaction.options.getUser("recruit", true);
        const passFail = interaction.options.getString("pass-fail", true) as "pass" | "fail";
        const driving = interaction.options.getInteger("driving-score", true);
        const grammar = interaction.options.getInteger("grammar-score", true);
        const total = interaction.options.getInteger("total-score", true);

        const cacheKey = `${interaction.user.id}_${Date.now()}`;
        raLogCache.set(cacheKey, {
            recruit: recruit.id,
            passFail,
            driving,
            grammar,
            total
        });

        const modal = new ModalBuilder().setCustomId(cacheKey).setTitle("R/A Logging Results");

        const performance = new TextInputBuilder()
            .setCustomId("performance")
            .setLabel("Performance")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("How did the cadet perform?")
            .setRequired(true)
            .setMaxLength(500);

        const notes = new TextInputBuilder()
            .setCustomId("notes")
            .setLabel("Notes (Optional)")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("This will be DMed to the Cadet")
            .setRequired(false);

        const callsign = new TextInputBuilder()
            .setCustomId("callsign")
            .setLabel("Callsign")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Only the numbers: 000 - if you failed the cadet then put in N/A")
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(performance),
            new ActionRowBuilder<TextInputBuilder>().addComponents(notes),
            new ActionRowBuilder<TextInputBuilder>().addComponents(callsign)
        );

        await interaction.showModal(modal);
    }
}
