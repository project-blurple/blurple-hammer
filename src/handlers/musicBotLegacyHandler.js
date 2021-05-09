const { guilds, channels } = require("../constants");

const bot = "837825364540915762";

module.exports = async client => {
  client.on("voiceStateUpdate", async (_, voice) => {
    if (
      voice.member.id == bot &&
      voice.channel &&
      voice.channel.id == channels.musicManagingVoice
    ) {
      await client.api.guilds(guilds.main).members(bot).patch({ data: { channel_id: channels.eventsVoice } });
      client.api.guilds(guilds.main)["voice-states"](bot).patch({ data: { channel_id: channels.eventsVoice, suppress: false } }); 
    }
  });
};
