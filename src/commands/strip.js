module.exports = {
  description: "Strip or unstrip a user(s)'s roles.",
  usage: {
    "<user(s ...)>": "The user(s) you'd like to strip roles for, or unstrip."
  },
  examples: {},
  aliases: [],
  permissionRequired: 7, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length >= 1
}

const { getMember } = require("../utils/resolvers.js"), constants = require("../constants"), stripped = new Map(), fs = require("fs");

module.exports.run = async (client, message, args) => {
  let members = args.map(search => getMember(search, message.guild)).filter(m => m);
  if (!members.length) return message.channel.send(`${constants.emojis.tickno} No users were found with your query.`)

  const diff = {};
  for (const member of members) {
    let success;
    if (stripped.get(member.user.id)) {
      diff[member.user.tag] = "+";
      success = await member.roles.add(stripped.get(member.user.id))
      stripped.delete(member.user.id)
    } else {
      const roles = member.roles.cache.filter(r => r.id !== "442471461370724353" && !r.managed && message.guild.me.roles.highest.position > r.position && r.id !== message.guild.roles.everyone.id).map(r => r.id);
      stripped.set(member.user.id, roles)
      fs.writeFile(`./src/storage/strips/${message.author.id}-${member.id}-${Date.now()}.json`, JSON.stringify(roles), 'utf8', () => {}); // logs
      diff[member.user.tag] = "-";
      success = await member.roles.remove(roles, `User stripped by ${message.author.tag}`)
    }

    if (!success) diff[member.user.tag] = "?";
  }

  message.channel.send(`${constants.emojis.tickyes} User roles have been stripped/unstripped: \`\`\`diff\n${Object.keys(diff).map(tag => diff[tag] + " " + tag).join("\n")}\`\`\``)
}

global.stripStripped = stripped;