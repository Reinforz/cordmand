# Cordmand

## About
A utility package for making discord-bot commands much easier to write with discord.js.

## Usage Example

#### Install this package:
```bash
npm i @reinforz/cordmand
```
or,
```bash
yarn add @reinforz/cordmand
```

#### Example typescript file:
```ts
import { Client, GatewayIntentBits } from "discord.js";
import { addCommands } from "@reinforz/cordmand";
import { Commands } from "@reinforz/cordmand/types";

// initiate discord.js client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// define your commands similar to
const commands: Commands = {
  interactionCreate: [
    // define interactions here
    {
      name: "ping",
      cb: async (interaction) => {
        await interaction.reply("Pong!");
      },
    },
    {
      name: "hello",
      message: {
        content: "hello",
        ephemeral: true,
      },
    },
  ],

  messageCreate: [
    {
      regex: /ping/i,
      message: "pong",
    },
    {
      regex: /hi/i,
      // message can also be a callback function which can access the discord message object
      message: (_, message) => `hello <@${message.author.id}>`,
    },
    {
      regex: /bye/i,
      message: (_, message) => `bye ${message.author.username}`,
      reply: true, // uses discord's message.reply intead of just sending the message in the same channel
    },
    {
      regex: /args/i,
      message: (args) => `The arguments are: ${args.join(", ")}`,
      reply: true, 
    },
  ],
};

// add commands to the client by calling the addCommands function provided by the client
addCommands(client, commands, {
  messageCommandPrefix: /^i!/i,
  // Add your command prefix regex. Make sure to include ^ (starts with) in the regex
});

// login
client.login(process.env.BOT_TOKEN!);
```

#### Example with just using `makeDiscordClient` function:
```ts
import { makeDiscordClient } from "@reinforz/cordmand";
import { Commands, MakeDiscordClientOptions } from "@reinforz/cordmand/types";
import { commands } from "./some-file"

const makeClientOptions: MakeDiscordClientOptions = {
  botToken: process.env.BOT_TOKEN!,
  clientOptions: {
    intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMembers"],
  },
  commands, // the same command object as previous one, It will work in the same way as the previous example
  addCommandsOptions: {
    messageCommandPrefix: /^i!/i,
  },
};

makeDiscordClient(makeClientOptions);
```

## Contributors

- [imoxto](https://github.com/imoxto)