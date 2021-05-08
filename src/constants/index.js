const
  config = require("../../config.json"),
  express = require("express"),
  DiscordOAuth2 = require("discord-oauth2");

module.exports = {
  embedColor: 0x7289DA,
  hexColor: "7289DA",
  guilds: {
    main: "412754940885467146",
    staff: require("./subservers/staff"),
    assets: require("./subservers/assets"),
    dev: require("./subservers/dev"),
    dev2: require("./subservers/dev2"),
    minecraft: require("./subservers/minecraft")
  },
  app: express(),
  oauth: new DiscordOAuth2(config.oauth)
};

Object.assign(module.exports, {
  channels: require("./channels"),
  emojis: require("./emojis"),
  functions: require("./functions"),
  gifs: require("./gifs"),
  regex: require("./regex"),
  resolvers: require("./resolvers"),
  restrictions: require("./restrictions"),
  roles: require("./roles")
});

module.exports.app.listen(config.port);