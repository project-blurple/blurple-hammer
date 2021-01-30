const { channels: { public }, emojis } = require("../constants");

module.exports = {
  mainOnly: true,
  description: "Unlock the current channel, or all the public channels.",
  options: [
    {
      type: 5,
      name: "all",
      description: "Lock all public channels"
    }
  ],
  aliases: [],
  permissionRequired: 2 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ guild, channel }, { all = false }) => {
  if (all) {
    const channels = guild.channels.cache.filter(ch => public.includes(ch.id));
    channels.map(ch => unlockChannel(ch));
  } else {
    if (!(await unlockChannel(channel))) channel.send(`${emojis.tickno} This channel is not locked!`);
  }
};

async function unlockChannel(channel) {
  let permission = channel.permissionOverwrites.find(po => po.id == channel.guild.roles.everyone);
  if (permission && !permission.deny.has("SEND_MESSAGES")) return false;
  
  await channel.edit({ topic: channel.topic.split("\n\n")[0] });
  await channel.updateOverwrite(channel.guild.roles.everyone, { "SEND_MESSAGES": null });
  await channel.send(`${emojis.weewoo} ***The channel has been unlocked.***`);
  return true;
}