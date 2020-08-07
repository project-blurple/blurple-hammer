module.exports = {
  description: "Get the latency of the bot.",
  usage: {},
  examples: {},
  aliases: [ "pong", "latency", "uptime" ],
  permissionRequired: 0, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => !args.length
}

const constants = require("../constants");

module.exports.run = async (client, message, args) => {
  const botMsg = await message.channel.send(`${constants.emojis.loading} Pinging...`)

  botMsg.edit(`${constants.emojis.sparkle} Pong! Server latency is \`${botMsg.createdTimestamp - message.createdTimestamp}ms\`, API latency is \`${Math.round(client.ws.ping)}ms\` and my uptime is \`${constants.msToTime(client.uptime)}\`.`)
}