module.exports = {
  description: "Get help on how to use the bot.",
  usage: {},
  examples: {},
  aliases: [],
  permissionRequired: 0, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => !args.length
}

module.exports.run = module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {
  return message.author.send({
    embed: {
      title: client.user.tag,
      description: [
        constants.emojis.wave + " I'm a moderation bot designed for Project Blurple.",
        "📖 My source code can be located here: [https://github.com/project-blurple/blurple-hammer](https://github.com/project-blurple/blurple-hammer)",
        "📄 My documentation can be found here: [https://docs-for.a-mod-bot.but-it-actually.works](https://docs-for.a-mod-bot.but-it-actually.works)"
      ].join("\n"),
      color: 7506394
    }
  }).then(() => message.react(constants.emojiSnowflakes.thumbsup)).catch(() => message.react(constants.emojiSnowflakes.thumbsdown))
}