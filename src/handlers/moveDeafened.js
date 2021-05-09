const { channels } = require("../constants");

module.exports = async client => {
  client.on("voiceStateUpdate", async (_, voice) => {
    if (
      voice.selfDeaf &&
      voice.channel &&
      voice.channel.id == channels.generalVoice
    ) voice.setChannel(channels.afkVoice, "User deafened");
  });
};