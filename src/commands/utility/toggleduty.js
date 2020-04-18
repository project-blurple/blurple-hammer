module.exports = {
  description: "Toggle the Staff on Duty role.",
  usage: {
    "<user(s ...) and/or role(s ...)>": "The user(s) and/or role(s') members you want to toggle the Staff on Duty role for."
  },
  examples: {},
  aliases: [ "sod" ],
  permissionRequired: 1, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => true
}

const { getMembers } = require("../../utils/resolvers.js"), constants = require("../../constants")

module.exports.run = async (client, message, args) => {
  if (args.length) {
    let members = getMembers(args, message.guild);
    if (!members.length) return message.channel.send(constants.emojis.tickno + " No users were found with your query.");

    const diff = {};
    for (const member of members) {
      let success = true;
      if (constants.getPermissionLevel(member) < 1) diff[member.user.tag] = "?";
      else if (member.roles.cache.get(constants.roles.duty)) {
        diff[member.user.tag] = "-";
        success = await member.roles.remove(constants.roles.duty, `Requested by ${message.author.tag} (${message.author.id})`).catch(() => null);
      } else {
        diff[member.user.tag] = "+";
        success = await member.roles.add(constants.roles.duty, `Requested by ${message.author.tag} (${message.author.id})`).catch(() => null)
      }

      if (!success) diff[member.user.tag] = "?";
    }
    
    return message.channel.send(`${constants.emojis.tickyes} Staff on Duty-members have been changed: \`\`\`diff\n${Object.keys(diff).map(tag => diff[tag] + " " + tag).join("\n")}\`\`\``)
  }
  
  if (message.member.roles.cache.get(constants.roles.duty)) message.member.roles.remove(constants.roles.duty) && message.channel.send(`${constants.emojis.tickyes} You no longer have the Staff on Duty-role.`)
  else message.member.roles.add(constants.roles.duty) && message.channel.send(`${constants.emojis.tickyes} You now have the Staff on Duty-role.`)
}