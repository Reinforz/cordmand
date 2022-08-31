import { Client, Message } from "discord.js";

export const allMatch = /.*/;

export type MessageArgCb = (messageArgs: string[], message: Message) => string;

export interface MessageCommand {
  regex: RegExp;
  cb?: (message?: Message) => void;
  message?: string | MessageArgCb; // post message without replying
  reply?: boolean;
}

export interface AddCommandsOptions {
  messageCommandPrefix: RegExp;
  messageCommandArgumentParser?: (messageContent: string) => string[];
}

export function messageCommandArgumentParser(messageContent: string, messageCommandPrefix: RegExp | string) {
  return messageContent.toLocaleLowerCase().trim().replace(/\s\s+/g, " ").replace(messageCommandPrefix, "").split(" ");
}

export function addCommands(client: Client, commands: MessageCommand[], options?: AddCommandsOptions) {
  client.on("messageCreate", async (message) => {
    if (!message.content.match(options?.messageCommandPrefix || allMatch)) {
      return;
    }
    const args = options?.messageCommandArgumentParser
      ? options.messageCommandArgumentParser(message.content)
      : messageCommandArgumentParser(message.content, options?.messageCommandPrefix || "");
    for (let command of commands) {
      if (!message.content.match(command.regex)) {
        continue;
      }
      command.cb && (await command.cb(message));
      command.message && (await sendMessage(command.message, message, args, command.reply));
      break;
    }
  });
}

function sendMessage(message: string | MessageArgCb, discordMessage: Message, messageArgs: string[], reply?: boolean) {
  if (typeof message === "string") reply ? discordMessage.reply(message) : discordMessage.channel.send(message);
  else
    reply
      ? discordMessage.reply(message(messageArgs, discordMessage))
      : discordMessage.channel.send(message(messageArgs, discordMessage));
}
