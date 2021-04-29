const { channels: { public }, emojis, functions: { lockMessage } } = require("../../constants");

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

module.exports.run = async ({ guild, channel, member, respond, edit }, { all }) => {
  if (all) {
    const channels = guild.channels.cache.filter(ch => public.includes(ch.id));
    await respond();
    await Promise.all(channels.map(ch => lockChannel(ch, member)));
    return edit(`${emojis.tickyes} All public channels are now locked.`);
  } else {
    const success = await lockChannel(channel, member);
    if (success) respond(`${emojis.tickyes} This channel is now locked.`);
    else respond(`${emojis.tickno} This channel is already locked!`, true);
  }
};

async function lockChannel(channel, author) {
  let permission = channel.permissionOverwrites.find(po => po.id == channel.guild.roles.everyone);
  if (permission && permission.deny.has("SEND_MESSAGES")) return false;
  
  await channel.edit({ topic: channel.topic + lockMessage(author) });
  await channel.updateOverwrite(channel.guild.me, { "SEND_MESSAGES": true });
  await channel.updateOverwrite(channel.guild.roles.everyone, { "SEND_MESSAGES": false });
  return true;
}