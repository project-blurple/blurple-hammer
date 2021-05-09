const
  Discord = require("discord.js"),
  fs = require("fs"),
  config = require("../config.json"),
  {
    roles,
    emojis,
    channels
  } = require("./constants"),
  commandHandler = require("./handlers/commands.js"),
  dutyPingHandler = require("./handlers/dutyPing.js"),
  manualcheckHandler = require("./handlers/manualcheckHandler.js"),
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

const handlers = [];
fs.readdir("./src/handlers", (err, files) => err ? console.log(err) : handlers.push(...files.map(f => require("./handlers/" + f))))

client.once("shardReady", () => {
  console.log(`Ready as ${client.user.tag}!`);
  handlers.forEach(handler => typeof handler !== "undefined" ? handler(client) : null);
});

client.on("message", async message => {
  if (
    !message.guild || // dms
    message.type !== "DEFAULT" ||
    message.author.bot
  ) return;

  if (message.channel.id == channels.manualCheck) return manualcheckHandler.exec(message);

  // duty ping handler
  const sod = message.mentions.roles.find(r => r.id == roles.staffonduty);
  if (sod) await dutyPingHandler.exec(message, sod);

  // commands handler
  if (message.content.startsWith(config.prefix) || message.content.match(`^<@!?${client.user.id}> `)) await commandHandler.exec(message);
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