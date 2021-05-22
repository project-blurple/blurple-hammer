const config = require("../../../config.json"), { emojis } = require("../../constants");

module.exports = {
  description: "Restart the Karaoke bot.",
  options: [],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ respond }) => {
  if (config.restartKaraokeShellCommand) {
    require("child_process").exec(config.restartKaraokeShellCommand);
    return respond(`${emojis.sparkle} Karaoke is restarting.`);
  } else return respond(`${emojis.tickno} Restart command has not been configured.`, true);
};