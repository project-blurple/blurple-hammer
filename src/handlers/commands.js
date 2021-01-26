const
  fs = require("fs"),
  config = require("../../config.json"),
  {
    guilds,
    resolvers: {
      getRole,
      getMember,
      getChannel
    },
    functions: {
      getUsage
    }
  } = require("../constants");

// loading commands
const commands = new Map(), aliases = new Map();
fs.readdir("./src/commands/", (err, files) => {
  if (err) return console.log(err);
  for (const file of files) if (file.endsWith(".js")) {
    const commandFile = require(`../commands/${file}`), fileName = file.replace(".js", "");
    commands.set(fileName, commandFile);
    if (commandFile.aliases) for (const alias of commandFile.aliases) aliases.set(alias, fileName);
  }
});

// processing command
module.exports.processCommand = message => {
  let content;
  if (message.content.match(`^<@!?${message.client.user.id}> `)) content = message.content.split(" ").slice(1);
  else content = message.content.slice(config.prefix.length).split(" ");
  const commandOrAlias = content.shift().toLowerCase(), commandName = aliases.get(commandOrAlias) || commandOrAlias;
  content = content.join(" ");

  const commandFile = commands.get(commandName);
  if (!commandFile) return;

  if (commandFile.mainOnly && message.guild.id !== guilds.main) return message.channel.send("❌ This command only works in the main server..");

  const permissionLevel = getPermissionLevel(message.member);
  if (permissionLevel < commandFile.permissionRequired) return message.channel.send("❌ You don't have permission to do this.");

  const rawArgs = (content.match(/"[^"]+"|[^ ]+/g) || []).map(arg => arg.startsWith("\"") && arg.endsWith("\"") ? arg.slice(1).slice(0, -1) : arg);

  const args = {};
  for (const i in rawArgs) {
    const { name = null, type = null } = commandFile.options[i] || {}, arg = rawArgs[i];
    if ( // if there's more args and the last option was a string, add the args to that string instead
      !name &&
      commandFile.options &&
      commandFile.options.length &&
      commandFile.options[commandFile.options.length - 1].type == 3
    ) args[commandFile.options[commandFile.options.length - 1].name] = args[commandFile.options[commandFile.options.length - 1].name] + " " + arg; 
    else args[name] = convertArg(type, arg, commandFile.options[i].choices, message.guild);
  }

  if (
    commandFile.options.filter(o => o.required).length > Object.keys(args) || // required amount of args is more than amount of args supplied
    commandFile.options.length < Object.keys(args) || // total args allowed is less than amount of args supplied
    commandFile.options.find(o => 
      o.required &&
      [null, undefined].includes(args[o.name])
    ) || // required arg is somehow invalid
    Object.values(args).includes(null) // arg supplied is somehow invalid
  ) {
    const usage = getUsage(commandFile.options);
    return message.channel.send(`❌ Invalid arguments. Usage is \`${config.prefix}${commandOrAlias}${usage ? ` ${usage}` : ""}\`.`);
  }

  const { client, guild, channel, member } = message;
  if (commandFile.hideSource) message.delete();
  return commandFile.run({ client, guild, channel, member }, args); // messageObjct, args
};

// registering and setting up slash commands
module.exports.setupSlashCommands = async client => {
  commands.forEach(({ description, options }, name) => client.api.applications(client.user.id).guilds(guilds.main).commands.post({ data: { name, description, options } }));

  client.ws.on("INTERACTION_CREATE", async interaction => {
    const commandFile = commands.get(interaction.data.name);
    
    const guild = client.guilds.cache.get(interaction.guild_id);
    const channel = guild.channels.cache.get(interaction.channel_id);
    const member = guild.members.cache.get(interaction.member.user.id);

    if (commandFile.mainOnly && guild.id !== guilds.main) return client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 3, data: { flags: 64, content: "❌ This command only works in the main server.." }}});

    const permissionLevel = getPermissionLevel(member);
    if (permissionLevel < commandFile.permissionRequired) return client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 3, data: { flags: 64, content: "❌ You don't have permission to do this."}}});

    const args = {};
    if (interaction.data.options) for (const slashArg of interaction.data.options) {
      const { type, choices } = commandFile.options.find(o => o.name == slashArg.name);
      args[slashArg.name] = convertArg(type, slashArg.value, choices, guild);
    }

    await client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: commandFile.hideSource ? 2 : 5 }}); // <user> used <command> with Blurple Hammer blabla 
    return commands.get(interaction.data.name).run({ client, guild, channel, member }, args);
  });

  console.log(`${commands.size} slash commands have been registered and is now ready.`);
};

function getPermissionLevel() {
  return 99;
}

function convertArg(type, arg, choices, guild) {
  let converted = arg;
  if (type == 4) converted = parseInt(arg);
  if (type == 5) converted = ["true", "yes", "y", "t", true, "false", "no", "n", "f", false].includes(typeof arg == "string" ? arg.toLowerCase() : arg) ? ["true", "yes", "y", "t", true].includes(typeof arg == "string" ? arg.toLowerCase() : arg) : null;
  if (type == 6) converted = getMember(arg, guild);
  if (type == 7) converted = getChannel(arg, guild);
  if (type == 8) converted = getRole(arg, guild);
  
  if (choices && choices.length) {
    if (choices.map(ch => ch.value).includes(converted)) return converted;
    else return null;
  } else return converted; 
}