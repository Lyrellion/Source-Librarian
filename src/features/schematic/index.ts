import type { Handler } from "../../util/register";
import {
    ActionRowBuilder, BaseMessageOptions,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction, EmbedBuilder,
    SlashCommandBuilder, TextChannel,
} from "discord.js";
import { BASE_URL, CDN_BASE_URL, instance } from "../../util/blockprints/http";
import { Schematic } from "../../util/blockprints/types/schematic";
import { BLOCKPRINTS } from "../../util/guilds";
import { Result } from "typescript-result"

interface Response {
    message: BaseMessageOptions;
    schematic: Schematic;
}

export const schematic = async (schematicId: string): Promise<Result<Response, BaseMessageOptions>> => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { data } = await instance.get<Schematic>(`/schematics/${schematicId}`).catch(_ => ({ data: null }));
            if (data == null) {
                return Result.error({ content: "Unable to retrieve this schematic. Please try again later.", ephemeral: true })
            }
        
            if (!data.public) {
                return Result.error({ content: "This schematic is private", ephemeral: true });
            }
        
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const mostUsedBlocks = Object.entries(data.blockCount).sort(([_k1, v1], [_k2, v2]) => v2 - v1).slice(0, 5);
            const maxLength = mostUsedBlocks[0][1].toString().length;
            const mostUsedBlocksText = mostUsedBlocks.map(([block, count]) => `${count.toString().padStart(maxLength, ' ')} ${block}`)
        
            const url = `${BASE_URL}schematic/${data.id}`
        
            const firstImage = data.previewImages[0];
            const embed = new EmbedBuilder()
                .setColor(0x231631)
                .setTitle(`${data.name} by ${data.playerName}`)
                .setURL(url)
                .setDescription(data.description)
                .setImage(`${CDN_BASE_URL}${firstImage}`)
                .setFooter({ text: schematicId })
                .setTimestamp(data.createdAt._seconds * 1000)
                .addFields(
                    { name: `5 Most Used Blocks`, value: mostUsedBlocksText.join("\n") },
                    { name: 'Mod Count', value: `${data.mods.filter(mod => mod !== "minecraft").length}`, inline: true },
                    { name: 'Size', value: `${data.size.join("x")}`, inline: true },
                );
        
            const open = new ButtonBuilder()
                .setLabel('View Schematic')
                .setURL(url)
                .setStyle(ButtonStyle.Link);
        
            const report = new ButtonBuilder()
                .setCustomId("report")
                .setLabel("Report")
                .setStyle(ButtonStyle.Danger);
        
            const row = new ActionRowBuilder()
                .addComponents(open, report);
        
            return Result.ok({
                message: {
                    embeds: [embed],
                    components: [row as never]
                },
                schematic: data
            });
}

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

        const schem = await schematic(schematicId);
        await schem.fold(async success => {
            await interaction.reply(success.message);
        }, async error => {
            await interaction.reply(error);
        })
    }
}

export default {
    commands: [command],
    guilds: BLOCKPRINTS,
    buttons: {
        report: async (interaction): Promise<void> => {
            const channel = await interaction.client.channels.fetch("1244647477387202604")

            if (channel instanceof TextChannel) {
                await channel.send({ content: `Report received from ${interaction.user}\n${interaction.message.url}` });
                return;
            }
        }
    }
} as Handler;
