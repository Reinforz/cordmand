import {
  MessagePayload,
  ReplyMessageOptions,
  MessageOptions,
  InteractionReplyOptions,
  ChatInputCommandInteraction,
  Message,
  ClientOptions,
} from "discord.js";

export type CommonReply = string | MessagePayload;
export type MessageReplies = CommonReply | ReplyMessageOptions;
export type MessageSends = CommonReply | MessageOptions;
export type InteractionReplies = CommonReply | InteractionReplyOptions;

/**
 * Function to help send message in discord
 * @param messageArgs message arguments string array returned by MessageArgumentParser. Default parser excludes the message command prefix
 * @param message The discord Message object. Accessing it allows using author, channel etc. of the message
 * @returns string message to send in discord
 */
export type MessageArgCb = (messageArgs: string[], message: Message) => MessageReplies | MessageSends;

export type InteractionArgCb = (interaction: ChatInputCommandInteraction) => InteractionReplies;
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
  message?: MessageReplies | MessageSends | MessageArgCb;
  reply?: boolean;
}

/**
 * Object explaining what a command does
 * @property name - the name of the command
 * @property cb - A function to give users complete control with what to do with the interaction object
 * @property message - A string or a function returning a string to reply to the interaction
 */
export interface InteractionCommand {
  name: string;
  cb?: InteractionCb;
  message?: InteractionReplies | InteractionArgCb;
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

export interface MakeDiscordClientOptions {
  botToken: string;
  clientOptions: ClientOptions;
  onceReady?: () => void;
  commands?: Commands;
  addCommandsOptions?: AddCommandsOptions;
}