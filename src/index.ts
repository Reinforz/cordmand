import { ChatInputCommandInteraction, Client, Message } from "discord.js";

export const allMatch = /.*/;

/**
 * Function to help send message in discord
 * @param messageArgs message arguments string array returned by MessageArgumentParser. Default parser excludes the message command prefix
 * @param message The discord Message object. Accessing it allows using author, channel etc. of the message
 * @returns string message to send in discord
 */
export type MessageArgCb = (messageArgs: string[], message: Message) => string;

/**
 * Function to do anything you want to instead of just sending a message
 * @param message The discord Message object. Accessing it allows using author, channel etc. of the message
 */
export type MessageCb = (message?: Message) => void;

/**
 * Function to do anything you want to with the interaction
 * @param interaction The discord Chat Command Interaction object. Accessing it allows using author, channel etc.
 */
export type InteractionCb = (interaction: ChatInputCommandInteraction) => void;
/**
 * Function to parse arguments incase the default one is not according to expectations
 * @param messageContent the string message content to process into arguments
 * @returns should return arguments in the form of an array of string
 */
export type MessageArgumentParserCb = (messageContent: string) => string[];

/**
 * Object explaining what a command does
 * @property regex - the regex used to match with the message content detect the command
 * @property cb - A function to give users complete control with what to do with the message object
 * @property message - a message to send or funtion returning a message to send
 * @property reply - boolean indicating whether to send the message by replying to the command message or not
 */
export interface MessageCommand {
  regex: RegExp;
  cb?: MessageCb;
  message?: string | MessageArgCb;
  reply?: boolean;
}

/**
 * Object explaining what a command does
 * @property name - the name of the command
 * @property cb - A function to give users complete control with what to do with the interaction object
 */
export interface InteractionCommand {
  name: string;
  cb: InteractionCb;
}

/**
 * Main Object to pass to add defferent types of commands
 * @property messageCreate - regular message commands
 * @property interactionCreate - interaction (or slash) commands
 */
export interface Commands {
  messageCreate?: MessageCommand[];
  interactionCreate?: InteractionCommand[];
}

export interface AddCommandsOptions {
  messageCommandPrefix: RegExp;
  messageArgumentParser?: (messageContent: string) => string[];
}

/**
 * The default function to parse arguments
 * @param messageContent the string message content to process into arguments
 * @param messageCommandPrefix the regex command prefix to not pass it into the arguments array
 * @returns arguments in the form of an array of string
 */
export function messageArgumentParser(messageContent: string, messageCommandPrefix: RegExp | string) {
  return messageContent.toLocaleLowerCase().trim().replace(/\s\s+/g, " ").replace(messageCommandPrefix, "").split(" ");
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
      if (!args[0]?.match(command.regex)) {
        continue;
      }
      command.cb && (await command.cb(message));
      command.message && (await sendMessage(command.message, message, args, command.reply));
      break;
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    for (let command of interactionCreate) {
      if (interaction.commandName !== command.name) {
        continue;
      }
      await command.cb(interaction);
      break;
    }
  });
}

/**
 * Helper function which is needed for addCommands to work. Not intended to be used by consumers. Used to send message to discord.
 * @param message message in string to send, or function that returns a message in string to send
 * @param discordMessage The discord Message object. Accessing it allows using author, channel etc. of the message
 * @param messageArgs The arguments of the message. May be needed by the message function
 * @param reply boolean to indicate whether or not to reply to the message while sending it
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
