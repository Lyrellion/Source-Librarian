import type { Handler } from "../../util/register";
import {
    CommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

const command = {
    command: new SlashCommandBuilder()
    .setName("schematic")
    .setDescription("Fetch a schematic image")
    .addStringOption(
        option => option
            .setName("id")
            .setDescription("The ID of the Schematic you wish to fetch")
            .setRequired(true)
    ),
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply("Pong!");
    }
}

export default {
    commands: [command]
} as Handler;
