const { emojis, functions: { getPermissionLevel }, channels, gifs } = require("../constants");

module.exports = {
  mainOnly: true,
  description: "Kick someone if Auttaja is down.",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to kick",
      required: true
    },
    {
      type: 3,
      name: "reason",
      description: "The reason for your kick."
    }
  ],
  aliases: [ "bukick", "backupkick", "auttajadownplskick" ],
  permissionRequired: 3 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ guild, channel, member }, { user, reason = "No reason provided." }) => {
  if (getPermissionLevel(user) > 0) return channel.send(`${emojis.tickno} Are you seriously trynna kick one of your own?`);

  guild.channels.cache.get(channels.backupModerationLog).send({
    embed: {
      title: "Kick",
      color: 0x3498db,
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
  await user.kick({ reason: `Action done by ${member.user.tag} (${member.user.id}) with reason: ${reason}` });
  channel.send(gifs.kick[Math.floor(Math.random() * gifs.kick.length)]);
};