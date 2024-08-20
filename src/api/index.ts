import { App } from "@tinyhttp/app"
import {Client, TextChannel, ThreadAutoArchiveDuration} from "discord.js";
import {schematic} from "../features/schematic";
import {json} from "milliparsec";
import {Result} from "typescript-result";

const app = new App()

export const serve = (client: Client) => {
    app
        .use(json())
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .get("/", async (_, res) => {
            res.json({ data: "OK" });
        })
        .post("/v1/notification/schematic/:id/channel/:channel", async (req, res) => {
            const apiKey = req.headers["x-api-key"];
            if (!apiKey || apiKey !== process.env.NOTIFICATION_API_KEY) {
                return res.status(403).json({ error: "Unauthorized" });
            }

            const schem = await schematic(req.params.id);

            await schem.mapCatching(async success => {
                const channel = await client.channels.fetch(req.params.channel);
                if (channel instanceof TextChannel) {
                    const message = await channel.send(success.message);
                    const thread = await message.startThread({
                        name: `Discussion: ${success.schematic.name}`,
                        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                    });
                    await message.edit({ content: thread.url })
                    await message.react("❤️")
                    return Result.ok();
                }
                return Result.error("Invalid Channel Type");
            }).fold(() => {
                res.status(200).json({
                    data: 'OK'
                })
            }, error => {
                res.status(400).json({
                    error
                });
            });
        })
        .listen(3000, undefined, "0.0.0.0")
}
