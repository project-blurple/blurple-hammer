const { emojis, restrictions } = require("../constants");

module.exports = {
  description: "Give or restrict a user's abilities",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to modify restrictions of",
      required: true
    },
    {
      type: 3,
      name: "type",
      description: "The type of restriction.",
      required: true,
      choices: restrictions.map(({ name, description }) => ({ name: description, value: name }))
    },
    {
      type: 5,
      name: "restricted",
      description: "If they're going to have this restricted or not.",
      required: true
    }
  ],
  aliases: [],
  permissionRequired: 2 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ guild, channel, member }, { user, type, restricted }) => {
  const
    restriction = restrictions.find(r => r.name == type),
    role = guild.roles.cache.get(restriction.role);
  if (restricted) {
    await user.roles.add(role, `Added by ${member.user.tag} (${member.user.id})`);
    channel.send(`${emojis.tickyes} ${user.user.tag} can no longer ${restriction.description.toLowerCase()}.`);
  } else {
    await user.roles.remove(role, `Removed by ${member.user.tag} (${member.user.id})`);
    channel.send(`${emojis.tickyes} ${user.user.tag} can now ${restriction.description.toLowerCase()} again.`);
  }
};