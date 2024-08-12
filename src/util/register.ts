import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    Client,
    ClientEvents,
    Collection,
    Events
} from "discord.js";
import { SharedSlashCommand } from "@discordjs/builders";
import {Guild} from "./guilds";

export type ButtonHandler = (interaction: ButtonInteraction) => Promise<void>;

export type Command<T extends SharedSlashCommand = SharedSlashCommand> = {
    command: T;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export type EventHandler<k extends keyof ClientEvents> = (...args: ClientEvents[k]) => void;

export type Handler<T extends SharedSlashCommand = SharedSlashCommand> = {
    events?: {
        [key in keyof ClientEvents]?: (...args: ClientEvents[key]) => void;
    }
    commands?: Command<T>[];
    guilds?: Guild[];
    buttons?: {
        [key: string]: ButtonHandler;
    };
}

export const registerCommands = (client: Client, handlers: Handler[]) => {
    const commands = new Collection<string, Command>();
    const buttons = new Collection<string, ButtonHandler>();

    handlers
        .filter(handler => "buttons" in handler)
        .flatMap(handler => Object.entries(handler.buttons!))
        .forEach(([name, handler]) => {
           buttons.set(name, handler);
        });

    handlers.filter(handler => "commands" in handler)
        .flatMap(handler => handler.commands)
        .forEach(curr => {
            if (curr == undefined) return;
            const name = curr.command.name;
            commands.set(name, curr);
        });

    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.isChatInputCommand()) {
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
            return;
        }

        if (interaction.isButton()) {
            const button = buttons.get(interaction.customId);

            if (!button) {
                console.error(`No button handler matching ${interaction.customId} was found.`);
                return;
            }

            try {
                await button(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
            return;
        }
    });
}

export const registerEvents = (client: Client, handler: Handler) => {
    if (handler.events) {
        const events = handler.events;
        const keys = Object.keys(events);
        for (const key of keys) {
            const event = key as keyof ClientEvents;
            const method = events[event];
            if (method) {
                // @ts-expect-error Resulting type of method is too complex
                client.on(event, (...args: ClientEvents[typeof event]) => console.log("received") || method(...args));
            }
        }
    }
}
