import type { Embed, GuildMember, MessageEditAttachmentData } from "discord.js";

interface Message {
    guild_id: string;
    attachments: MessageEditAttachmentData[];
    author: User;
    channel_id: string;
    components: any[];
    content: string;
    edited_timestamp: string;
    embeds: Embed[];
    sticker_items?: Sticker[];
    flags: number;
    id: string;
    member: GuildMember;
    mention_everyone: boolean;
    mention_roles: string[];
    mentions: Mention[];
    nonce: string;
    pinned: false;
    referenced_message: any;
    timestamp: string;
    tts: boolean;
    type: number;
}

interface Mention {
    avatar: string;
    avatar_decoration_data: any;
    discriminator: string;
    global_name: string;
    id: string;
    public_flags: number;
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
/* https://github.com/Vendicated/Vencord/blob/main/src/plugins/xsOverlay/index.tsx */

interface User {
    id: string;
    username: string;
    discriminator: string;
    global_name?: string;
    avatar?: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
    avatar_decoration_data?: any;
}

export { Mention, Message, Sticker, User };
