import { Embed, GuildMember, MessageAttachment, User } from "discord-types/general";

interface Message {
    guild_id: string,
    attachments: MessageAttachment[],
    author: User,
    channel_id: string,
    components: any[],
    content: string,
    edited_timestamp: string,
    embeds: Embed[],
    sticker_items?: Sticker[],
    flags: number,
    id: string,
    member: GuildMember,
    mention_everyone: boolean,
    mention_roles: string[],
    mentions: Mention[],
    nonce: string,
    pinned: false,
    referenced_message: any,
    timestamp: string,
    tts: boolean,
    type: number;
}

interface Mention {
    avatar: string,
    avatar_decoration_data: any,
    discriminator: string,
    global_name: string,
    id: string,
    public_flags: number,
    username: string;
}

interface Sticker {
    t: "Sticker";
    description: string;
    format_type: number;
    guild_id: string;
    id: string;
    name: string;
    tags: string;
    type: number;
}

export { Message, Mention, Sticker };