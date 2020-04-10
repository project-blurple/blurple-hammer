module.exports = {
  description: "Evaluate some code.",
  usage: {
    "<code ...>": "The code you want to run through the bot."
  },
  examples: {},
  aliases: [],
  permissionRequired: 7, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length >= 1
}

module.exports.run = async (client, message, args, db, constants, { content }) => {
  try {
    let evaled = eval(content);
    if (typeof evaled != "string") evaled = require("util").inspect(evaled);
    message.channel.send(`🆗 Evaluated successfully.\n\`\`\`js\n${evaled}\`\`\``)
  } catch(e) {
    if (typeof e == "string") e = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
    message.channel.send(`🆘 JavaScript failed.\n\`\`\`fix\n${e}\`\`\``)
  }
}