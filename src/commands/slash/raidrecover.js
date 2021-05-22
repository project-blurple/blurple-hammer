const { emojis, functions: { getPermissionLevel, onlyUnique }} = require("../../constants");

module.exports = {
  description: "Purge everything after a message. And I mean everything.",
  options: [
    {
      type: 3,
      name: "first_message_id",
      description: "The message ID of the oldest message you want to delete.",
      required: true
    },
    {
      type: 3,
      name: "keyword",
      description: "The keyword the messages contained. It will be used as a filter for all the messages.",
      required: true
    }
  ],
  permissionRequired: 3 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ channel, member, respond, edit }, { first_message_id, keyword }) => {
  const afterMessage = await channel.messages.fetch(first_message_id);
  if (!afterMessage) return respond(`${emojis.tickno} No message with ID \`${first_message_id}\` was found in this channel.`, true);
  if (afterMessage.createdTimestamp < Date.now() - 1800000) return respond(`${emojis.tickno} You can only delete messages that are 30 minutes old. This limitation is not bypassable due to security reasons.`, true);

  await respond();

  let
    processing = true,
    amount = 0,
    afterID = parseInt(first_message_id),
    users = [];
  while (processing) {
    const messages = await channel.messages.fetch({ limit: 100 }).then(msgs => msgs.filter(m =>
      m.type == "DEFAULT" &&
      parseInt(m.id) >= afterID &&
      m.content.includes(keyword)
    ));
    if (messages.size) {
      users.push(...messages.map(m => m.member.id));
      await channel.bulkDelete(messages);
      amount += messages.size;
    } else processing = false;
  }

  edit(`${emojis.tickyes} Deleted ${amount} messages.`);

  users = users
    .filter(onlyUnique)
    .filter(id => getPermissionLevel({ id }) == 0);
  
  member.send(`${emojis.tickyes} Here is a file of all the user IDs of the raiders. Staff members have been filtered out. There was in total ${users.length} users who participated in the raid.`, {
    files: [
      {
        name: [ "raidrecover", channel.name, Date.now(), "txt" ].join("."),
        attachment: Buffer.from(users.join(" "))
      }
    ]
  }).then(m => m.edit(`${m.content}\n📄 View it here: https://txt.discord.website/?txt=${[ m.channel.id, m.attachments.first().id, m.attachments.first().name.replace(".txt", "") ].join("/")}`));
};