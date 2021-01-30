const { emojis } = require("../constants");

module.exports = {
  mainOnly: true,
  description: "Purge everything after a message. And I mean everything.",
  options: [
    {
      type: 3,
      name: "message_id",
      description: "The message ID of the oldest message you want to delete.",
      required: true
    }
  ],
  aliases: [ "reversepurge" ],
  permissionRequired: 3 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ channel }, { message_id }) => {
  const afterMessage = await channel.messages.fetch(message_id);
  if (!afterMessage) return channel.send(`${emojis.tickno} No message with ID \`${message_id}\` was found in this channel.`);
  if (afterMessage.createdTimestamp < Date.now() - 1800000) return channel.send(`${emojis.tickno} You can only delete messages that are 30 minutes old. This limitation is not bypassable.`);

  channel.startTyping();

  let processing = true, amount = -1, afterID = parseInt(message_id);
  while (processing) {
    const messages = (await channel.messages.fetch({ limit: 100 })).filter(m => "DEFAULT" && parseInt(m.id) >= afterID);
    if (messages.size) {
      await channel.bulkDelete(messages);
      amount += messages.size;
    } else processing = false;
  }

  channel.send(`${emojis.tickyes} Deleted ${amount} messages.`);
  channel.stopTyping();
};