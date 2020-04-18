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

const { getMember } = require("../../utils/resolvers.js"), constants = require("../../constants")

module.exports.run = async (client, message, args) => {
  let members = args.map(search => getMember(search, message.guild));
  if (!members.length) return message.channel.send(`${constants.emojis.tickNo} No users were found with your query.`)

  const diff = {};
  for (const member of members) {
    let success;
    if (member.roles.cache.get(constants.roles.blacklist)) {
      diff[member.user.tag] = "-";
      success = await member.roles.remove(constants.roles.blacklist).catch(() => null)
    } else {
      diff[member.user.tag] = "+";
      success = await member.roles.add(constants.roles.blacklist).catch(() => null)
    }

    if (!success) diff[member.user.tag] = "?";
  }

  message.channel.send(`${constants.emojis.tickyes} Bot blacklist changes has been made: \`\`\`diff\n${Object.keys(diff).map(tag => diff[tag] + " " + tag).join("\n")}\`\`\``)
}