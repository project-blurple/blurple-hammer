module.exports = {
  description: "",
  usage: {
    "<message id>": "The message ID of the oldest message you want to delete. It will delete all messages after this message as well.",
    "[-f]": "If you are a Senior Moderator, you can bypass"
  },
  examples: {},
  aliases: [ "reversepurge" ],
  permissionRequired: 2, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length == 1
}

module.exports.run = module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {
  let after = parseInt(args[0]);
  if (!after || after.toString().length < 16) return message.channel.send(constants.emojis.tickno + " Invalid message ID.")

  let afterMessage = await message.channel.fetchMessage(args[0]).catch(() => null)
  if (!afterMessage) return message.channel.send(constants.emojis.tickno + " Could not find message.");
  if (afterMessage.timestamp < message.createdTimestamp - 1800000) return message.channel.send(constants.emojis.tickno + " You can only delete messages that are 30 minutes old. This is for safety and security reasons and is not bypassable.")

  after -= 1;

  let processing = true, amount = 0;
  while (processing) {
    let messages = (await message.channel.fetchMessages({ limit: 100, after: after.toString() })).filter(m => parseInt(m.id) > after);
    if (!messages.array().length) processing = false;
    else {
      await message.channel.bulkDelete(messages);
      amount += messages.array().length
    }
  }

  message.channel.send(constants.emojis.tickyes + " Purged " + amount + " messages.")
}