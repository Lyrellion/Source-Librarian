import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const ancient = {
    command: new SlashCommandBuilder()
        .setName("ancient")
        .setDescription("An information command for the 1.16.5 version")
        .addUserOption(
            option => option
                .setName("user")
                .setDescription("The command's target")
                .setRequired(false)
        )
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {

        const lines = [
            "1.16.5 has a very old version of Ars Nouveau. Many people would argue that the mod today is completely different to the mod back then.",
        ]

        const embed = new EmbedBuilder()
            .setColor(0x231631)
            .setTitle(`Differences in 1.16.5`)
            .setDescription(lines.join("\n"))
            .addFields(
                { name: "Glyph Press", value: "In 1.16.5 the Glyph Press is used instead of the Scribe's Table to create glyphs. Use JEI to check the Glyph recipes." },
                { name: "Numeric Mana", value: "Ars Instrumentum is not available in 1.16.5. The numeric mana functionality originated in Ars Enderstorage, which unfortunately requires the Enderstorage mod which may not be so easy to add to your modpack." },
                { name: "Containment Jars", value: "Containment Jars don't exist in this version, so you'll need to contain mobs in a different way. If you have Create then their Seats work well." },
                { name: "Glyphs", value: "1.16.5 has some glyphs that aren't in modern versions and there are plenty of glyphs that aren't available in 1.16.5, you'll need to check which glyphs you have available in order to try specific spells." },
                { name: "Knowledge", value: "Glyphs are stored within the book in 1.16.5, not on the player themselves. If you lose your book, you lose all your glyphs. It's recommended to make a backup of your glyphs by scribing your glyphs into a novice spellbook." },
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
