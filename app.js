const Discord = require("discord.js"), fs = require("fs"), config = require("./config.json"), constants = require("./constants")(config), { getPermissionLevel, scanLinks, emojis, emojiSnowflakes, linkRegex } = constants;

const client = new Discord.Client({ messageSweepInterval: 60, messageCacheLifetime: 5, disableEveryone: true, disabledEvents: ["TYPING_START", "PRESENCE_UPDATE", "GUILD_BAN_ADD", "GUILD_BAN_REMOVE", "USER_NOTE_UPDATE", "USER_SETTINGS_UPDATE", "VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE", "RELATIONSHIP_ADD", "RELATIONSHIP_REMOVE"], restTimeOffset: 200, fetchAllMembers: true })
const db = require("./database.js")(client, config, constants);

client.on("ready", () => {
  console.log("Ready as " + client.user.tag);
})

const commands = {}, aliases = {} // { "command": require("that_command") }, { "alias": "command" }
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  for (let file of files) if (file.endsWith(".js")) {
    let commandFile = require("./commands/" + file), fileName = file.replace(".js", "")
    commands[fileName] = commandFile
    if (commandFile.aliases) for (let alias of commandFile.aliases) aliases[alias] = fileName
  }
})

client.on("message", async message => {
  if (message.author.bot || !message.guild) return;

  const links = message.content.match(linkRegex); // https://stackoverflow.com/a/3809435
  if (getPermissionLevel(message.member) < 1) {
    const results = await scanLinks(links);
    if (!results.safe) {
      return;
    }
  }

  if (message.content.startsWith(config.prefix) || message.content.match(`^<@!?${client.user.id}> `)) {
    if (!message.member && message.author.id) try { message.member = await message.guild.fetchMember(message.author.id, true) } catch(e) {} // If a member is missing, we try to load that member in before executing the command.

    let args = message.content.split(" ");
    if (args[0].match(`^<@!?${client.user.id}>`)) args.shift(); else args = message.content.slice(config.prefix.length).split(" ");
    const identifier = args.shift().toLowerCase(), command = aliases[identifier] || identifier

    const commandFile = commands[command], permissionLevel = getPermissionLevel(message.member)
    if (commandFile) {
      if (permissionLevel < commandFile.permissionRequired) return message.channel.send("❌ You don't have permission to do this!");
      if (commandFile.checkArgs(args, permissionLevel) !== true) return message.channel.send("❌ Invalid arguments! Usage is `" + config.prefix + command + Object.keys(commandFile.usage).map(a => " " + a).join("") + "\`, for additional help, see `" + config.prefix + "help`.");
      
      commandFile.run(client, message, args, config, constants, permissionLevel, db)
    }
  } else if (message.content.match(`^<@!?${client.user.id}>`)) commands["help"].run(client, message, [], config, constants, getPermissionLevel(message.member), db)
})

client
  .on("messageUpdate", async (message, newMessage) => {
    if (!message.guild || message.author.bot) return;

    let oldLinks = message.content.match(linkRegex), newLinks = newMessage.content.match(linkRegex), diff = newLinks ? newLinks.filter(l => !oldLinks.includes(l)) : []
    if (getPermissionLevel(message.member) < 1) {
      const results = await scanLinks(diff);
      if (!results.safe) {
        return;
      }
    }
  })

  .on("rateLimit", rl => rl.path.includes("reactions") ? null : console.log("Rate limited. [" + rl.timeDifference + "ms, endpoint: " + rl.path + ", limit: " + rl.limit + "]"))
  .on("disconnect", dc => console.log("Disconnected:", dc))
  .on("reconnecting", () => console.log("Reconnecting..."))
  .on("resume", replayed => console.log("Resumed. [" + replayed + " events replayed]"))
  .on("error", err => console.log("Unexpected error:", err))
  .on("warn", warn => console.log("Unexpected warning:", warn))
  .login(config.token)