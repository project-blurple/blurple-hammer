module.exports = {
  description: "Get help on how to use the bot.",
  usage: {},
  examples: {},
  aliases: [],
  permissionRequired: 0, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => !args.length
}

const constants = require("../constants");

module.exports.run = async (client, message, args, { content }) => {
  return message.author.send({
    embed: {
      title: client.user.tag,
      description: [
        `${constants.emojis.wave} I'm a moderation bot designed for Project Blurple.`,
        "📖 My source code can be located here: [https://github.com/project-blurple/blurple-hammer](https://github.com/project-blurple/blurple-hammer)",
        "📄 Although we do have documentation for the bot, it's personalized for Project Blurple's Staff team and also therefore not available to the public."
      ].join("\n"),
      color: constants.embedColor
    }
  }).then(() => message.react(constants.emojiSnowflakes.tickyes)).catch(() => message.react(constants.emojiSnowflakes.tickno))
}