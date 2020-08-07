module.exports = {
  description: "Strip or unstrip yourself.",
  usage: {},
  examples: {},
  aliases: [ "staffstrip" ],
  permissionRequired: 0, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length == 0
}

const stripped = new Map(), fs = require("fs");

module.exports.run = async (client, message, args, { permissionLevel }) => {
  if (stripped.get(message.member.user.id)) {
    await message.member.roles.add(stripped.get(message.member.user.id))
    stripped.delete(message.member.user.id)
  } else if (permissionLevel >= 1) {
    const roles = message.member.roles.cache.filter(r => r.id !== "442471461370724353" && !r.managed && message.guild.me.roles.highest.position > r.position && r.id !== message.guild.roles.everyone.id).map(r => r.id);
    stripped.set(message.member.user.id, roles)
    fs.writeFile("./src/storage/staffstrips/" + message.member.id + "-" + Date.now() + ".json", JSON.stringify(roles), 'utf8', () => {}); // logs
    await message.member.roles.remove(message.member.roles.cache.filter(r => r.id !== "442471461370724353"), "User stripped by " + message.author.tag)
  } else return;
  message.delete();
}

global.stripmeStripped = stripped;