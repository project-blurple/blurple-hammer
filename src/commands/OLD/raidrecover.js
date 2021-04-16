const { emojis, functions: { getPermissionLevel, onlyUnique } } = require("../constants");

module.exports = {
  mainOnly: true,
  description: "Purge a channel from a raid, and get the raiders' IDs.",
  options: [
    {
      type: 3,
      name: "first_message_id",
      description: "The first message ID the raiders started the raid with.",
      required: true
    },
    {
      type: 3,
      name: "keyword",
      description: "The keyword the messages contained. It will be used as a filter for all the messages.",
      required: true
    }
  ],
  aliases: [],
  permissionRequired: 3 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ channel, member }, { first_message_id, keyword }) => {
  const afterMessage = await channel.messages.fetch(first_message_id);
  if (!afterMessage) return channel.send(`${emojis.tickno} No message with ID \`${first_message_id}\` was found in this channel.`);
  if (afterMessage.createdTimestamp < Date.now() - 1800000) return channel.send(`${emojis.tickno} You can only delete messages that are 30 minutes old. This limitation is not bypassable.`);

  channel.startTyping();

  let processing = true, amount = -1, users = [], afterID = parseInt(first_message_id);
  while (processing) {
    const messages = (await channel.messages.fetch({ limit: 100 })).filter(m => m.type == "DEFAULT" && parseInt(m.id) >= afterID && m.content.includes(keyword));
    if (messages.size) {
      messages.forEach(m => users.push(m.member));
      await channel.bulkDelete(messages);
      amount += messages.size;
    } else processing = false;
  }

  channel.send(`${emojis.tickyes} Deleted ${amount} messages.`);
  channel.stopTyping();

  users = users
    .filter(m => getPermissionLevel(m) == 0)
    .map(m => m.id)
    .filter(onlyUnique);
  
  member.send(`${emojis.tickyes} Here is a file of all the user IDs of the raiders. Staff members have been filtered out.`, {
    files: [
      {
        name: [ "blurpleraid", channel.name, Date.now(), "txt" ].join("."),
        attachment: Buffer.from(users.join(" "))
      }
    ]
  }).then(m => m.edit(`${m.content}\n📄 View it here: https://txt.discord.website/?txt=${[ m.channel.id, m.attachments.first().id, m.attachments.first().name.replace(".txt", "") ].join("/")}`));
};