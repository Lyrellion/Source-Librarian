import 'dotenv/config'
import { Client, GatewayIntentBits } from "discord.js";
import {getFeatures} from "./util/features";
import {registerCommands, registerEvents} from "./util/register";

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error('No Discord Token Provided');

const main = async () => {
    const features = await getFeatures();

    const client = new Client({
        intents: [GatewayIntentBits.Guilds]
    });

    registerCommands(client, features);

    for (const feature of features) {
        registerEvents(client, feature);
    }

    client.login(token).catch(console.error);
}

main().catch(console.error);
