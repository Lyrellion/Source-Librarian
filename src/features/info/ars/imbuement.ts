import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

interface Config {
    name: string;
    image: string;
    text: string[];
    title: string;
}

type ConfigMap = {
    [key: string]: Config;
}

const configMap: ConfigMap = {
    imbuement: {
        name: "Imbuement Chamber",
        title: `Imbuement Chamber not Enchanting Apparatus`,
        image: "https://i.imgur.com/3YG8c6e.png",
        text: [
            "Oops, it looks like you've used an Enchanting Apparatus instead of an Imbuement Chamber",
        ]
    },
    enchanting: {
        name: "Enchanting Apparatus",
        title: `Enchanting Apparatus not Imbuement Chamber`,
        image: "https://i.imgur.com/88FE6iD.png",
        text: [
            "Oops, it looks like you've used an Imbuement Chamber instead of an Enchanting Apparatus",
        ]
    }
}

const getCommand = (name: string) => {
    const config = configMap[name];
    return {
        command: new SlashCommandBuilder()
            .setName(name)
            .setDescription(`Instructions for when a user should be using an ${config.name}`)
            .addUserOption(
                option => option
                    .setName("user")
                    .setDescription("The command's target")
                    .setRequired(false)
            )
            .setDMPermission(false),
        async execute(interaction: ChatInputCommandInteraction): Promise<void> {
            const embed = new EmbedBuilder()
                .setColor(0x231631)
                .setTitle(config.title)
                .setDescription(config.text.join("\n"))
                .setImage(config.image)
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
}

export const imbuement = getCommand("imbuement");
export const enchanting = getCommand("enchanting");
