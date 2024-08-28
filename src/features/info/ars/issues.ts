import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const issues = {
    command: new SlashCommandBuilder()
        .setName("issues")
        .setDescription("How to report issues with Ars Nouveau")
        .addUserOption(
            option => option
                .setName("user")
                .setDescription("The command's target")
                .setRequired(false)
        )
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {

        const lines = [
            "**1.** First check if an issue is specific to a modpack or if it can be replicated with a minimal mod-list.",
            "**2.** Now head on over to <#1096849320608805123> to create your report.",
            "**3.** It's important to include your version of Ars Nouveau, as well as the modpack you're playing.",
            "**4.** You also need to include any relevant crash reports or log files from when the bug occurred.",
            "**5.** Lastly include the instructions on how to replicate the issue if possible, some bugs can be random so don't worry if you're not able to include this."
        ]

        const embed = new EmbedBuilder()
            .setColor(0x231631)
            .setTitle(`How do I report an issue?`)
            .setDescription(lines.join("\n"))
            .addFields(
                { name: "Need help posting your logs?", value: "Check out the /logs command for a guide on locating and uploading logs." },
                { name: 'Are you on Minecraft 1.21?', value: "As 1.21 is a brand new version release, there's a specific channel for reporting issues related to it. Please post those issues in <#1264386595474243594>" },
                { name: 'Something wrong with the documentation?', value: "Please report it in https://discord.com/channels/743298050222587978/1278414854730023104 so that all the issues can be collected together." },
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
