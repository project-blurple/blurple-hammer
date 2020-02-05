module.exports = {
  description: "",
  usage: {},
  examples: {},
  aliases: [],
  permissionRequired: 7, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length >= 1
}

module.exports.run = module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {
  try {
    let code = args.join(" "), evaled = eval(code);

    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

    message.channel.send({
      embed: {
        title: constants.emojis.tickyes + " Success",
        description: "```js\n" + clean(evaled) + "```",
        color: constants.embedColor
      }
    })
  } catch(e) {
    message.channel.send({
      embed: {
        title: constants.emojis.tickno + " Error",
        description: "```fix\n" + clean(e) + "```",
        color: constants.embedColor
      }
    })
  }
}

function clean(text) {
  if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}