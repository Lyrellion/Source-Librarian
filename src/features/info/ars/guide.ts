import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { NodeHtmlMarkdown } from 'node-html-markdown'
import {search} from "../../../util/ddg";

export const guide
    = {
    command: new SlashCommandBuilder()
        .setName("guide")
        .setDescription("Information about Ars.Guide")
        .addUserOption(
            option => option
                .setName("user")
                .setDescription("The command's target")
                .setRequired(false)
        )
        .addStringOption(
            option => option
                .setName("query")
                .setDescription("The query to search the Guide")
                .setRequired(false)
        )
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const query = interaction.options.getString("query");
        if (query != null) {
            const res = await search("ars.guide", query);

            if (res.isError()) {
                await interaction.reply({
                    content: res.error,
                    ephemeral: true
                });
                return;
            }

            const first = res.value
            const content = NodeHtmlMarkdown.translate(first.rawDescription.replaceAll("**", ""));

            const embed = new EmbedBuilder()
                .setColor(0x231631)
                .setTitle(`<:white_wixie_wow:1275534535219744960>   ${first.title}`)
                .setURL(first.url)
                .setDescription(content)
                .addFields(
                    { name: 'Noticed a problem?', value: "Please raise an issue with <@202407548916203520>" },
                );

            const user = interaction.options.getUser("user");

            await interaction.reply({
                content: user != null ? `${user}` : undefined,
                embeds: [embed],
                ephemeral: user == null,
            });
            return;
        }

        const lines = [
            "Ars.Guide is a hand-written, curated guide to the technical side of Ars Nouveau.",
            "",
            "It contains the [exact numbers on Sourcelinks](https://ars.guide/docs/sourcelinks/agronomic/), Guides to [Drygmys](https://ars.guide/docs/drygmy/guide/) and [I-Frames](https://ars.guide/docs/spell_theory/iframes/), a list of [KubeJS tweaks](https://ars.guide/kubejs/tweaks/amethyst-golem/) for modpack makers and a whole [spell compendium](https://ars.guide/spells/introduction/compendium/)."
        ]

        const embed = new EmbedBuilder()
            .setColor(0x231631)
            .setTitle(`<:green_wixie_wow:1262382964319322174>   Ars.Guide`)
            .setURL("https://ars.guide/")
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
