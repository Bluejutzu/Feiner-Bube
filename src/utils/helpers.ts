import axios from "axios";
import type {
    EmojiIdentifierResolvable,
    InteractionCallback,
    InteractionCallbackResponse,
    Snowflake
} from "discord.js";

import type { Message } from "../../interface/types.js";

const encodeEmoji = (emoji: EmojiIdentifierResolvable): string => {
    if (typeof emoji === "object" && "id" in emoji) {
        return emoji.id ? `${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}` : emoji.name!;
    }

    return emoji.toString();
};

interface Reaction {
    channelId: Snowflake;
    message: Message | InteractionCallbackResponse | InteractionCallback;
    reactions: EmojiIdentifierResolvable | EmojiIdentifierResolvable[];
}

const addReaction = async (params: Reaction): Promise<void> => {
    const { channelId, message, reactions } = params;
    const reactionList = Array.isArray(reactions) ? reactions : [reactions];

    for (const emoji of reactionList) {
        if ("resource" in message && message.resource?.message) {
            await message.resource.message.react(emoji);
        } else {
            const rawEmoji = encodeEmoji(emoji);
            const encoded = encodeURIComponent(rawEmoji);

            if (!("id" in message)) {
                throw new Error("Message object does not have an id property");
            }

            const reactEndpoint = `${process.env.DISCORD_API_ENDPOINT}/channels/${channelId}/messages/${message.id}/reactions/${encoded}/%40me`;

            await axios.put(reactEndpoint, null, {
                headers: {
                    Authorization: `Bot ${process.env.TOKEN}`
                }
            });
        }

        await new Promise(resolve => setTimeout(resolve, 10));
    }
};

export { addReaction };
