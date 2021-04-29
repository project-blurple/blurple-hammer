const
  fs = require("fs"),
  config = require("../../config.json"),
  {
    guilds,
    functions: {
      getPermissionLevel
    }
  } = require("../constants");

module.exports = message => {
  let content;
  if (message.content.match(`^<@!?${message.client.user.id}> `)) content = message.content.split(" ").slice(1);
  else content = message.content.slice(config.prefix.length).split(" ");
  const commandOrAlias = content.shift().toLowerCase(), commandName = aliases.get(commandOrAlias) || commandOrAlias;
  content = content.join(" ");

  const commandFile = commands.get(commandName);
  if (!commandFile) return;

  if (commandFile.mainOnly && message.guild.id !== guilds.main) return message.channel.send("❌ This command only works in the main server.");

  const permissionLevel = getPermissionLevel(message.member);
  if (permissionLevel < commandFile.permissionRequired) return message.channel.send("❌ You don't have permission to do this.");

  const args = (content.match(/"[^"]+"|[^ ]+/g) || []).map(arg => arg.startsWith("\"") && arg.endsWith("\"") ? arg.slice(1).slice(0, -1) : arg);
  if (!commandFile.checkArgs(args, permissionLevel)) return message.channel.send(`❌ Invalid arguments. For help, type \`${config.prefix}help ${commandName}\`.`);

  return commandFile.run(message, args, { permissionLevel, content });
};

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