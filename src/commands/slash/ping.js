const { emojis, functions: { msToTime }} = require("../../constants");

module.exports = {
  description: "Get the latency of the bot.",
  options: [],
  permissionRequired: 0 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ client, respond, edit }) => {
  const start = Date.now();
  await respond();
  return edit(`${emojis.sparkle} Server latency is \`${Date.now() - start}ms\`, API latency is \`${Math.round(client.ws.ping)}ms\` and my uptime is \`${msToTime(client.uptime)}\`.`);
};