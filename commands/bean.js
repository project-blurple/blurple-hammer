module.exports = {
  description: "Bean someone because why not?",
  usage: {
    "<user(s ...) and/or role(s ...)>": "The user(s) and/or role(s') members you want to bean."
  },
  examples: {},
  aliases: [],
  permissionRequired: 1, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length >= 1
}

module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {
  const members = [];
  for (const arg of args) {
    let search = arg.split("_").join(" "), obj = [
      message.guild.members.find(m => search == m.user.tag),
      message.guild.members.get(search.replace("<@", "").replace("!", "").replace(">", "")),
      message.guild.roles.find(r => r.name == search),
      message.guild.roles.get(search.replace("<&", "").replace(">", ""))
    ].find(o => o)

    if (obj) {
      if (obj.members) obj.members.forEach(m => members.push(m));
      else members.push(obj);
    }
  }

  if (!members.length) return message.channel.send(constants.emojis.tickno + " No users were found with your query.")
  else {
    let quote = ", you've been beaned!"
    if (members.length > 1) quote = ": you've all been beaned!"
    if (members.length > 10) quote = ": MEGA-BEANED!"

    message.channel.send(members.map(m => m.toString()).join(", ") + quote)
  }
}