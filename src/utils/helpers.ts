import axios from "axios";
import type {
    APIEmoji,
    EmojiIdentifierResolvable,
    InteractionCallback,
    InteractionCallbackResponse,
    Snowflake
} from "discord.js";

import type { Message } from "../../interface/types.js";

interface EmojiObject extends APIEmoji {
    animated?: boolean;
}

const encodeEmoji = (emoji: EmojiIdentifierResolvable): string => {
    if (typeof emoji === "object" && "id" in emoji) {
        const emojiObj = emoji as EmojiObject;
        return emojiObj.id ? `${emojiObj.animated ? "a" : ""}:${emojiObj.name}:${emojiObj.id}` : emojiObj.name!;
    }
    return emoji.toString();
};

interface Reaction {
    channelId: Snowflake;
    message: Message | InteractionCallbackResponse | InteractionCallback;
    reactions: EmojiIdentifierResolvable | EmojiIdentifierResolvable[];
}

interface DiscordAPIError {
    code: number;
    message: string;
}

const isDiscordAPIError = (error: unknown): error is DiscordAPIError => {
    return typeof error === "object" && error !== null && "code" in error && "message" in error;
};

const addReaction = async (params: Reaction): Promise<void> => {
    if (!process.env.DISCORD_API_ENDPOINT || !process.env.TOKEN) {
        throw new Error("Missing required environment variables");
    }

    const { channelId, message, reactions } = params;
    const reactionList = Array.isArray(reactions) ? reactions : [reactions];

    for (const emoji of reactionList) {
        try {
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
                        Authorization: `Bot ${process.env.TOKEN}`,
                        "Content-Type": "application/json"
                    }
                });
            }
        } catch (error) {
            if (isDiscordAPIError(error)) {
                throw new Error(`Discord API Error: ${error.message} (Code: ${error.code})`);
            }
            throw error;
        }

        // Rate limit handling
        await new Promise(resolve => setTimeout(resolve, 10));
    }
};

export { addReaction, type Reaction };
