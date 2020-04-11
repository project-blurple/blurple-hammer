module.exports = {
  description: "Scan URL(s) with MyWOT.",
  usage: {
    "<URL(s ...)>": "The URL(s) to scan. If there's multiple, it will send multiple messages."
  },
  examples: {},
  aliases: [],
  permissionRequired: 1, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length >= 1
}

const constants = require("../constants"), scanLinks = require("../utils/link-scanner.js");

module.exports.run = async (client, message, args) => {
  message.channel.startTyping();

  const results = await scanLinks(args);

  for (const links of results) {
    let results = links[0], embed = {
      title: links[0].url,
      color: constants.embedColor,
      fields: links.map(r => ({
        name: `${r.safe ? constants.emojis.tickyes : constants.emojis.tickno} ${r.url}`,
        value: [
          r.origin ? `**From:** Redirection of ${r.origin}` : `**Origin:** Original URL`,
          `**Whitelisted?** ${r.whitelisted ? "Yes" : "No"}.`,
          `**Blacklisted?** ${r.blacklisted ? "Yes" : "No"}.`,
          `**Trustworthy?** ${r.trustworthy && r.trustworthy[1] >= 8 ? (r.trustworthy[0] <= 60 ? "No" : "Yes") : "N/A"}. ${r.trustworthy ? `(${r.trustworthy[0]}% from ${r.trustworthy[1]} reviews)` : ""}`,
          `**Child-safe?** ${r.childsafe && r.childsafe[1] >= 8 ? (r.childsafe[0] <= 60 ? "No" : "Yes") : "N/A"}. ${r.childsafe ? `(${r.childsafe[0]}% from ${r.childsafe[1]} reviews)` : ""}`,
          Object.keys(r.wot || {}).length ? "```" + Object.keys(r.wot).map(tag => `${tag}: ${r.wot[tag]}%`).join(", ") + "```" : ""
        ].filter(line => line.length).join("\n"),
        inline: true
      })),
      footer: {
        text: `Requested by ${message.author.tag} • Powered by MyWOT`,
        icon_url: message.author.avatarURL()
      },
      timestamp: Date.now()
    }

    await message.channel.send({ embed })
  }

  message.channel.stopTyping();
}