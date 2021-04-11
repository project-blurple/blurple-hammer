const fs = require("fs"), { emojis, guilds, functions: { getPermissionLevel }} = require("../../constants"), config = require("../../../config.json");

module.exports = {
  description: "Get a list of prefix commands.",
  options: [],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
}

module.exports.run = async ({ client, member, respond }) => {
  const
    permissionLevel = getPermissionLevel({ id: member.user.id, client }),
    allowedCommands = commands.filter(c => {
      const { permissionRequired } = require(`../${c}.js`);
      if (permissionLevel >= permissionRequired) return true; else return false;
    })
  return respond(`${emojis.sparkle} Here's a list of prefix commands you can use:\n${allowedCommands.map(c => {
    const { usage, description } = require(`../${c}.js`);
    return `> • \`${config.prefix}${c}${Object.keys(usage).map(a => ` ${a}`).join("")}\`: ${description}`;
  }).join("\n")}`);
}

const commands = [];
fs.readdir("./src/commands", (err, files) => {
  if (err) return console.log(err);
  commands.push(...files.filter(f => f.endsWith(".js")).map(f => f.replace(".js", "")));
})