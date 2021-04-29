const { channels: { public }, emojis } = require("../../constants");

module.exports = {
  description: "Unlock the current channel, or all the public channels.",
  options: [
    {
      type: 5,
      name: "all",
      description: "Unlock all public channels"
    }
  ],
  permissionRequired: 2 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ guild, channel, respond, edit }, { all }) => {
  if (all) {
    const channels = guild.channels.cache.filter(ch => public.includes(ch.id));
    await respond();
    await Promise.all(channels.map(ch => unlockChannel(ch)));
    return edit(`${emojis.tickyes} All public channels are now unlocked.`);
  } else {
    const success = await unlockChannel(channel);
    if (success) respond(`${emojis.tickyes} This channel is now unlocked.`);
    else respond(`${emojis.tickno} This channel is not locked!`, true);
  }
};

async function unlockChannel(channel) {
  let permission = channel.permissionOverwrites.find(po => po.id == channel.guild.roles.everyone);
  if (permission && !permission.deny.has("SEND_MESSAGES")) return false;
  
  await channel.edit({ topic: channel.topic.split("\n\n")[0] });
  await channel.updateOverwrite(channel.guild.roles.everyone, { "SEND_MESSAGES": null });
  return true;
}