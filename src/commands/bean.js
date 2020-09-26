module.exports = {
  description: "Bean someone ... because why not?",
  usage: {
    "<user(s ...)>": "The user(s) you want to bean. Yes, you can bean multiple users."
  },
  examples: {},
  aliases: [],
  permissionRequired: 1, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length
}

const { getMembers } = require("../utils/resolvers.js"), constants = require("../constants")

module.exports.run = async (client, message, args) => {
  let members = getMembers(args, message.guild)
  if (!members.length) return message.channel.send(`${constants.emojis.tickno} No users were found with your query.`)
  
  let quote = ", you've been beaned!"
  if (members.length > 1) quote = ": you've all been beaned!"
  message.channel.send(members.map(m => m.toString()).join(", ") + quote)
}