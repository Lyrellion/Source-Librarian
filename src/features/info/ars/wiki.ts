import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { NodeHtmlMarkdown } from 'node-html-markdown'
import {search} from "../../../util/ddg";

export const wiki = {
    command: new SlashCommandBuilder()
        .setName("wiki")
        .setDescription("Information about the Ars Nouveau wiki")
        .addUserOption(
            option => option
                .setName("user")
                .setDescription("The command's target")
                .setRequired(false)
        )
        .addStringOption(
            option => option
                .setName("query")
                .setDescription("The query to search the Wiki")
                .setRequired(false)
        )
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const query = interaction.options.getString("query");
        if (query != null) {
            const res = await search("arsnouveau.wiki", query);

            if (res.isError()) {
                await interaction.reply({
                    content: res.error,
                    ephemeral: true
                });
                return;
            }

            const first = res.value
            const content = NodeHtmlMarkdown.translate(first.rawDescription).replaceAll("**", "");

            const embed = new EmbedBuilder()
                .setColor(0x231631)
                .setTitle(`<:green_wixie_wow:1262382964319322174>   ${first.title}`)
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

        const embed = new EmbedBuilder()
            .setColor(0x231631)
            .setTitle(`<:green_wixie_wow:1262382964319322174>   Wiki`)
            .setURL("https://www.arsnouveau.wiki/")
            .setDescription("The Ars Nouveau wiki is auto generated from the patchouli book available in-game. The wiki should always follow the latest released Ars Nouveau version.")
            .addFields(
                { name: 'Why does my book open the wiki?' , value: "You're missing the [Patchouli](https://www.curseforge.com/minecraft/mc-mods/patchouli) mod, once installed you will be able to browse the book in-game." },
                { name: 'Noticed a problem?', value: "Please raise an issue on the [GitHub Repository](https://github.com/Sarenor/arsnouveau-wiki/issues)" },
            );

        const user = interaction.options.getUser("user");

        await interaction.reply({
            content: user != null ? `${user}` : undefined,
            embeds: [embed],
            ephemeral: user == null,
        });
    }
}
