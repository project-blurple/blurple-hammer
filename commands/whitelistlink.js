module.exports = {
  description: "Whitelist (or un-whitelist) a link to be sent in chat.",
  usage: {
    "[<link(s ...)>]": "The link(s) you'd like to whitelist or un-whitelist. The link(s) cannot include a path, either the whole (sub)domain gets blocked or it doesn't. Leave empty to send the list of them instead."
  },
  examples: {
    "discordapp.com": "Whitelist this link. Will also whitelist subdomains.",
    "developers.twitter.com": "White this link. Will also whitelist sub-subdomains."
  },
  aliases: [ "wllink", "wlurl" ],
  permissionRequired: 1,
  checkArgs: (args) => true
}

const fs = require("fs");

module.exports.run = module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {
  if (args.length == 0) return message.channel.send(constants.emojis.sparkle + " List of whitelisted URLs: ```diff\n" + constants.urlWhitelist.join(", ") + "```")

  const linkMatches = args.join(" ").toLowerCase().match(constants.linkRegex) || [], links = linkMatches.map(l => l.split("/")[0]);
  if (!links || links.length == 0) return message.channel.send(constants.emojis.tickno + " No links were found.");

  const diff = {};
  for (const link of links) {
    if (constants.urlWhitelist.includes(link)) {
      diff[link] = false;
      constants.urlWhitelist = constants.urlWhitelist.filter(l => l !== link);
    } else {
      diff[link] = true;
      constants.urlWhitelist.push(link);
    }
  }

  fs.writeFile("./constants/url-whitelist.txt", constants.urlWhitelist.join("\n"), "utf8", () => {});

  const changes = [];
  for (const link in diff) if (diff[link]) changes.push("+ " + link); else changes.push("- " + link);

  message.channel.send(constants.emojis.tickyes + " Whitelist changes has been made: ```diff\n" + changes.join("\n") + "```")
}