const Discord = require("discord.js"), fs = require("fs"), config = require("../config.json"), constants = require("./constants"), { getPermissionLevel, linkRegex, parseArgs, flat } = constants, scanLinks = require("./utils/link-scanner.js")

const client = new Discord.Client({
  messageCacheLifetime: 30,
  messageSweepinterval: 60,
  disableMentions: "everyone",
  partials: [ "USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION" ],
  presence: {
    status: "online"
  },
  fetchAllMembers: true
}), db = require("./database.js")(client);

client.on("ready", () => {
  console.log("Ready as " + client.user.tag)
})

// command handler
const commands = {}, aliases = {} // { "command": require("that_command") }, { "alias": "command" }
fs.readdir("./src/commands", (err, categories) => {
  if (err) return console.log(err);
  for (const category of categories) fs.readdir(`./src/commands/${category}`, (err, files) => {
    if (err) return console.log(err);
    for (const file of files) if (file.endsWith(".js")) {
      const commandFile = require(`./commands/${category}/${file}`), fileName = file.replace(".js", "");
      commands[fileName] = commandFile;
      if (commandFile.aliases) for (const alias of commandFile.aliases) aliases[alias] = fileName;
    }
  })
})

client.on("message", async message => {
  if (message.author.bot || !message.guild) return;

  const links = message.content.match(linkRegex) || []; // https://stackoverflow.com/a/3809435
  if (getPermissionLevel(message.member) < 1 && links.length) {
    await message.react(constants.emojiSnowflakes.loading)
    const results = flat(await scanLinks(links.filter(constants.onlyUnique)));
    
    if (results.find(r => r.safe == false)) return message.author.send({
      embed: {
        title: "Bad Link Detected",
        description: `We have detected a bad link in your message in ${message.channel}: ${message.content.split("\n").map(line => "\n> " + line)}\nIf this was a mistake then please contact a staff member, and we'll get it fixed for you. **No automatic punishment has been made to your account.**`,
        fields: results.filter(r => r.safe == false).map(r => ({
          name: r.url,
          value: [
            r.origin ? `**From:** Redirection of ${r.origin}` : `**Origin:** Original message`,
            `**Whitelisted?** ${r.whitelisted ? "Yes" : "No"}.`,
            `**Blacklisted?** ${r.blacklisted ? "Yes" : "No"}.`,
            `**Trustworthy?** ${r.trustworthy && r.trustworthy[1] >= 8 ? (r.trustworthy[0] <= 60 ? "No" : "Yes") : "N/A"}. ${r.trustworthy ? `(${r.trustworthy[0]}% from ${r.trustworthy[1]} reviews)` : ""}`,
            `**Child-safe?** ${r.childsafe && r.childsafe[1] >= 8 ? (r.childsafe[0] <= 60 ? "No" : "Yes") : "N/A"}. ${r.childsafe ? `(${r.childsafe[0]}% from ${r.childsafe[1]} reviews)` : ""}`,
            Object.keys(r.wot || {}).length ? "```" + Object.keys(r.wot).map(tag => `${tag}: ${r.wot[tag]}%`).join(", ") + "```" : ""
          ].filter(line => line.length).join("\n"),
          inline: true
        })),
        color: constants.embedColor
      }
    }).catch() && message.delete();
    else message.reactions.removeAll();
  }

  if (message.content.startsWith(config.prefix) || message.content.match(`^<@!?${client.user.id}> `)) {
    let content = message.content.split(" ")
    if (content[0].match(`^<@!?${client.user.id}>`)) content.shift(); else content = message.content.slice(config.prefix.length).split(" ")
    const identifier = content.shift().toLowerCase(), command = aliases[identifier] || identifier;
    content = content.join(" ")

    const commandFile = commands[command]
    if (commandFile) {
      const args = parseArgs(content), permissionLevel = getPermissionLevel(message.member);

      if (permissionLevel < commandFile.permissionRequired) return message.channel.send("❌ You don't have permission to do this!");
      if (!commandFile.checkArgs(args, permissionLevel, content)) return message.channel.send(`❌ Invalid arguments! Usage is \`${config.prefix}${command}${Object.keys(commandFile.usage).map(a => " " + a).join("")}\`, for additional help, see \`${config.prefix}help\`.`)

      commandFile.run(client, message, args, { db, config, permissionLevel, content })
    }
  }
})

client
  .on("error", console.log)
  .on("guildCreate", guild => console.log(`Bot got added to server ${guild.name} (${guild.id})`) && client.users.get(config.owner).send(`Bot got added to server ${guild.name} (${guild.id})`))
  .on("guildDelete", guild => console.log(`Bot removed from server ${guild.name} (${guild.id})`) && client.users.get(config.owner).send(`Bot removed from server ${guild.name} (${guild.id})`))
  .on("guildUnavailable", guild => console.log(`Guild ${guild.name} is unavailable.`))
  .on("rateLimit", ({ timeout, limit, method, path }) => console.log(`Rate-limited. [${timeout}ms, ${method} ${path}, limit: ${limit}]`))
  .on("shardDisconnect", event => console.log("Disconnected:", event.reason))
  .on("shardReconnecting", () => console.log("Reconnecting..."))
  .on("shardResume", (_, replayed) => console.log(`Resumed. [${replayed} events replayed]`))
  .on("warn", info => console.log("Info:", info))
  .login(config.token);