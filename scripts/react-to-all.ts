import 'dotenv/config'
import { program } from "commander";
import {Client, GatewayIntentBits, TextChannel} from "discord.js";

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error('No Discord Token Provided');

program
    .option("--channel <channelId>")
    .option("--reaction <emoji>");

program.parse();

const options = program.opts();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent]
});

client.on('ready', async () => {
        const channel = await client.channels.fetch(options.channel);
    if (channel == null) {
        console.error("Channel ID not found");
        await client.destroy();
    }
    if (channel instanceof TextChannel) {
        const messages = await channel.messages.fetch({ cache: false });
        for (const message of messages.values()) {
            await message.react(options.reaction);
        }
    }
    await client.destroy();
});

client.login(token).catch(console.error);
