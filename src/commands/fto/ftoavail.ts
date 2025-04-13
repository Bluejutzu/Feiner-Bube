import { CommandData, SlashCommandProps } from "commandkit";

export const data: CommandData = {
    name: "available",
    description: "Ping @Recruit to let them know you are available for a ride along"
};

export async function run({ interaction }: SlashCommandProps) {}
