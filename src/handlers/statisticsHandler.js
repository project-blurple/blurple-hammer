const config = require("../../config.json"), { app, guilds, roles } = require("../constants"), { statistics } = require("../database");

module.exports = async client => {
  app.get(config.statisticsPath, async (req, res) => {
    const guild = client.guilds.cache.get(guilds.main), { messages } = await statistics.get();
    res.json({
      members: guild.memberCount,
      blurple: guild.roles.cache.get(roles.blurpleusers).members.size,
      donators: guild.roles.cache.get(roles.donators).members.size,
      painters: guild.roles.cache.get(roles.painters).members.size,
      artists: guild.roles.cache.get(roles.artists).members.size,
      adventurers: guild.roles.cache.get(roles.adventurers).members.size,
      messages
    });
  })
}