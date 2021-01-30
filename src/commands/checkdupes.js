const { emojis, functions: { onlyUnique } } = require("../constants");

module.exports = {
  description: "Remove duplicates from a string of IDs (or other stuff).",
  options: [
    {
      type: 3,
      name: "ids",
      description: "The IDs you want to filter out the duplicates of, separated with a space",
      required: true
    }
  ],
  aliases: [],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = ({ channel }, { ids }) => channel.send(`${emojis.sparkle} Here ya go: \`\`\`fix\n${ids.split(" ").filter(s => s.length).filter(onlyUnique).join(" ")}\`\`\``);