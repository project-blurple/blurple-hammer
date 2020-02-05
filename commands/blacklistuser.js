module.exports = {
  description: "Blacklist (or un-blacklist) someone from all the Blurple bots.",
  usage: {
    "<user(s ...)>": "The user(s) you'd like to blacklist or un-blacklist."
  },
  examples: {},
  aliases: [ "bl", "bluser" ],
  permissionRequired: 1, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length >= 1
}

module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {
  const members = [];
  for (const arg of args) {
    let search = arg.split("_").join(" "), obj = [
      message.guild.members.find(m => search == m.user.tag),
      message.guild.members.get(search.replace("<@", "").replace("!", "").replace(">", ""))
    ].find(o => o)

    if (obj) members.push(obj);
  }

  if (!members.length) return message.channel.send(constants.emojis.tickno + " No users were found with your query.")
  else {
    const diff = {};
    for (const member of members) {
      if (member.roles.get(constants.roles.blacklist)) {
        diff[member.user.tag] = false;
        await member.removeRole(constants.roles.blacklist).catch(() => {})
      } else {
        diff[member.user.tag] = true;
        await member.addRole(constants.roles.blacklist).catch(() => {})
      }
    }

    const changes = [];
    for (const member in diff) if (diff[member]) changes.push("+ " + member); else changes.push("- " + member);

    message.channel.send(constants.emojis.tickyes + " Bot blacklist changes has been made: ```diff\n" + changes.join("\n") + "```")
  }
}