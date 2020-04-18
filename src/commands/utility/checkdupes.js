module.exports = {
  description: "Filter out duplicates of a list of IDs.",
  usage: {
    "<ids ...>": "A list of IDs to filter out duplicates of, separated with a space."
  },
  examples: {
    "a b b b c c d e": "Will return \"a b c d e\"."
  },
  aliases: [ "nodupes" ],
  permissionRequired: 1, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length >= 1
}

const constants = require("../../constants")

module.exports.run = async (client, message, args, { content }) => {
  message.channel.send(`${constants.emojis.sparkle} Here ya go: \`\`\`fix\n${content.split(" ").filter(s => s.length).filter(constants.onlyUnique).join(" ")}\`\`\``)
}