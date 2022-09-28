import { Client, Message } from "discord.js";
import { Commands, AddCommandsOptions, MessageArgCb, MakeDiscordClientOptions } from "types";

export const allMatch = /.*/;

/**
 * The default function to parse arguments
 * @param messageContent the string message content to process into arguments
 * @param messageCommandPrefix the regex command prefix to not pass it into the arguments array
 * @returns arguments in the form of an array of string
 */
export function messageArgumentParser(messageContent: string, messageCommandPrefix: RegExp | string) {
  return messageContent.toLowerCase().replace(messageCommandPrefix, "").trim().replace(/\s\s+/g, " ").split(" ");
}

/**
 * Main function to add commands to the discord bot client
 * @param client The discord client to "add" commands on
 * @param commands Object representing the information of different types of commands
 * @param options Optional. Needed for passing command prefix regex and/or message argument parser
 */
export function addCommands(
  client: Client,
  { messageCreate = [], interactionCreate = [] }: Commands,
  options?: AddCommandsOptions
) {
  client.on("messageCreate", async (message) => {
    if (!message.content.match(options?.messageCommandPrefix || allMatch)) {
      return;
    }
    const args = options?.messageArgumentParser
      ? options.messageArgumentParser(message.content)
      : messageArgumentParser(message.content, options?.messageCommandPrefix || "");
    for (let command of messageCreate) {
      const { regex, reply, cb, message: msgFromCommand } = command;
      if (!args[0]?.match(regex)) {
        continue;
      }

      if (cb) {
        await cb(message);
        break;
      }
      if (!msgFromCommand) break;
      if (typeof msgFromCommand === "function") {
        if (reply) await message.reply(await msgFromCommand(args, message));
        else await message.channel.send(await msgFromCommand(args, message));
        break;
      }
      if (reply) await message.reply(msgFromCommand);
      else await message.channel.send(msgFromCommand);
      break;
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    for (let command of interactionCreate) {
      const { name, cb, message } = command;
      if (interaction.commandName !== name) {
        continue;
      }
      if (cb) {
        await cb(interaction);
        break;
      }
      if (!message) break;
      if (typeof message === "function") {
        await interaction.reply(await message(interaction));
        break;
      } else {
        await interaction.reply(message);
      }
    }
  });
}

/**
 * @deprecated Since version 0.0.4. Use the addCommands function instead.
 */
export function sendMessage(
  message: string | MessageArgCb,
  discordMessage: Message,
  messageArgs: string[],
  reply?: boolean
) {
  if (typeof message === "string") reply ? discordMessage.reply(message) : discordMessage.channel.send(message);
  else
    reply
      ? discordMessage.reply(message(messageArgs, discordMessage))
      : discordMessage.channel.send(message(messageArgs, discordMessage));
}

/**
 * function to make the discord client
 * @param makeDiscordClientOptions an object which has the necessary fields to make a discord.js client.
 * i.e. botToken, ClientOptions (which includes intents), onceReady function, commands, addCommandsOptions
 */
export function makeDiscordClient({
  botToken,
  clientOptions,
  onceReady = () => console.log("BOT is online"),
  commands = undefined,
  addCommandsOptions = undefined,
}: MakeDiscordClientOptions) {
  const client = new Client(clientOptions);

  client.once("ready", onceReady);

  if (commands) {
    addCommands(client, commands, addCommandsOptions);
  }

  client.login(botToken);

  return client;
}

export * from "./types";
