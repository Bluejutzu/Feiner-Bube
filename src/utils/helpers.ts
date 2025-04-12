import axios from "axios";
import { EmojiIdentifierResolvable, Snowflake } from "discord.js";
import { Message } from "../../interface/Message";

type ReactionInput = EmojiIdentifierResolvable | EmojiIdentifierResolvable[];

const encodeEmoji = (emoji: EmojiIdentifierResolvable): string => {
    if (typeof emoji === "object" && "id" in emoji) {
        return emoji.id ? `${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}` : emoji.name!;
    }

    return emoji.toString();
};

const addReaction = async (channelId: Snowflake, message: Message, reactions: ReactionInput): Promise<void> => {
    const reactionList = Array.isArray(reactions) ? reactions : [reactions];

    for (const emoji of reactionList) {
        const rawEmoji = encodeEmoji(emoji);
        const encoded = encodeURIComponent(rawEmoji);

        const reactEndpoint = `${process.env.DISCORD_API_ENDPOINT}/channels/${channelId}/messages/${message.id}/reactions/${encoded}/%40me`;

        await axios.put(reactEndpoint, null, {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`
            }
        });
    }
};

export { addReaction };
