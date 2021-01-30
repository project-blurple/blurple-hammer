const { emojis, functions: { getPermissionLevel }, channels, gifs } = require("../constants");

module.exports = {
  description: "Ban someone if Auttaja is down.",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to ban",
      required: true
    },
    {
      type: 3,
      name: "reason",
      description: "The reason for your ban."
    }
  ],
  aliases: [ "buban", "backupban", "auttajadownplsban" ],
  permissionRequired: 3 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ guild, channel, member }, { user, reason = "No reason provided." }) => {
  if (getPermissionLevel(user) > 0) return channel.send(`${emojis.tickno} Are you seriously trynna ban one of your own?`);

  guild.channels.cache.get(channels.backupModerationLog).send({
    embed: {
      title: "Ban",
      color: 0x992d22,
      description: [
        `**User:** ${user} \`${user.user.tag}\` (${user.user.id})`,
        `**Moderator:** ${member} \`${member.user.tag}\` (${member.user.id})`,
        `**Reason:** ${reason}`
      ].join("\n"),
      thumbnail: {
        url: user.user.displayAvatarURL({ size: 256, dynamic: true })
      }
    }
  });
  await user.ban({ reason: `Action done by ${member.user.tag} (${member.user.id}) with reason: ${reason}` });
  channel.send(gifs.ban[Math.floor(Math.random() * gifs.ban.length)]);
};