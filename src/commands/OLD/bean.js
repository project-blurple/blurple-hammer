const { resolvers: { getMember }, emojis } = require("../../constants");

module.exports = {
  description: "Bean someone ... because why not?",
  usage: {
    "<user>": "The user you want to bean"
  },
  examples: {},
  aliases: [],
  permissionRequired: 1, // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
  checkArgs: (args) => !args.length
};

module.exports.run = async ({ channel, guild }, [ user ]) => {
  const member = getMember(user, guild);
  if (!member) return channel.send(`${emojis.tickno} No user was found with that search.`);
  return channel.send(`${emojis.hammer} ${member}, you've been beaned!`);
};