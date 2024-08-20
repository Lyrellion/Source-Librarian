import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const logs = {
    command: new SlashCommandBuilder()
        .setName("logs")
        .setDescription("How to share logs")
        .addUserOption(
            option => option
                .setName("user")
                .setDescription("The command's target")
                .setRequired(false)
        )
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {

        const lines = [
            "Upload your log file to [mclo.gs](https://mclo.gs/) so that people can help easier, not everyone is on their PC all the time and having a easily formatted searchable link is much easier for debugging.",
        ]

        const embed = new EmbedBuilder()
            .setColor(0x231631)
            .setTitle(`:notepad_spiral: Log Sharing`)
            .setDescription(lines.join("\n"))
            .addFields(
                { name: 'Noticed a problem?', value: "Please raise an issue with <@202407548916203520>" },
            );

        const user = interaction.options.getUser("user");

        await interaction.reply({
            content: user != null ? `${user}` : undefined,
            embeds: [embed],
            ephemeral: user == null,
        });
    }
}
