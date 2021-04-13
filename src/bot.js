const
  Discord = require("discord.js"),
  config = require("../config.json"),
  {
    roles,
    emojis
  } = require("./constants"),
  commandHandler = require("./handlers/commands.js"),
  slashCommandHandler = require("./handlers/slashCommands.js"),
  dutyPingHandler = require("./handlers/dutyPing.js"),
  staffHandler = require("./handlers/staffHandler.js"),
  aboutHandler = require("./handlers/aboutHandler"),
  client = new Discord.Client({
    messageCacheLifetime: 30,
    messageSweepInterval: 60,
    disableMentions: "everyone",
    partials: [ "USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION" ],
    presence: {
      status: "online"
    },
    fetchAllMembers: true
  });

client.once("shardReady", () => {
  console.log(`Ready as ${client.user.tag}!`);
  slashCommandHandler(client);
  staffHandler(client);
  aboutHandler(client);
});

client.on("message", async message => {
  if (
    !message.guild || // dms
    message.type !== "DEFAULT" ||
    message.author.bot
  ) return;

  // duty ping handler
  const sod = message.mentions.roles.find(r => r.id == roles.staffonduty);
  if (sod) await dutyPingHandler(message, sod);

  // commands handler
  if (message.content.startsWith(config.prefix) || message.content.match(`^<@!?${client.user.id}> `)) await commandHandler(message);
  else if (message.content.match(`^<@!?${client.user.id}>`)) await message.react(emojis.ids.wave);
});

client
  .on("error", err => console.log("Client error.", err))
  .on("guildCreate", guild => importantLog(`Bot got added to server ${guild.name} (${guild.id})`))
  .on("guildDelete", guild => importantLog(`Bot removed from server ${guild.name} (${guild.id})`))
  .on("guildUnavailable", guild => importantLog(`Guild ${guild.name} is unavailable.`))
  .on("rateLimit", rateLimitInfo => console.log("Rate limited.", JSON.stringify(rateLimitInfo)))
  .on("shardDisconnected", closeEvent => console.log("Disconnected.", closeEvent))
  .on("shardError", err => console.log("Error.", err))
  .on("shardReconnecting", () => console.log("Reconnecting."))
  .on("shardResume", (_, replayedEvents) => console.log(`Resumed. ${replayedEvents} replayed events.`))
  .on("warn", info => console.log("Warning.", info))
  .login(config.token);

function importantLog(message) {
  console.log("!IMPORTANT!", message);
  client.users.cache.get(config.owner).send(message);
}
