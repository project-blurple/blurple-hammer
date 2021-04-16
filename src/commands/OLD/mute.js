const { emojis, functions: { getPermissionLevel }, channels, gifs } = require("../constants");

module.exports = {
  mainOnly: true,
  description: "Mute someone if Auttaja is down.",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to mute",
      required: true
    },
    {
      type: 3,
      name: "reason",
      description: "The reason for your mute."
    }
  ],
  aliases: [ "bumute", "backupmute", "auttajadownplsmute" ],
  permissionRequired: 3 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ guild, channel, member }, { user, reason = "No reason provided." }) => {
  if (getPermissionLevel(user) > 0) return channel.send(`${emojis.tickno} Are you seriously trynna mute one of your own?`);

  guild.channels.cache.get(channels.backupModerationLog).send({
    embed: {
      title: "Mute",
      color: 0xf1c40f,
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
  await user.mute({ reason: `Action done by ${member.user.tag} (${member.user.id}) with reason: ${reason}` });
  channel.send(gifs.mute[Math.floor(Math.random() * gifs.mute.length)]);
};