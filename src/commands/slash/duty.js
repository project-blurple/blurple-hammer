const { roles, emojis } = require("../../constants");

module.exports = {
  description: "Toggle the Duty-role",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to toggle for instead of yourself."
    }
  ],
  permissionRequired: 2 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = ({ guild, member: author, respond }, { user = author.id }) => {
  const member = guild.members.cache.get(user), role = guild.roles.cache.get(roles.staffonduty);
  if (member.roles.cache.find(r => r.id == role.id)) {
    member.roles.remove(role, user == member ? "User toggled" : `${member.user.tag} (${member.user.id}) toggled`);
    return respond(`${emojis.tickyes} ${member.id == author.id ? "You no longer have" : `${member.user.tag} no longer has`} the duty role.`);
  } else {
    member.roles.add(role, user == member ? "User toggled" : `${member.user.tag} (${member.user.id}) toggled`);
    return respond(`${emojis.tickyes} ${member.id == author.id ? "You now have" : `${member.user.tag} now has`} the duty role.`);
  }
}; 