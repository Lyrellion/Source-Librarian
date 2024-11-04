import { LRUCache } from "lru-cache";
import {instance} from "../../../../util/curseforge/http";
import {Root} from "../../../../util/curseforge/types/mod";

export const categories = [
    { name: "Content", value: "content", description: "Focused on adding new content." },
    { name: "Compat", value: "compat", description: "Focused on integrating with other mods." },
    { name: "Power Fantasy", value: "power-fantasy", description: "Focused on increasing the players power level." },
    { name: "Utility", value: "utility", description: "Focused on tweaks or quality-of-life improvements." },
] as const;

export type Categories = (typeof categories[number])["value"];

interface Addon {
    id: string;
    categories: Categories[];
    featured?: boolean;
}

export const addons: Record<string, Addon> = {
    "ars-additions": {
        id: "974408",
        categories: ["content"],
        featured: true
    },
    "ars-controle": {
        id: "1061812",
        categories: ["content"]
    },
    "ars-technica": {
        id: "1096161",
        categories: ["content", "compat"],
        featured: true
    },
    "ars-creo": {
        id: "575698",
        categories: ["compat"]
    },
    "ars-instrumentum": {
        id: "580179",
        categories: ["content", "utility"]
    },
    "ars-energistique": {
        id: "905641",
        categories: ["compat"]
    },
    "not-enough-glyphs": {
        id: "1023517",
        categories: ["utility"],
        featured: true
    },
    "ars-trinkets": {
        id: "950506",
        categories: ["power-fantasy"],
    },
    "starbunclemania": {
        id: "746215",
        categories: ["content"],
    },
    "adams-ars-plus": {
        id: "1011093",
        categories: ["power-fantasy"]
    },
    "ars-omega": {
        id: "597007",
        categories: ["power-fantasy", "content"],
    },
    "ars-delight": {
        id: "1131668",
        categories: ["content", "compat"],
    },
    "ars-elemental": {
        id: "561470",
        categories: ["content"],
        featured: true
    },
    "ars-scalaes": {
        id: "630431",
        categories: ["compat"],
    },
    "tome-of-blood-rebirth": {
        id: "911546",
        categories: ["compat"],
    },
    "ars-ocultas": {
        id: "907843",
        categories: ["compat"],
    },
    "ars-fauna": {
        id: "1055577",
        categories: ["content"],
    },
    "ars-artifice": {
        id: "854169",
        categories: ["content"]
    },
    "too-many-glyphs": {
        id: "560595",
        categories: ["utility"]
    },
    "ars-artillery": {
        id: "1070559",
        categories: ["content"]
    },
    "ars-caelum": {
        id: "821651",
        categories: ["content"]
    }
};

interface Version {
    name: string;
    link: string;
}

interface Mod {
    name: string;
    link: string;
    summary: string;
    author: string;
    logo: string;
    versions: Version[];
    last_updated: Date;
    download_count: number;
    issues: string | null;
    source: string | null;
}

const SUPPORTED_VERSIONS = ["1.16.5", "1.18.2", "1.19.2", "1.20.1", "1.21.1"];

export const data = new LRUCache<string, Mod>({
    max: Object.keys(addons).length,
    ttl: 1000 * 60 * 60,
    allowStaleOnFetchRejection: true,
    allowStaleOnFetchAbort: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchMethod: async (key, stale, { options, signal, context }) => {
        console.log(`Re-fetching data from key: ${key}`);
        const { data: root } = await instance.get<Root>(`/mods/${key}`);
        if (root == null) {
            throw new Error("Unable to retrieve mod")
        }
        const { data: mod } = root;

        const versions = mod.latestFilesIndexes
            .filter(version => SUPPORTED_VERSIONS.includes(version.gameVersion))
            .filter(version => version.releaseType === 1)
            .map(file => ({
                name: file.gameVersion,
                link: `${mod.links.websiteUrl}/files/${file.fileId}`,
            }))
            .filter(((version, index, self) => index === self.findIndex((t) => t.name === version.name)));

        return {
            name: mod.name,
            link: mod.links.websiteUrl,
            summary: mod.summary,
            author: mod.authors[0].name,
            logo: mod.logo.url,
            versions: versions,
            last_updated: new Date(mod.dateReleased),
            download_count: mod.downloadCount,
            issues: mod.links.issuesUrl,
            source: mod.links.sourceUrl,
        }
    }
})
