const { emojis } = require("../../constants"), { statistics } = require("../../database");

module.exports = {
  description: "Update message count for the website.",
  options: [
    {
      type: 4,
      name: "message_count",
      description: "The message count of the server since launch.",
      required: true
    }
  ],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ respond }, { message_count }) => {
  await statistics.set("messages", message_count);
  respond(`${emojis.tickyes} Done.`, true)
};