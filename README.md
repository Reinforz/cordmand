# Cordcommand

## About
A utility package for making discord-bot commands much easier to write with discord.js.

## Usage Example

```js
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
const commands: MessageCommand[] = [
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
];

// add commands to the client by calling the addCommands function provided by the client
addCommands(client, commands, {
  messageCommandPrefix: /^i!/i,
  // Add your command prefix regex. Make sure to include ^ (starts with) in the regex
});

// login
client.login(process.env.BOT_TOKEN!);
```