import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";

export const claims = {
    command: new SlashCommandBuilder()
        .setName("claims")
        .setDescription("How to solve common claims issues"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {

        const lines = [
            "To use a spell turret or other forms of Ars automation, you will need to trust the player Ars_Nouveau (or its UUID), inside your chunks.",
            "",
            "For MineColonies, it may be easier to view your Permission Events in your Town Hall, and trust the Ars_Nouveau player after attempting to fire a turret.",
        ]

        const embed = new EmbedBuilder()
            .setColor(0x231631)
            .setTitle(`<:break:1262385404745748632>   Spell Turrets inside Claimed Chunks`)
            .setDescription(lines.join("\n"))
            .addFields(
                { name: "UUID", value: "7400926d-1007-4e53-880f-b43e67f2bf29" },
                { name: 'Noticed a problem?', value: "Please raise an issue with <@202407548916203520>" },
            );

        await interaction.reply({
            embeds: [embed]
        });
    }
}
