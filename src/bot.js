const
  Discord = require("discord.js"),
  config = require("../config.json"),
  {
    roles,
    regex: {
      linkRegex
    },
    functions: {
      getPermissionLevel
    }
  } = require("./constants"),
  linkScanHandler = require("./handlers/linkScan.js"),
  dutyPingHandler = require("./handlers/dutyPing.js"),
  {
    processCommand,
    setupSlashCommands
  } = require("./handlers/commands.js"),
  client = new Discord.Client({
    messageCacheLifetime: 30,
    messageSweepInterval: 60,
    disableMentions: "everyone",
    partials: [ "USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION" ],
    presence: {
      status: "online"
    },
    fetchAllMembers: true
  }),
  db = require("./database");

client.once("shardReady", () => {
  console.log(`Ready as ${client.user.tag}!`);
  setupSlashCommands(client);
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

  // link scan handler
  const links = message.content.match(linkRegex) || [];
  if (getPermissionLevel(message.member) < 1 && links.length) await linkScanHandler(message, links);

  // commands handler
  if (message.content.startsWith(config.prefix) || message.content.match(`^<@!?${client.user.id}> `)) await processCommand(message);
  else if (message.content.match(`^<@!?${client.user.id}>`)) {
    const response = db.responses.get("botping");
    if (response) return message.channel.send(response);
  }
});

client
  .on("error", console.log)
  .on("guildCreate", guild => importantLog(`Bot got added to server ${guild.name} (${guild.id})`))
  .on("guildDelete", guild => importantLog(`Bot removed from server ${guild.name} (${guild.id})`))
  .on("guildUnavailable", guild => importantLog(`Guild ${guild.name} is unavailable.`))
  .on("rateLimit", ({ timeout, limit, method, path }) => console.log(`Rate-limited. [${timeout}ms, ${method} ${path}, limit: ${limit}]`))
  .on("shardDisconnect", event => console.log("Disconnected:", event.reason))
  .on("shardReconnecting", () => console.log("Reconnecting..."))
  .on("shardResume", (_, replayed) => console.log(`Resumed. [${replayed} events replayed]`))
  .on("warn", info => console.log("Info:", info))
  .login(config.token);

function importantLog(message) {
  console.log("!IMPORTANT!", message);
  client.users.cache.get(config.owner).send(message);
}