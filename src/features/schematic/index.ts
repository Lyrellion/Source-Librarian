import type { Handler } from "../../util/register";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction, EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import {BASE_URL, CDN_BASE_URL, instance} from "../../util/blockprints/http";
import {Schematic} from "../../util/blockprints/types/schematic";

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
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const schematicId = interaction.options.getString("id");

        if (schematicId == null) {
            await interaction.reply({ content: "Schematic ID is required", ephemeral: true });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data } = await instance.get<Schematic>(`/schematics/${schematicId}`).catch(_ => ({ data: null }));
        if (data == null) {
            await interaction.reply({ content: "Unable to retrieve this schematic. Please try again later.", ephemeral: true });
            return;
        }

        if (!data.public) {
            await interaction.reply({ content: "This schematic is private", ephemeral: true });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const mostUsed = Object.entries(data.blockCount).sort(([_k1, v1], [_k2, v2]) => v2 - v1).slice(0, 5);
        const maxLength = mostUsed[0][1].toString().length;

        const mostUsedText = mostUsed.map(([block, count]) => `${count.toString().padStart(maxLength, ' ')} ${block}`)

        const firstImage = data.previewImages[0];
        const embed = new EmbedBuilder()
            .setColor(0x231631)
            .setTitle(`${data.name} by ${data.playerName}`)
            .setURL(`${BASE_URL}${data.schematic}`)
            .setDescription(data.description)
            .setImage(`${CDN_BASE_URL}${firstImage}`)
            .setFooter({ text: schematicId })
            .setTimestamp(data.createdAt._seconds * 1000)
            .addFields(
                { name: '5 Most Used Blocks', value: mostUsedText.join("\n") },
                { name: 'Mod Count', value: `${data.mods.length}`, inline: true },
                { name: 'Size', value: `${data.size.join("x")}`, inline: true },
            );

        const open = new ButtonBuilder()
            .setLabel('View Schematic')
            .setURL(`${BASE_URL}${data.schematic}`)
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder()
            .addComponents(open);

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
}

export default {
    commands: [command]
} as Handler;
