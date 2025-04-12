import "dotenv/config";

import type { CommandData, CommandOptions, SlashCommandProps } from "commandkit";
import { EmbedBuilder } from "discord.js";
import axios from "axios";
import * as CONSTANTS from "../../utils/constants";
import { Message } from "../../../interface/Message";

const MESSAGE_ENDPOINT = process.env.DISCORD_API_ENDPOINT + `/channels/${CONSTANTS.EVENT_CHANNEL_ID}/messages`;

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

export async function run({ interaction, client }: SlashCommandProps) {
    return await interaction
        .reply("Sending message <a:Loading:1345093666196291644>...")
        .then(async msg => {
            const type = interaction.options.getString("type", true).toLowerCase();

            if (!type || (type !== "shift" && type !== "training")) {
                return interaction.followUp(
                    `Something went horribly wrong. Inform <@!953708302058012702> about this in a support ticket and show the value below. ${type} ${interaction.user}`
                );
            }

            let embed = new EmbedBuilder()
                .setColor("#0099ff")
                .setAuthor({ name: "OCSO Management" })
                .setTitle(`${type.charAt(0).toUpperCase() + type.slice(1)} Announcement`);

            if (type === "training") {
                embed
                    .setDescription(
                        `${interaction.user} is hosting a Training. If you intend on attending then react below with a checkmark.\nStarting: {timeahead1h}\n\nFlorida State rules apply in the Training Server. Violating any of them or disrupting the Training will result into punishment.\n\n{curr_text}`
                    )
                    .setThumbnail(
                        "https://cdn.discordapp.com/attachments/1191898883604433940/1225919992694298644/ocso_logo.png?ex=66249b7a&is=6612267a&hm=83c19e5863554494e955d444955989423491c1c2e90a79863910979986952c1b&"
                    );
            } else if (type === "shift") {
                embed
                    .setDescription(
                        `${interaction.user} is hosting a Shift! Join up and get a chance for a promotion!\nStarting: {time_now}\nCode: FloridaSTR\nhttps://discord.com/channels/884071312446873650/1342660852347572234\n{curr_text}`
                    )
                    .setThumbnail(
                        "https://cdn.discordapp.com/attachments/1191898883604433940/1225919992694298644/ocso_logo.png?ex=66249b7a&is=6612267a&hm=83c19e5863554494e955d444955989423491c1c2e90a79863910979986952c1b&"
                    );
            }

            try {
                const response = await axios(MESSAGE_ENDPOINT, {
                    method: "POST",
                    url: MESSAGE_ENDPOINT,
                    headers: {
                        Authorization: `Bot ${process.env.TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    data: {
                        content: "<@&1197529613199482941>",
                        embeds: [embed]
                    }
                });
                const message = response.data as Message;
                if (!message.author.id) {
                    return interaction.followUp("Failed to send message. Check the logs for more details.");
                }

                const reactEndpoint = `${process.env.DISCORD_API_ENDPOINT}/channels/${CONSTANTS.EVENT_CHANNEL_ID}/messages/${message.id}/reactions/%E2%9C%85/%40me`;
                await axios(reactEndpoint, { method: "PUT", headers: { Authorization: `Bot ${process.env.TOKEN}` } });

                return await msg.edit({
                    content: `Successfully send [Announcement](https://discord.com/channels/1341134365752823810/${CONSTANTS.EVENT_CHANNEL_ID}/${message.id})! \nIf you are unavailable when the Training is supposed to be hosted then inform a FTO Supervisor so they can cancel the Training.`
                });
            } catch (error) {
                console.error("Error sending message or reacting:", error);
                return interaction.followUp("Failed to send message or react. Check the logs for more details.");
            }
        })
        .catch(err => {
            console.error("Error replying to interaction:", err);
            return interaction.followUp("Failed to send message. Check the logs for more details.");
        });
}

export const options: CommandOptions = {
    userPermissions: ["Administrator"],
    botPermissions: ["Administrator"],
    deleted: false
};
