const { emojis } = require("../../constants");

module.exports = {
  description: "Purge everything after a message. And I mean everything.",
  options: [
    {
      type: 3,
      name: "message_id",
      description: "The message ID of the oldest message you want to delete.",
      required: true
    }
  ],
  permissionRequired: 3 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ channel, respond, edit }, { message_id }) => {
  const afterMessage = await channel.messages.fetch(message_id);
  if (!afterMessage) return respond(`${emojis.tickno} No message with ID \`${message_id}\` was found in this channel.`, true);
  if (afterMessage.createdTimestamp < Date.now() - 1800000) return channel.send(`${emojis.tickno} You can only delete messages that are 30 minutes old. This limitation is not bypassable due to security reasons.`, true);

  await respond();

  let
    processing = true,
    amount = 0,
    afterID = parseInt(message_id);
  while (processing) {
    const messages = await channel.messages.fetch({ limit: 100 }).then(msgs => msgs.filter(m =>
      m.type == "DEFAULT" &&
      parseInt(m.id) >= afterID &&
      m.flags.bitfield !== 128 // loading message
    ));
    if (messages.size) {
      await channel.bulkDelete(messages);
      amount += messages.size;
    } else processing = false;
  }

  edit(`${emojis.tickyes} Deleted ${amount} messages.`);
};