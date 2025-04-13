import axios from "axios";
import { CommandData, SlashCommandProps } from "commandkit";
import { EmbedBuilder } from "discord.js";
import { Message } from "../../../interface/Message";
import { CommandOptions } from "commandkit";

const MESSAGE_ENDPOINT = process.env.DISCORD_API_ENDPOINT + `/channels/1168943371981697024/messages`;

export const data: CommandData = {
    name: "fto-avail",
    description: "Ping @Recruit to let them know you are available for a ride along"
};

export async function run({ interaction }: SlashCommandProps) {
    const msg = await interaction.reply({
        content: "Sending message <a:Loading:1345093666196291644>...",
        withResponse: true
    });
    const embed = new EmbedBuilder()
        .setColor("#02221E")
        .setImage(
            "https://media.discordapp.net/attachments/1343127647382933534/1343127648049823765/Nayttokuva_2025-02-23_094628.png?ex=67c364d9&is=67c21359&hm=3b6d76c89d372a3d40cb6618701c0ed7bae2965945b490be349e43ffeac714c5&=&width=1194&height=671"
        )
        .setTitle("FTO Available")
        .setDescription(
            "Join the game and request a ride-along with </ra request:1341716111162605588> to get ranked in OCSO\nCode: **`FloridaSTR`** https://discord.com/channels/884071312446873650/1342660852347572234\n-# Credit: [kake_aviation](https://discord.com/channels/1341134365752823810/1343127647382933534)"
        );

    const response = await axios.post(
        MESSAGE_ENDPOINT,
        {
            content: "<@&1197529613199482941>",
            embeds: [embed]
        },
        {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );

    if (![200, 201, 204].includes(response.status)) {
        console.error("Error sending message:", response.status, response.statusText);
        throw new Error(`Failed to send message: ${response.statusText}`);
    }

    response.data as Message;
    await msg.resource?.message?.edit({
        content: `[Embed](${msg.resource.message.url}) sent`
    });
}

export const options: CommandOptions = {
    userPermissions: ["Administrator"],
    botPermissions: ["Administrator"],
    deleted: false
};
