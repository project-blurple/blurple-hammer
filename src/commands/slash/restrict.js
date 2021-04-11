const { emojis, restrictions } = require("../../constants");

module.exports = {
  description: "Restrict a user's abilities",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to restrict or un-restrict",
      required: true
    },
    ...restrictions.map(({ name, description }) => ({ type: 5, name, description }))
  ],
  permissionRequired: 2 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
}

module.exports.run = async ({ guild, member: author, respond }, args) => {
  const member = guild.members.cache.get(args.user);
  delete args.user;

  if (!Object.keys(args).length) return respond(`${emojis.tickno} You need to add other arguments. For example, if you want to restrict embeds, do \`/restrict ... embed: True\`.`, true)

  const
    addRestrictions = Object.keys(args).filter(name => args[name] == true).map(name => restrictions.find(r => r.name == name)),
    removeRestrictions = Object.keys(args).filter(name => args[name] == false).map(name => restrictions.find(r => r.name == name));
  if (addRestrictions.length) await member.roles.add(addRestrictions.map(r => r.role), `Added by ${author.user.tag} (${author.user.id})`);
  if (removeRestrictions.length) await member.roles.remove(removeRestrictions.map(r => r.role), `Removed by ${author.user.tag} (${author.user.id})`);

  return respond(`${emojis.tickyes} ${member.user.tag} has updated restrictions:\n${[...addRestrictions.map(r => r.disallowed), ...removeRestrictions.map(r => r.allowed)].map(l => "> • " + l).join("\n")}`)
}