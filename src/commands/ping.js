const { emojis, functions: { msToTime } } = require("../constants");

module.exports = {
  description: "Get the latency of the bot.",
  options: [],
  aliases: [ "pong", "latency", "uptime" ],
  permissionRequired: 0 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ client, channel }) => {
  const
    before = Date.now(),
    botMsg = await channel.send(`${emojis.loading} Pinging...`),
    after = Date.now();
  botMsg.edit(`${emojis.sparkle} Pong! Server latency is \`${after - before}ms\`, API latency is \`${Math.round(client.ws.ping)}ms\` and my uptime is \`${msToTime(client.uptime)}\`.`);
};