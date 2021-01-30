const { gifs } = require("../constants");

module.exports = {
  description: "Get a GIF.",
  options: [
    {
      type: 3,
      name: "type",
      description: "The type of gif you want to send",
      required: true,
      choices: Object.keys(gifs).map(key => ({ name: key.split("").map((c, i) => i == 0 ? c.toUpperCase() : c).join(""), value: key }))
    }
  ],
  aliases: [],
  permissionRequired: 0 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = ({ channel }, { type }) => channel.send(gifs[type][Math.floor(Math.random()*gifs[type].length)]);