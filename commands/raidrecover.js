module.exports = {
  description: "Purge a channel from a raid, and get their IDs instantly.",
  usage: {
    "<first message id>": "The first message ID the raiders started the raid with.",
    "<keyword(s ...)>": "The keyword(s) the messages contained. It will be used as a filter, so everything else is normal."
  },
  examples: {
    "123456789012345678 haha get raided": "Will delete all messages after message with ID 123456789012345678 that contains \"haha get raided\". https://i.imgur.com/4ZFWeQA.png"
  },
  aliases: [],
  permissionRequired: 3, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length >= 2
}

const onlyUnique = (value, index, self) => self.indexOf(value) == index;

module.exports.run = module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {
  const id = args.shift(), keyword = args.join(" ");

  const afterMessage = await message.channel.fetchMessage(id).catch(() => null);
  if (!afterMessage) return message.channel.send(constants.emojis.tickno + " No message with ID \`" + id + "\` was found in this channel.")
  if (afterMessage.createdTimestamp < message.createdTimestamp - 1800000) return message.channel.send(constants.emojis.tickno + " You can only delete messages that are 30 minutes old. This is for safety and security reasons and is not bypassable.")

  await message.react(constants.emojiSnowflakes.loading)

  let processing = true, amount = -1, users = [], after = parseInt(id);
  while (processing) {
    const messages = (await message.channel.fetchMessages({ limit: 100 })).filter(m => parseInt(m.id) >= after && m.cleanContent.includes(keyword))
    if (!messages.size) processing = false;
    else {
      messages.forEach(m => users.push(m.member))
      await message.channel.bulkDelete(messages);
      amount += messages.size;
    }
  }

  const members = users.filter(u => constants.getPermissionLevel(u) == 0).map(u => u.id).filter(onlyUnique)

  message.author.send(constants.emojis.tickyes + " Deleted " + amount + " messages in " + message.channel.toString() + ". The file attached contain the user IDs.", {
    files: [{
      name: ["pbraid", message.channel.name, Date.now(), "txt"].join("."),
      attachment: Buffer.from(members.join(" "))
    }]
  }).then(m => m.edit(m.content + "\n📄 View it here: https://txt.discord.website/?txt=" + [m.channel.id, m.attachments.first().id, m.attachments.first().filename.replace(".txt", "")].join("/")))
}