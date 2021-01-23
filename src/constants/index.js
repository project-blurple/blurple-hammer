const
  config = require("../../config.json"),
  express = require("express"),
  DiscordOAuth2 = require("discord-oauth2");

module.exports = {
  embedColor: 0x7289DA,
  hexColor: "7289DA",
  guilds: {
    main: "793877712254009464", // "412754940885467146",
    staff: "573169434227900417",
    assets: "540758383582511115",
    dev: "559341262302347314"
  },
  app: express(),
  oauth: new DiscordOAuth2(config.oauth),

  // other files
  channels: require("./channels"),
  emojis: require("./emojis"),
  functions: require("./functions"),
  gifs: require("./gifs"),
  links: require("./links"),
  regex: require("./regex"),
  resolvers: require("./resolvers"),
  restrictions: require("./restrictions"),
  roles: require("./roles")
};

module.exports.app.listen(config.port);