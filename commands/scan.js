module.exports = {
  description: "",
  usage: {},
  examples: {},
  aliases: [],
  permissionRequired: 1, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length >= 1
}

const scanLinks = require("../constants/link-scanner.js")

module.exports.run = module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {
  message.channel.startTyping();

  const results = await scanLinks(args, null, constants);

  for (const links of results) {
    let embed = {
      title: links[0].url,
      color: constants.embedColor,
      fields: [],
      footer: { text: "Requested by " + message.author.tag + " • Powered by MyWOT", icon_url: message.author.displayAvatarURL },
      timestamp: Date.now()
    }

    const result = links[0]

    if (result.blacklisted) embed.fields.push({
      name: constants.emojis.tickno + " Website IS BLACKLISTED!",
      value: "The blacklist is custom to Project Blurple's server only. If you would like to add or remove a link, send a message to <@536491357322346499> (BlurpleMail). Thanks for making Project Blurple a better place."
    })

    if (result.whitelisted) embed.fields.push({
      name: constants.emojis.tickyes + " Website is whitelisted.",
      value: "If a link is whitelisted, it is probably because it has bad ratings online but is still a good site. (Like Imgur)"
    })

    if (result.trustworthy && result.trustworthy[1] >= 10) embed.fields.push({
      name: result.trustworthy[0] < 75 ? constants.emojis.tickno + " Website is NOT trustworthy!" : constants.emojis.tickyes + " Website is trustworthy.",
      value: "Based on **" + result.trustworthy[1] + " ratings** from real humans, the site is **" + result.trustworthy[0] + "%** trustworthy."
    })

    if (result.childsafe && result.childsafe[1] >= 10) embed.fields.push({
      name: result.childsafe[0] < 75 ? constants.emojis.tickno + " Website is NOT childsafe!" : constants.emojis.tickyes + " Website is childsafe.",
      value: "Based on **" + result.childsafe[1] + " ratings** from real humans, the site is **" + result.childsafe[0] + "%** childsafe."
    })

    if (links.length > 1) embed.fields.push({
      name: constants.emojis.tickyes + " Redirects",
      value: links.map(link => (link.safe ? constants.emojis.tickyes : constants.emojis.tickno) + " `" + link.url + "`").join("\n")
    })

    if (result.wot) {
      const wot = [];
      for (const id in result.wot) wot.push(constants.linkCategories[id] + ": " + result.wot[id] + "%")
      if (wot.length) embed.description = "```" + wot.join(", ") + "```"
    }
    
    await message.channel.send({ embed });
  }

  message.channel.stopTyping();
}