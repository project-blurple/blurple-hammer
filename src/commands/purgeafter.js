module.exports = {
  description: "",
  usage: {
    "<message id>": "The message ID of the oldest message you want to delete. It will delete all messages after this message as well."
  },
  examples: {},
  aliases: [ "reversepurge" ],
  permissionRequired: 3, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length == 1
}

const constants = require("../constants")

module.exports.run = async (client, message, args) => {
  const id = args[0];
  
  const afterMessage = await message.channel.messages.fetch(id);
  if (!afterMessage) return message.channel.send(`${constants.emojis.tickno} No message with ID \`${id}\` was found in this channel.`);
  if (afterMessage.createdTimestamp < message.createdTimestamp - 1800000) return message.channel.send(`${constants.emojis.tickno} You can only delete messages that are 30 minutes old. This limitation is not bypassable due to safety reasons.`)

  message.channel.startTyping();

  let processing = true, amount = -1, after = parseInt(id);
  while (processing) {
    const messages = (await message.channel.messages.fetch({ limit: 100 })).filter(m => parseInt(m.id) >= after);
    if (!messages.size) processing = false;
    else {
      await message.channel.bulkDelete(messages);
      amount += messages.size;

      if (messages.size == 100) await new Promise(resolve => setTimeout(resolve, 1000)) // so we don't hit the rate limit
    }
  }

  message.channel.send(`${constants.emojis.tickyes} Deleted ${amount} messages.`).then(() => message.channel.stopTyping());
}