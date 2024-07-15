import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const spells = {
    command: new SlashCommandBuilder()
        .setName("spells")
        .setDescription("Where to find cool and interesting spells"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {

        const lines = [
            "Ars.Guide contains a spell compendium full of community submitted spells that have been reviewed and published.",
            "",
            "For more informal discussions or if you can't find anything that meets your needs, please search in <#1063650997135757393> before making a thread."
        ]

        const embed = new EmbedBuilder()
            .setColor(0x231631)
            .setTitle(`Where can I find cool and interesting spells?`)
            .setURL("https://ars.guide/spells/introduction/compendium")
            .setDescription(lines.join("\n"))
            .addFields(
                { name: 'JJK/Domain Expansion', value: "Please keep all JJK/Domain Expansion discussion to <#1235249643663659130>" },
                { name: 'Noticed a problem?', value: "Please raise an issue with <@202407548916203520>" },
            );

        await interaction.reply({
            embeds: [embed]
        });
    }
}
