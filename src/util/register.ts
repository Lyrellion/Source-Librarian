import {BaseInteraction, Client, ClientEvents, Collection, CommandInteraction, Events} from "discord.js";
import { SharedSlashCommand } from "@discordjs/builders";

export type Command<T extends SharedSlashCommand = SharedSlashCommand, I extends BaseInteraction = CommandInteraction> = {
    command: T;
    execute: (interaction: I) => Promise<void>;
};

export type Handler<T extends SharedSlashCommand = SharedSlashCommand> = {
    events?: {
        [key in keyof ClientEvents]?: (...args: ClientEvents[key]) => void;
    }
    commands?: Command<T>[];
}

export const registerCommands = (client: Client, handlers: Handler[]) => {
    const commands = new Collection<string, Command>();

    handlers.filter(handler => "commands" in handler).flatMap(handler => handler.commands).forEach(curr => {
        if (curr == undefined) return;
        const name = curr.command.name;
        commands.set(name, curr);
    });

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });
}

export const registerEvents = (client: Client, handler: Handler) => {
    if (handler.events) {
        const events = handler.events;
        const keys = Object.keys(events);
        for (const key in keys) {
            const event = key as keyof ClientEvents;
            const method = events[event];
            if (method) {
                // @ts-expect-error Resulting type of method is too complex
                client.on(event, (...args: ClientEvents[typeof event]) => method(...args));
            }
        }
    }

    if (handler.commands) {
        for (const command of handler.commands) {
            client.on(Events.InteractionCreate, async interaction => {
                if (!interaction.isChatInputCommand()) return;


            });
        }
    }
}
