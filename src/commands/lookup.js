const fetch = require("node-fetch"), { emojis, functions: { flat, onlyUnique }, embedColor } = require("../constants");

module.exports = {
  description: "Look up an unknown ID or invite URL to see the origin of it.",
  options: [
    {
      type: 3,
      name: "unknown",
      description: "The unknown you'd like to search.",
      required: true
    }
  ],
  aliases: [ "whatis", "wit" ],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ client, channel, guild }, { unknown }) => {
  channel.startTyping();

  // check role
  const roleSearch = guild.roles.resolve(unknown);
  if (roleSearch) return send(channel, `${emojis.tickyes} This ID is a role ID for the role ${roleSearch.name}.`);

  // check channel
  const channelSearch = guild.channels.resolve(unknown);
  if (channelSearch) return send(channel, `${emojis.tickyes} This ID is a channel ID for the channel ${channelSearch}.`);

  // check user
  const user = await client.users.fetch(unknown).catch(() => null);
  if (user && !user.bot) return send(channel, `${emojis.tickyes} This ID is an user ID of ${user.username}#${user.discriminator} (${user.id}).`);
  else if (user) {
    const bot = await fetch(`https://botblock.org/api/bots/${user.id}`).then(res => res.json());
    if (bot.discriminator == "0000") return send(channel, `${emojis.tickyes} This ID is a bot ID of ${user.username}#${user.discriminator} (${user.id}).`);

    const
      fields = [], add = (name, value) => fields.push({ name, value, inline: true }),
      lists = Object.keys(bot.list_data).filter(list => bot.list_data[list][1] == 200 && !bot.list_data[list].error).map(list => bot.list_data[list][0]),
      descriptions = lists.map(list => list[Object.keys(list).find(i => i.includes("short")) || 0]).filter(desc => desc && typeof desc == "string").sort((a, b) => b.length - a.length),
      prefixes = lists.map(list => list.prefix).filter(desc => desc).sort((a, b) => b.length - a.length),
      websites_ = lists.map(list => list[Object.keys(list).find(i => i.includes("website")) || 0]).filter(link => link && typeof link == "string"),
      websites = websites_.sort((a, b) => websites_.filter(v => v===b).length - websites_.filter(v => v===a).length),
      tags = flat(lists.map(list => list.tags).filter(tags => tags && typeof tags == "object")),
      owners = (await Promise.all(bot.owners.filter(o => !o.includes("#")).filter(onlyUnique).map(id => client.users.fetch(id).catch(() => null)))).filter(user => user);
    
    if (descriptions[0]) add("Description", descriptions[0]);
    if (prefixes[0]) add("Prefix", prefixes[0]);
    if (websites[0]) add("Website", websites[0]);
    if (tags.length) add("Tags", tags.join(", "));
    if (owners.length > 1) add("Owners", owners.join("\n")); else add("Owner", owners[0]);

    return send(channel, `${emojis.tickyes} This ID is a bot ID of ${user.username}#${user.discriminator} (${user.id}).`, {
      embed: {
        fields, thumbnail: user.avatar ? {
          url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
        } : null, color: embedColor
      }
    });
  }

  // check invite
  const inviteSearch = await client.fetchInvite(unknown).catch(() => null);
  if (inviteSearch) {
    const
      invite = fetch(`${client.options.http.api}/v${client.options.http.version}/invites/${inviteSearch.code}?with_counts=true`).then(res => res.json()),
      fields = [], add = (name, value) => fields.push({ name, value, inline: true });
    add("Guild", `${invite.guild.name} (${invite.guild.id})`);
    add("Channel", `${invite.channel.name} (${invite.channel.type && invite.channel.type !== "0" ? `${invite.channel.type}/` : ""}${invite.channel.id})`);
    add("Members", `${invite.approximate_presence_count} online, ${invite.approximate_member_count} total`);
    
    if (invite.inviter) add("Inviter", `${invite.inviter.username}#${invite.inviter.discriminator} ${invite.inviter.bot ? "[BOT] " : ""}(${invite.inviter.id})`);
  }

  // check emoji
  const { ok } = await fetch(`${client.options.http.cdn}/emojis/${unknown}.png`).catch(() => ({ ok: false }));
  if (ok) return send(channel, `${emojis.tickyes} This ID is an emoji ID: ${client.options.http.cdn}/emojis/${unknown}.png`);

  // check message
  const channels = [...guild.channels.cache.filter(ch => ["text", "news"].includes(ch.type))];
  for (const ch of channels) try {
    const m = await ch.messages.fetch(unknown);
    if (m) return send(channel, `${emojis.tickyes} This ID is a message ID: <${m.url}>`);
  } catch(e) {/* not in the channel */}

  return send(channel, `${emojis.tickno} This ID is unknown to me. (Is it from Auttaja?)`);
};

function send(channel, content = "", extra = {}) {
  channel.send(content, extra);
  channel.stopTyping();
}