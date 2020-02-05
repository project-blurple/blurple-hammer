module.exports = {
  description: "Blacklist (or un-blacklist) a link to be sent in chat.",
  usage: {
    "[<link(s ...)>]": "The link(s) you'd like to blacklist or un-blacklist. The link(s) cannot include a path, either the whole (sub)domain gets blocked or it doesn't. Leave empty to send the list of them instead."
  },
  examples: {
    "sexy-asians-nearby.com": "Blacklist this link. Will also blacklist subdomains.",
    "nsfw.norwegian-tinder.no": "Blacklist this link. Will also blacklist sub-subdomains."
  },
  aliases: [ "bllink", "blurl" ],
  permissionRequired: 3, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: () => true
}

const fs = require("fs");

module.exports.run = module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {
  if (args.length == 0) return message.channel.send(constants.emojis.sparkle + " List of blacklisted URLs: ```diff\n" + constants.urlBlacklist.join(", ") + "```")

  const linkMatches = args.join(" ").toLowerCase().match(constants.linkRegex) || [], links = linkMatches.map(l => l.split("/")[0]);
  if (!links || links.length == 0) return message.channel.send(constants.emojis.tickno + " No links were found.");

  const diff = {};
  for (const link of links) {
    if (constants.urlBlacklist.includes(link)) {
      diff[link] = false;
      constants.urlBlacklist = constants.urlBlacklist.filter(l => l !== link);
    } else {
      diff[link] = true;
      constants.urlBlacklist.push(link);
    }
  }

  fs.writeFile("./constants/url-blacklist.txt", constants.urlBlacklist.join("\n"), "utf8", () => {});

  const changes = [];
  for (const link in diff) if (diff[link]) changes.push("+ " + link); else changes.push("- " + link);

  message.channel.send(constants.emojis.tickyes + " Blacklist changes has been made: ```diff\n" + changes.join("\n") + "```")
}