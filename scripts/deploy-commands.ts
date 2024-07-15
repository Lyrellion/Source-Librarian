import 'dotenv/config'
import {REST,Routes} from "discord.js";
import {getFeatures} from "../src/util/features";
import {Guild} from "../src/util/guilds";

const { DISCORD_TOKEN: token, DISCORD_CLIENT_ID: clientId } = process.env;
if (!token) throw new Error('No Discord Token Provided');
if (!clientId) throw new Error('No Client ID Provided');

const main = async () => {
    const features = await getFeatures();
    const rest = new REST().setToken(token);

    const guilds = Object.values(Guild);
    for (const guildId of guilds) {
        const commands = [];

        for (const feature of features) {
            if (feature.guilds && !feature.guilds.includes(guildId)) continue;
            for (const slash of feature.commands ?? []) {
                commands.push(slash.command.toJSON());
            }
        }

        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands }
            ) as [];

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error('Error refreshing application (/) commands.', error);
        }
    }
}

main().catch(console.error);
