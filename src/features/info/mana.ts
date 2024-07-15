import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const mana = {
    command: new SlashCommandBuilder()
        .setName("mana")
        .setDescription("How to increase your mana with Ars Nouveau"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {

        const lines = [
            "- Learn all the glyphs you can. By default each glyph gives you 15 mana.",
            "- Enchant everything with Mana Boost and Mana Regen. Each level of Mana Boost will give you 25 mana. Each level of Mana Regen will give you 2 mana per second.",
            "- Use an Amulet of Mana Boost or Amulet of Mana Regen. These provide 50 mana, and 3 mana regen respectively.",
            "- Craft two Rings of Greater Discount, each of these reduce your spell cost by 20 mana.",
            "- Upgrade your Spell Book to the highest tier you can. Each book tier grants you 50 mana and 1 mana regen.",
            "- Put a Magic Capacity thread in the highest level slot that you can. This increases your max mana by 10% per level."
        ]

        const embed = new EmbedBuilder()
            .setColor(0x231631)
            .setTitle(`How do I get more mana?`)
            .setDescription(lines.join("\n"))
            .addFields(
                { name: 'Noticed a problem?', value: "Please raise an issue with <@202407548916203520>" },
            );

        await interaction.reply({
            embeds: [embed]
        });
    }
}
