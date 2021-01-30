const { channels: { public }, emojis, functions: { lockMessage } } = require("../constants");

module.exports = {
  mainOnly: true,
  description: "Lock the current channel, or all the public channels.",
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

module.exports.run = async ({ guild, channel, member }, { all = false }) => {
  if (all) {
    const channels = guild.channels.cache.filter(ch => public.includes(ch.id));
    channels.map(ch => lockChannel(ch, member));
  } else {
    if (!(await lockChannel(channel, member))) channel.send(`${emojis.tickno} This channel is already locked!`);
  }
};

async function lockChannel(channel, author) {
  let permission = channel.permissionOverwrites.find(po => po.id == channel.guild.roles.everyone);
  if (permission && permission.deny.has("SEND_MESSAGES")) return false;
  
  await channel.edit({ topic: `${channel.topic || ""}\n\n${emojis.weewoo} ${emojis.weewoo} ${lockMessage(author)} ${emojis.weewoo} ${emojis.weewoo}` });
  await channel.updateOverwrite(channel.guild.me, { "SEND_MESSAGES": true });
  await channel.updateOverwrite(channel.guild.roles.everyone, { "SEND_MESSAGES": false });
  await channel.send(`${emojis.weewoo} ***The channel has been locked.***`);
  return true;
}