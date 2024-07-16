import { EventHandler, Handler } from "../../util/register";
import { ALL } from "../../util/guilds";
import {Events, Message, Snowflake} from "discord.js";
import {LRUCache} from "lru-cache";

const cache = new LRUCache<Snowflake, number>({
    ttl: 1000,
    ttlAutopurge: true
});

const maxMentions = 3;

const handleMessage: EventHandler<Events.MessageCreate> = async (message: Message) => {
    if (!message.mentions.everyone || !message.inGuild()) return;

    if (cache.has(message.author.id)) {
        const amount = cache.get(message.author.id) as number;
        if (amount + 1 > maxMentions) {
            console.log("Should ban", message.author.displayName);
            // await message.member!.ban({
            //     deleteMessageSeconds: 604800,
            //     reason: "Spamming"
            // });
            return;
        }
        cache.set(message.author.id, amount + 1);
        return;
    }
    cache.set(message.author.id, 1);
}

export default {
    events: {
        [Events.MessageCreate]: handleMessage,
    },
    guilds: ALL
} as Handler;
