module.exports = {
  description: "Purge a channel from a raid, and get their IDs instantly.",
  usage: {
    "<first message id>": "The first message ID the raiders started the raid with.",
    "\"<keyword>\"": "The keyword the messages contained. It will be used as a filter, so everything else is normal. This needs to be surrounded by quotation marks."
  },
  examples: {
    "123456789012345678 \"haha get raided\"": "Will delete all messages after message with ID 123456789012345678 that contains \"haha get raided\". https://i.imgur.com/4ZFWeQA.png"
  },
  aliases: [],
  permissionRequired: 3, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length == 2
}

const constants = require("../../constants")

module.exports.run = async (client, message, args) => {
  const [ id, keyword ] = args;

  const afterMessage = await message.channel.messages.fetch(id);
  if (!afterMessage) return message.channel.send(`${constants.emojis.tickno} No message with ID \`${id}\` was found in this channel.`);
  if (afterMessage.createdTimestamp < message.createdTimestamp - 1800000) return message.channel.send(`${constants.emojis.tickno} You can only delete messages that are 30 minutes old. This limitation is not bypassable due to safety reasons.`)

  message.channel.startTyping();

  let processing = true, amount = -1, members = [], after = parseInt(id);
  while (processing) {
    const messages = (await message.channel.messages.fetch({ limit: 100 })).filter(m => parseInt(m.id) >= after && m.content.includes(keyword));
    if (!messages.size) processing = false;
    else {
      messages.forEach(m => members.push(m.member));
      await message.channel.bulkDelete(messages);
      amount += messages.size;

      if (messages.size == 100) await new Promise(resolve => setTimeout(resolve, 1000)) // so we don't hit the rate limit
    }
  }

  message.channel.stopTyping();

  members = members.filter(m => constants.getPermissionLevel(m) == 0).map(m => m.id).filter(constants.onlyUnique);

  message.author.send(`${constants.emojis.tickyes} Deleted ${amount} messages in ${message.channel}. The file attached contains the user IDs of the raiders. Staff members have been filtered out from the file.`, {
    files: [{
      name: [ "pbraid", message.channel.name, Date.now(), "txt" ].join("."),
      attachment: Buffer.from(members.join(" "))
    }]
  }).then(m => m.edit(`${m.content}\n📄 View it here: https://txt.discord.website/?txt=${[ m.channel.id, m.attachments.first().id, m.attachments.first().name.replace(".txt", "") ].join("/")}`));
}