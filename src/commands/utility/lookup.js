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

const fetch = require("node-fetch"), { getRole, getChannel, getUser } = require("../../utils/resolvers.js"), constants = require("../../constants");

module.exports.run = async (client, message, args) => {
  message.channel.startTyping();

  const role = getRole(args[0], message.guild);
  if (role) return send(message.channel, `${constants.emojis.tickyes} This ID is a role ID for the role ${role.name}.`)

  const channel = getChannel(args[0], message.guild);
  if (channel) return send(message.channel, `${constants.emojis.tickyes} This ID is a channel ID for the channel ${channel}.`)

  // user lookup
  try {
    const user = await getUser(args[0], message.guild)
    if (user) {
      if (user.bot) {
        const botblock = await fetch(`https://botblock.org/api/bots/${user.id}`).then(res => res.json())
        if (botblock.discriminator == "0000") return send(message.channel, `${constants.emojis.tickyes} This ID is a bot ID of ${user.username}#${user.discriminator} (${user.id}). Unfortunately, this bot is not listed on any of BotBlock's bot lists.`)

        const fields = [], add = values => { for (const name in values) fields.push({ name, value: values[name], inline: true }) }

        let lists = Object.keys(botblock.list_data).filter(l => botblock.list_data[l][1] == 200 && !botblock.list_data[l].error).map(l => botblock.list_data[l][0]);

        let listsWithDescriptions = lists.filter(l => Object.keys(l).find(k => k.toLowerCase().includes("short")));
        let descriptions = listsWithDescriptions.map(l => l[Object.keys(l).find(k => k.toLowerCase().includes("short"))]).sort((a, b) => b.length - a.length);
        if (descriptions[0]) add({ "Description": descriptions[0] })

        let prefixes = lists.filter(l => l.prefix).map(l => l.prefix).sort((a, b) => b.length - a.length);
        add({ "Prefix": prefixes[0] ? `\`${prefixes[0]}\`` : "Unknown" });

        if (botblock.server_count) add({ "Server Count": botblock.server_count })

        add({ "Invite": `${botblock.invite ? `[Invite with permissions](${botblock.invite})\n` : ""}[Invite without permissions](https://discordapp.com/oauth2/authorize?client_id=${botblock.id}&scope=bot)`})

        if (lists.find(l => l.library)) add({ "Library": lists.find(l => l.library).library });

        let websites = {}
        for (const website of lists.filter(l => l.website).map(l => l.website)) if (!websites[website]) websites[website] = 1; else websites[website] += 1;
        let websiteKeys = Object.keys(websites).sort((a, b) => websites[b] - websites[a]);
        if (websiteKeys[0]) add({ "Website": websiteKeys[0] });

        let allTags = lists.filter(l => l.tags).map(l => l.tags.filter(t => typeof t == "string").join(",")).join(",").split(",");
        if (allTags.length) {
          let tags = allTags.filter(t => t.length).filter(constants.onlyUnique);
          if (tags.length) add({ "Tags": tags.join(", ") });
        }

        let owners = await Promise.all(botblock.owners.filter(o => !o.includes("#")).filter(constants.onlyUnique).map(u => getUser(u, message.guild)));
        owners = owners.filter(o => o).map(o => `${o.username}#${o.discriminator} (${o.id})`);
        if (owners.length > 1) add({ "Owners": owners.join("\n") });
        else add({ "Owner": owners[0] });

        return send(message.channel, `${constants.emojis.tickyes} This ID is a bot ID of ${user.username}#${user.discriminator} (${user.id}).`, {
          embed: {
            fields, thumbnail: user.avatar ? {
              url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`
            } : null, color: constants.embedColor
          }
        })
      } else return send(message.channel, `${constants.emojis.tickyes} This ID is an user ID of ${user.username}#${user.discriminator} (${user.id}).`)
    }
  } catch(e) { console.log(e) }

  // invite lookup
  try {
    let _invite = await client.fetchInvite(args[0]);
    if (_invite) {
      let invite = await fetch(`https://discordapp.com/api/v6/invites/` + _invite.code + "?with_counts=true").then(res => res.json());

      const fields = [], add = values => { for (const name in values) fields.push({ name, value: values[name], inline: true }) }

      add({
        "Guild": `${invite.guild.name} (${invite.guild.id})`,
        "Channel": `${invite.channel.name} (${invite.channel.type && invite.channel.type !== "0" ? `${invite.channel.type}/` : ""}${invite.channel.id})`,
        "Members": `${invite.approximate_presence_count} online, ${invite.approximate_member_count} total`
      })

      if (invite.inviter) add({ "Inviter": `${invite.inviter.username}#${invite.inviter.discriminator} (${invite.inviter.bot ? "bot/" : ""}${invite.inviter.id})`})
      if (invite.guild.features.length) add({ "Features": invite.guild.features.join(", ") })
      if (invite.guild.vanity_url_code) add({ "Original Vanity URL": `https://discord.gg/${invite.guild.vanity_url_code}` })
      if (invite.guild.description) add({ "Description": invite.guild.description })
      if (invite.guild.verification_level) add({ "Verification Level": ["None", "Verified email", "Verified email and 5 minutes on Discord", "Verified email and 10 minutes on server", "Verified phone number"][invite.guild.verification_level] })

      return send(message.channel, `${constants.emojis.tickyes} This ID is a Discord invite.`, {
        embed: {
          title: "Invite Lookup",
          description: `Information from the invite \`${invite.code}\``,
          fields, image: invite.guild.banner ? {
              url: `https://cdn.discordapp.com/banners/${invite.guild.id}/${invite.guild.banner}.jpg?size=4096`
          } : undefined, thumbnail: invite.guild.icon ? {
              url: `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.jpg?size=4096`
          } : undefined,
          color: constants.embedColor
        }
      })
    }
  } catch(e) {}
  
  // emoji lookup
  try {
    let res = await fetch(`https://cdn.discordapp.com/emojis/${args[0]}.png`);
    if (res.ok) return send(message.channel, `${constants.emojis.tickyes} This ID is an emoji ID: https://cdn.discordapp.com/emojis/${args[0]}.png`)
  } catch(e) {}

  // message lookup
  let channels = message.guild.channels.cache.filter(ch => ["text", "news"].includes(ch.type)).array();
  for (const ch of channels) try {
    let m = await ch.messages.fetch(args[0]);
    if (m) return send(message.channel, `${constants.emojis.tickyes} This ID is a message ID: <https://discordapp.com/channels/${m.guild.id}/${m.channel.id}/${m.id}>`)
  } catch(e) {}

  return send(message.channel, `${constants.emojis.tickno} I don't know what the ID \`${args[0]}\` is coming from. Maybe it's from Auttaja?`)
}

const send = (channel, content, morecontent = undefined) => channel.send(content, morecontent).then(() => channel.stopTyping())