const { strips } = require("../../database"), { roles: serverRoles, functions: { getPermissionLevel }, emojis } = require("../../constants");

module.exports = {
  description: "Strip all your roles temporarily, or get them back afterwards.",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to strip instead of yourself."
    }
  ],
  permissionRequired: 0 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ client, guild, member: author, respond }, { user = author.id }) => {
  const strip = await strips.get(user), member = guild.members.cache.get(user);
  if (strip) {
    strips.unset(user);
    member.roles.add(strip, user == member ? "User unstripped" : `${member.user.tag} (${member.user.id}) unstripped`);
    return respond(`${emojis.tickyes} ${ member.id == author.id ? "You are" : `${member.user.tag} is`} no longer stripped.`, true);
  } else if (getPermissionLevel({ id: user, client }) >= 1) {
    const roles = member.roles.cache.filter(r => 
      r.id !== serverRoles.muted &&
      r.id !== guild.roles.everyone.id &&
      !r.managed &&
      guild.me.roles.highest.position > r.position
    ).map(r => r.id);
    strips.set(user, roles);
    member.roles.remove(roles, member.id == author.id ? "User stripped" : `${member.user.tag} (${member.user.id}) stripped`);
    return respond(`${emojis.tickyes} ${ member.id == author.id ? "You are" : `${member.user.tag} is`} now stripped.`, true);
  } else return respond(`${emojis.tickno} ${member.id == author.id ? "You" : "This person"} cannot strip.`, true);
};