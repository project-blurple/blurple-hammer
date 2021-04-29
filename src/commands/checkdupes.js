const { emojis, functions: { onlyUnique } } = require("../constants");

module.exports = {
  description: "Remove duplicates from a string of IDs (or other stuff).",
  usage: {
    "<ids ...>": "The IDs you want to filter out the duplicates of, separated with a space"
  },
  examples: {},
  aliases: [ "filterdupes", "dupes" ],
  permissionRequired: 2, // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
  checkArgs: (args) => !!args.length
};

module.exports.run = ({ channel }, _, { content }) => {
  const list = content.split(" "), filtered = list.filter(onlyUnique);
  return channel.send(`${emojis.sparkle} Filtered out ${list.length - filtered.length}/${list.length} duplicates: \`\`\`fix\n${filtered.join(" ")}\`\`\``);
};