const { roles, emojis } = require("../../constants");

module.exports = {
  description: "Remove someone's Blurple Users-role",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to remove the role of.",
      required: true
    }
  ],
  permissionRequired: 2 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = ({ guild, respond }, { user }) => {
  const member = guild.members.cache.get(user), role = guild.roles.cache.get(roles.blurpleusers);
  if (member.roles.cache.has(role.id)) {
    member.roles.remove(role, `${member.user.tag} (${member.user.id}) removed`);
    return respond(`${emojis.tickyes} Role has been removed.`, true);
  } else return respond(`${emojis.tickno} This user doesn't have the Blurple Users role.`, true);
}; 