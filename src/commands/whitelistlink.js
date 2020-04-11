module.exports = {
  description: "Whitelist (or un-whitelist) a link to be sent in chat.",
  usage: {
    "[<link(s ...)>]": "The link(s) you'd like to whitelist or un-whitelist. The link(s) cannot include a path, either the whole (sub)domain gets blocked or it doesn't. Leave empty to send the list of them instead."
  },
  examples: {
    "discordapp.com": "Whitelist this link. Will also whitelist subdomains.",
    "developers.twitter.com": "Whitelist this link. Will also whitelist sub-subdomains."
  },
  aliases: [ "wllink", "wlurl" ],
  permissionRequired: 3, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => true
}

const fs = require("fs"), constants = require("../constants");

module.exports.run = async (client, message, args, { content }) => {
  if (args.length == 0) return message.channel.send(`${constants.emojis.sparkle} Here you go!`, {
    files: [
      {
        attachment: Buffer.from(fs.readFileSync("./src/constants/url-whitelist.txt")),
        name: "url-whitelist.txt"
      }
    ]
  })
  const linkMatches = content.toLowerCase().match(constants.linkRegex) || [], links = linkMatches.map(l => l.split("/")[0]);
  if (!links || links.length == 0) return message.channel.send(`${constants.emojis.tickno} No (sub-)domains were found in your message.`);

  const diff = {};
  for (const link of links) {
    if (constants.urlWhitelist.includes(link)) {
      diff[link] = "-";
      constants.urlWhitelist = constants.urlWhitelist.filter(l => l != link);
    } else {
      diff[link] = "+";
      constants.urlWhitelist.push(link);
    }
  }
  
  fs.writeFile("./src/constants", constants.urlWhitelist.join("\n"), "utf8", () =>
    message.channel.send(`${constants.emojis.tickyes} Whitelist changes have been made: \`\`\`diff\n${Object.keys(diff).map(link => diff[link] + " " + link).join("\n")}\`\`\``)
  )
}