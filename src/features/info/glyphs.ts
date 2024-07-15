import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

interface AddonLink {
    versions: string;
    link: string;
}

interface AddonLinks {
    [key: string]: AddonLink;
}

const addonLinks: AddonLinks = {
    tmg: {
        versions: "1.16.5-1.20.1",
        link: "[TooManyGlyphs](https://www.curseforge.com/minecraft/mc-mods/too-many-glyphs)"
    },
    neg: {
        versions: "1.20.1",
        link: "[NotEnoughGlyphs](https://www.curseforge.com/minecraft/mc-mods/not-enough-glyphs)"
    },
    omega: {
        versions: "1.16.5-1.19.2",
        link: "[Ars Omega](https://www.curseforge.com/minecraft/mc-mods/ars-omega)"
    },
    elemental: {
        versions: "1.16.5-1.20.1",
        link: "[Ars Elemental](https://www.curseforge.com/minecraft/mc-mods/ars-elemental)"
    },
    trinkets: {
        versions: "1.19.2-1.20.1",
        link: "[Ars Trinkets](https://www.curseforge.com/minecraft/mc-mods/ars-trinkets)"
    },
    plus: {
        versions: "1.20.1",
        link: "[Adam's Ars Plus](https://www.curseforge.com/minecraft/mc-mods/adams-ars-plus)"
    },
    additions: {
        versions: "1.19.2-1.20.1",
        link: "[Ars Additions](https://www.curseforge.com/minecraft/mc-mods/ars-additions)"
    }
}

const getGlyphDescription = (...addons: AddonLink[]) => {
    return addons.map(entry => `${entry.versions}\n${entry.link}`).join("\n");
}

export const glyphs = {
    command: new SlashCommandBuilder()
        .setName("addonglyphs")
        .setDescription("Which addon gives which popular glyphs?"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {

        const embed = new EmbedBuilder()
            .setColor(0x231631)
            .setTitle(`Where can I get this glyph?`)
            .addFields(
                { name: "**Burst** <:burst:1262385410873491486>", value: "Base 1.19+", inline: true },
                { name: "**Chaining** <:chaining:1262385413826412645> **Ray** <:ray:1262385417341370439>", value: getGlyphDescription(addonLinks.tmg, addonLinks.neg), inline: true },
                { name: "Trail <:trail:1262385421061591080>", value: getGlyphDescription(addonLinks.neg), inline: true },
                { name: "Propagators for Vanilla Forms <:p_projectile:1262385423603335289> <:p_underfoot:1262385426233036850>", value: getGlyphDescription(addonLinks.omega, addonLinks.neg), inline: true },
                { name: "Arc <:curved_projectile:1262385428871385138> Homing <:homing_projectile:1262385436244840518>", value: getGlyphDescription(addonLinks.elemental, addonLinks.neg), inline: true },
                { name: "Missile, Overhead, True Underfoot", value: getGlyphDescription(addonLinks.omega, addonLinks.trinkets), inline: true },
                { name: "Greater Augments", value: getGlyphDescription(addonLinks.omega, addonLinks.tmg, addonLinks.plus), inline: true },
                { name: "Domain", value: getGlyphDescription(addonLinks.plus), inline: true },
                { name: "Aura", value: getGlyphDescription(addonLinks.trinkets), inline: true },
                { name: "**Mark** <:mark:1262385454557171735> **Recall** <:recall:1262385457795301377> **Retaliate** <:retaliate:1262385460324335617>", value: getGlyphDescription(addonLinks.additions), inline: true },
                { name: 'Noticed a problem?', value: "Please raise an issue with <@202407548916203520>" },
            );

        await interaction.reply({
            embeds: [embed]
        });
    }
}
