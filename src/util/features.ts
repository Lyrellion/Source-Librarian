import fs from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from "node:url";
import {Handler} from "./register";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getFeatures = async () => {
    const foldersPath = join(__dirname, '../features')
    const featureFolders = fs.readdirSync(foldersPath);

    const features: Handler[] = [];

    for (const folder of featureFolders) {
        const featurePath = join(foldersPath, folder);
        const featureFile = `${featurePath}/index.ts`;

        if (!fs.existsSync(featureFile)) continue;

        const feature: Handler = await import(featureFile).then(file => file.default);
        features.push(feature);
    }

    return features;
}
