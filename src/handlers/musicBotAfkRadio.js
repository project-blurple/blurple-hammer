const { channels } = require("../constants");

const bot = "837825364540915762";

module.exports = async client => {
  client.on("voiceStateUpdate", async (_, voice) => {
    if (
      voice.member.id == bot &&
      voice.channel &&
      voice.channel.id == channels.afkVoice &&
      voice.serverMute
    ) voice.setMute(false);
  });
};