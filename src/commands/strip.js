const { strips } = require("../database"), { roles: serverRoles, functions: { getPermissionLevel } } = require("../constants");

module.exports = {
  mainOnly: true,
  hideSource: true,
  description: "Strip all your roles temporarily, or get them back.",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to strip instead of yourself."
    }
  ],
  aliases: [],
  permissionRequired: 0 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ guild, member }, { user = member }) => {
  let strip = await strips.get(user.user.id);
  if (strip) {
    strips.unset(user.user.id);
    user.roles.add(strip, user == member ? "User unstripped" : `${member.user.tag} (${member.user.id}) unstripped`);
  } else if (getPermissionLevel(member) >= 1) {
    const roles = user.roles.cache.filter(r => 
      r.id !== serverRoles.muted &&
      r.id !== guild.roles.everyone.id &&
      !r.managed &&
      guild.me.roles.highest.position > r.position
    ).map(r => r.id);
    strips.set(user.user.id, roles);
    user.roles.remove(roles, user == member ? "User stripped" : `${member.user.tag} (${member.user.id}) stripped`);
  }
};