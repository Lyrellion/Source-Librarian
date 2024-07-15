import type { Handler } from "../../util/register";
import { ALL, Guild } from "../../util/guilds";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { getFeatures } from "../../util/features";
import { SharedSlashCommand } from "@discordjs/builders";

const commandToHelp = (command: SharedSlashCommand) => {
    const str = [];

    str.push(`/${command.name}`);

    for (const option of command.options) {
        if (option instanceof SlashCommandStringOption) {
            str.push(`[${option.name}: string]`);
        }
    }

    return `\`\`\`${str.join(" ")}\`\`\``
}

export const help = {
    command: new SlashCommandBuilder()
        .setName("help")
        .setDescription("List all available commands"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (interaction.guildId === null) {
            await interaction.reply({ content: "Please use this command inside a server.", ephemeral: true });
            return;
        }

        const features = await getFeatures();
        const commands = [];

        for (const feature of features) {
            if (feature.guilds && !feature.guilds.includes(interaction.guildId as Guild)) continue;
            for (const slash of feature.commands ?? []) {
                commands.push([slash.command.name, commandToHelp(slash.command)]);
            }
        }

        const embed = new EmbedBuilder()
            .setColor(0x231631)
            .setTitle(`Help`)
            .setFields(
                commands.map(([name, value]) => ({ name, value, inline: true }))
            );

        await interaction.reply({
            embeds: [embed]
        });
    }
}

export default {
    commands: [help],
    guilds: ALL
} as Handler;
