import { ActivityType, type Client, type PresenceStatusData } from "discord.js";

interface BotStatus {
    status: PresenceStatusData;
    type: Exclude<ActivityType, ActivityType.Custom>;
    name: string;
}

const DEFAULT_STATUS: BotStatus = {
    status: "online",
    type: ActivityType.Playing,
    name: "OCSO Patrol"
};

export default function (client: Client<true>) {
    try {
        console.log(`${client.user.username} is ready!`);
        console.log(`${client.user.username} registered on ${client.guilds.cache.size} servers!`);

        client.user.setPresence({
            activities: [{ name: DEFAULT_STATUS.name, type: DEFAULT_STATUS.type }],
            status: DEFAULT_STATUS.status
        });
    } catch (error) {
        console.error("Error in ready event:", error);
    }
}
