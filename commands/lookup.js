module.exports = {
  description: "Lookup something unknown, like an ID or an invite, and hopefully get the meaning behind it!",
  usage: {
    "<unknown>": "The unknown you'd like to lookup."
  },
  examples: {},
  aliases: [ "bot-lookup", "id-lookup", "invite-lookup", "whatis", "wit", "whatisthis" ],
  permissionLevel: 1, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length == 1
}

const fetch = require("node-fetch"), onlyUnique = (value, index, self) => self.indexOf(value) == index

module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {
  try {
    let user = await client.fetchUser(args[0].replace("<@", "").replace("!", "").replace(">", ""), false);
    if (!user.bot) return message.channel.send(constants.emojis.tickyes + " This ID is definitely a user ID of " + user.username + "#" + user.discriminator + " (" + user.id + ").");
    let botMsg = await message.channel.send(constants.emojis.tickyes + " This ID is definitely a bot ID of " + user.username + "#" + user.discriminator + " (" + user.id + "), fetching more information...")
      try {
        let botblock = await fetch("https://botblock.org/api/bots/" + user.id).then(res => res.json())
        if (botblock.discriminator == "0000") return botMsg.edit(constants.emojis.tickyes + " This ID is definitely a bot ID of " + user.username + "#" + user.discriminator + " (" + user.id + "), unfortunately this bot is not listed on any BotBlock-supported bot lists.")

        let fields = []
        const add = values => { for (var name in values) fields.push({name, value: values[name], inline: true}) }

        let lists = Object.keys(botblock.list_data).filter(l => botblock.list_data[l][1] == 200 && !botblock.list_data[l][0].error).map(l => botblock.list_data[l][0])

        let descriptions = lists.filter(l => Object.keys(l).find(k => k.toLowerCase().includes("short"))).map(l => l[Object.keys(l).find(k => k.toLowerCase().includes("short"))]).sort((a, b) => b.length - a.length);
        if (descriptions[0]) add({ "Description": descriptions[0] })

        let prefixes = lists.filter(l => l.prefix).map(l => l.prefix).sort((a, b) => b.length - a.length);
        add({ "Prefix": prefixes[0] ? "\`" + prefixes[0] + "\`" : "Unknown" })

        if (botblock.server_count) add({ "Server Count": botblock.server_count })

        add({ "Invite": (botblock.invite ? "[Invite with permissions](" + botblock.invite + ")\n" : "") + "[Invite without permissions](https://discordapp.com/oauth2/authorize?client_id=" + botblock.id + "&scope=bot)" })

        if (lists.find(l => l.library)) add({ "Library": lists.find(l => l.library).library })

        let websites = {}
        for (var website of lists.filter(l => l.website).map(l => l.website)) if (!websites[website]) websites[website] = 1; else websites[website] += 1;
        let websiteKeys = Object.keys(websites).sort((a, b) => websites[b] - websites[a])
        if (websiteKeys[0]) add({ "Website": websiteKeys[0] })
        
        let allTags = lists.filter(l => l.tags).map(l => l.tags.filter(t => typeof t == "string").join(",")).join(",").split(",")
        if (allTags.length) {
            let tags = allTags.filter(t => t.length).filter(onlyUnique)
            if (tags.length) add({ "Tags": tags.join(", ") })
        }

        let owners = botblock.owners.filter(o => !o.includes("#")).filter(onlyUnique);
        if (owners.length > 1) {
            let allOwners = []
            for (var owner of owners) allOwners.push((await client.fetchUser(owner, false).catch(() => null)))
            add({ "Owners": allOwners.filter(o => !!o).map(o => o.username + "#" + o.discriminator + " (" + o.id + ")").join("\n") })
        } else if (owners.length) add({ "Owner": [await client.fetchUser(owners[0])].map(o => o.username + "#" + o.discriminator + " (" + o.id + ")")[0] })

        console.log(fields)
        
        return botMsg.edit(constants.emojis.tickyes + " This ID is definitely a bot ID of " + user.username + "#" + user.discriminator + " (" + user.id + "):", {
            embed: {
                fields, thumbnail: user.avatar ? {
                    url: "https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png?size=4096"
                } : null,
                color: constants.embedColor
            }
        })
      } catch(e) { console.log(e); return botMsg.edit(constants.emojis.tickyes + " This ID is definitely a bot ID of " + user.username + "#" + user.discriminator + " (" + user.id + "), unfortunately we could not get a good connection to BotBlock."); }
  } catch(e) {}

  try {
    let legacy = await client.fetchInvite(args[0])
    if (legacy) {
      let invite = await fetch("https://discordapp.com/api/v6/invites/" + legacy.code + "?with_counts=true").then(res => res.json())
      
      let fields = []
      const add = values => { for (var name in values) fields.push({name, value: values[name], inline: true}) }
      
      add({
          "Guild": invite.guild.name + " (" + invite.guild.id + ")",
          "Channel": invite.channel.name + " (" + (invite.channel.type && invite.channel.type !== "0" ? invite.channel.type + "/" : "") + invite.channel.id + ")",
          "Members": invite.approximate_presence_count + " online, " + invite.approximate_member_count + " total"
      })
      if (invite.inviter) add({ "Inviter": invite.inviter.username + "#" + invite.inviter.discriminator + " (" + (invite.inviter.bot ? "bot/" : "") + invite.inviter.id + ")" })
      if (invite.guild.features.length) add({ "Features": invite.guild.features.join(", ") })
      if (invite.guild.vanity_url_code) add({ "Original Vanity URL": "https://discord.gg/" + invite.guild.vanity_url_code })
      if (invite.guild.description) add({ "Description": invite.guild.description })
      if (invite.guild.verification_level) add({ "Verification Level": ["None", "Verified email", "Verified email and 5 minutes on Discord", "Verified email and 10 minutes on server", "Verified phone number"][invite.guild.verification_level] })

      return message.channel.send({
        embed: {
          title: "Invite Lookup",
          description: "Information from the invite \`" + invite.code + "\`",
          fields, image: invite.guild.banner ? {
              url: "https://cdn.discordapp.com/banners/" + invite.guild.id + "/" + invite.guild.banner + ".jpg?size=4096"
          } : undefined, thumbnail: invite.guild.icon ? {
              url: "https://cdn.discordapp.com/icons/" + invite.guild.id + "/" + invite.guild.icon + ".jpg?size=4096"
          } : undefined,
          color: constants.embedColor
        }
      })
    }
  } catch(e) {}

  if (!message.guild) return message.channel.send(constants.emojis.tickno + " The ID is unknown for me. Soarry.");
  
  let channelIDs = message.guild.channels.map(ch => ch.id);
  if (channelIDs.includes(args[0])) return message.channel.send(constants.emojis.tickyes + " This ID is definitely a channel ID of channel " + message.guild.channels.get(args[0]) + ".");
  
  let roleIDs = message.guild.roles.map(r => r.id);
  if (roleIDs.includes(args[0])) return message.channel.send(constants.emojis.tickyes + " This ID is definitely a role ID of role " + message.guild.roles.get(args[0]).name.replace("@", "@.") + "." + (message.guild.roles.get(args[0]).name == "@everyone" ? "\n**Fun fact:** Did you know the server ID and the @.everyone-ID is the same?" : ""));
  
  try {
    let res = await fetch("https://cdn.discordapp.com/emojis/" + args[0] + ".png")
    if (res.ok) return message.channel.send(constants.emojis.tickyes + " This ID is definitely a custom emoji ID. [<https://cdn.discordapp.com/emojis/" + args[0] + ".png>]")
  } catch(e) {}

  if (args[0].length == 15) return message.channel.send(constants.emojis.tickyes + " This ID looks like an Auttaja punishment ID.");
  
  let msg = await message.channel.send(constants.emojis.loading + " Checking if the ID is a message in this guild. This may take a while depending on rate limiting.")
  let channels = message.guild.channels.filter(ch => ["text", "news"].includes(ch.type)).array();
  for (var c in channels) {
    try {
      let m = await channels[c].fetchMessage(args[0]);
      return msg.edit(constants.emojis.tickyes + " This ID is definitely a message ID. [<https://discordapp.com/channels/" + [message.guild.id, m.channel.id, m.id].join("/") + ">]");
    } catch(e) {}
  }
  
  return msg.edit(constants.emojis.tickno + " The ID is unknown for me. Soarry.");
}