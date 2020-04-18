module.exports = {
  description: "Lock the current channel, or all the public channels.",
  usage: {},
  examples: {},
  aliases: [],
  permissionRequired: 2, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => {
    if (args[0] == "-public" && args.length == 1) return true;
    else if (!args.length) return true;
    else return false;
  }
}

const constants = require("../../constants");

module.exports.run = async (client, message, args) => {
  if (args[0] == "-public") {
    const channels = message.guild.channels.cache.filter(ch => constants.publicChannels.includes(ch.id));
    if (!channels.size) return message.channel.send(`${constants.emojis.tickno} This server doesnt have any public channels configured, unfortunately.`)
    else channels.map(ch => lockChannel(ch, message.author, constants))
  } else {
    let success = await lockChannel(message.channel, message.author, constants)
    if (success) message.delete();
    else message.channel.send(`${constants.emojis.tickno} This channel is already locked!`)
  }
}

async function lockChannel(channel, author, constants) {
  let permission = channel.permissionOverwrites.find(po => po.id == channel.guild.roles.everyone);
  if (permission.deny.has("SEND_MESSAGES")) return false;
    
  await channel.edit({ topic: `${channel.topic || ""}\n\n${constants.lockMessage(author)}` })
  await permission.update({ "SEND_MESSAGES": false })
  await channel.send(`${constants.emojis.weewoo} ***The channel has been locked.***`)
  return true;
}