const { channels: { public }, emojis, roles: { mod } } = require("../../constants");

module.exports = {
  description: "Lock the current channel, or all the public channels.",
  options: [
    {
      type: 5,
      name: "all",
      description: "Lock all public channels"
    }
  ],
  permissionRequired: 2 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ guild, channel, respond, edit }, { all }) => {
  if (all) {
    const channels = guild.channels.cache.filter(ch => public.includes(ch.id));
    await respond();
    await Promise.all(channels.map(lockChannel));
    return edit(`${emojis.tickyes} All public channels are now locked.`);
  } else {
    const success = await lockChannel(channel);
    if (success) respond(`${emojis.tickyes} This channel is now locked.`);
    else respond(`${emojis.tickno} This channel is already locked!`, true);
  }
};

async function lockChannel(channel) {
  let permission = channel.permissionOverwrites.find(po => po.id == channel.guild.roles.everyone);
  if (permission && permission.deny.has("SEND_MESSAGES")) return false;

  await channel.updateOverwrite(channel.guild.me, { "SEND_MESSAGES": true, "MANAGE_PERMISSIONS": true });
  await channel.updateOverwrite(mod, { "SEND_MESSAGES": true });
  await channel.updateOverwrite(channel.guild.roles.everyone, { "SEND_MESSAGES": false, "ADD_REACTIONS": false });
  return true;
}