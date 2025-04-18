import "dotenv/config";

import axios from "axios";
import type { CommandData, CommandOptions, SlashCommandProps } from "commandkit";
import type { APIEmbed } from "discord.js";
import type { ColorResolvable } from "discord.js";
import { EmbedBuilder } from "discord.js";

import type { Message } from "../../../interface/types.js";
import * as CONSTANTS from "../../utils/constants.js";
import { addReaction } from "../../utils/helpers.js";

if (!process.env.DISCORD_API_ENDPOINT) {
    throw new Error("DISCORD_API_ENDPOINT environment variable is not set");
}

const MESSAGE_ENDPOINT = `${process.env.DISCORD_API_ENDPOINT}/channels/${CONSTANTS.EVENT_CHANNEL_ID}/messages`;

const EMBED_COLORS = {
    DEFAULT: "#02221E",
    ERROR: "#FF0000"
} as const satisfies Record<string, ColorResolvable>;

const THUMBNAILS = {
    LOGO: "https://cdn.discordapp.com/attachments/1191898883604433940/1225919992694298644/ocso_logo.png"
} as const;

type AnnouncementType = "training" | "shift";

const createAnnouncementEmbed = (type: AnnouncementType, user: string): EmbedBuilder => {
    const embed = new EmbedBuilder()
        .setColor(EMBED_COLORS.DEFAULT)
        .setAuthor({ name: "OCSO Management" })
        .setTitle(`${type.charAt(0).toUpperCase() + type.slice(1)} Announcement`)
        .setThumbnail(THUMBNAILS.LOGO);

    if (type === "training") {
        embed.setDescription(
            `${user} is hosting a Training. If you intend on attending then react below with a checkmark.\n` +
                `Starting: ${new Date().toLocaleString()}\n\n` +
                "Florida State rules apply in the Training Server. Violating any of them or disrupting the Training will result in punishment."
        );
    } else {
        embed.setDescription(
            `${user} is hosting a Shift! Join up and get a chance for a promotion!\n` +
                `Starting: ${new Date().toLocaleString()}\n` +
                "Code: FloridaSTR\n" +
                "https://discord.com/channels/884071312446873650/1342660852347572234"
        );
    }

    return embed;
};

interface DiscordApiMessage {
    content: string;
    embeds: APIEmbed[];
}

const sendAnnouncement = async (embed: EmbedBuilder): Promise<Message> => {
    if (!process.env.TOKEN) {
        throw new Error("Bot token not found in environment variables");
    }

    const messageData: DiscordApiMessage = {
        content: "<@&1197529613199482941>",
        embeds: [embed.toJSON()]
    };

    const response = await axios.post<Message>(MESSAGE_ENDPOINT, messageData, {
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`,
            "Content-Type": "application/json"
        }
    });

    if (![200, 201, 204].includes(response.status)) {
        console.error("Error sending message:", response.statusText);
        throw new Error(`Failed to send message: ${response.statusText}`);
    }

    return response.data;
};

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

export async function run({ interaction }: SlashCommandProps) {
    const msg = await interaction.reply({
        content: "Sending message <a:Loading:1345093666196291644>...",
        withResponse: true
    });

    try {
        const type = interaction.options.getString("type", true).toLowerCase();
        if (!type || (type !== "shift" && type !== "training")) {
            throw new Error(`Invalid type: ${type}`);
        }

        const embed = createAnnouncementEmbed(type as AnnouncementType, interaction.user.toString());
        const message = await sendAnnouncement(embed);

        if (!message.author.id) {
            throw new Error("Failed to send message");
        }

        await addReaction({
            channelId: message.channel_id,
            message: message,
            reactions: []
        });

        await msg.resource?.message?.edit({
            content:
                `Successfully sent [Announcement](${msg.resource?.message?.url})!\n` +
                `If you are unavailable when the ${type} is supposed to be hosted then inform a FTO Supervisor so they can cancel it.`
        });
    } catch (error) {
        console.error("Error:", error);
        await interaction.followUp("An error occurred. Please check the logs for details.");
    }
}

export const options: CommandOptions = {
    userPermissions: ["Administrator"],
    botPermissions: ["Administrator"],
    deleted: false
};
