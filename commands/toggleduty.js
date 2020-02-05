module.exports = {
  description: "",
  usage: {},
  examples: {},
  aliases: [ "sod" ],
  permissionRequired: 1, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => true
}

const onlyUnique = (value, index, self) => self.indexOf(value) == index;

module.exports.run = module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {
  if (args.length >= 1) {
    let members = [];
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

    members = members.map(m => m.id).filter(onlyUnique).map(id => members.find(m => m.id == id))

    if (!members.length) return message.channel.send(constants.emojis.tickno + " No users were found with your query.")
    else {
      const diff = {};
      for (const member of members) {
        if (member.roles.get(constants.roles.duty)) {
          diff[member.user.tag] = "-";
          await member.removeRole(constants.roles.duty).catch(console.log)
        } else {
          if (member.roles.get(constants.roles.staff)) {
            diff[member.user.tag] = "+";
            await member.addRole(constants.roles.duty).catch(console.log)
          } else diff[member.user.tag] = "§";
        }
      }

      const changes = Object.keys(diff).map(member => diff[member] + " " + member)

      message.channel.send(constants.emojis.tickyes + " Staff on Duty members has changed: ```diff\n" + changes.join("\n") + "```")
    }
  } else {
    if (message.member.roles.get(constants.roles.duty)) {
      await message.member.removeRole(constants.roles.duty).catch(() => {})
      message.channel.send(constants.emojis.tickyes + " You are no longer on duty.")
    } else {
      await message.member.addRole(constants.roles.duty).catch(() => {})
      message.channel.send(constants.emojis.tickyes + " You are now on duty!")
    }
  }
}