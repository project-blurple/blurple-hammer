const { idResolver } = require("./regex");

// Since we cache everything, there's really no need to fetch.

module.exports.getRole = (search, guild) =>
  guild.roles.cache.find(r => r.name == search) ||
  guild.roles.cache.find(r => r.name.toLowerCase() == search.toLowerCase()) ||
  guild.roles.resolve(search);

module.exports.getMember = (search, guild) =>
  guild.members.cache.find(m => search.toLowerCase() == m.user.tag.toLowerCase()) ||
  guild.members.cache.find(m => search == m.displayName) ||
  guild.members.cache.find(m => search.toLowerCase() == m.displayName.toLowerCase()) ||
  guild.members.resolve(search);

module.exports.getChannel = (search, guild) =>
  guild.channels.cache.find(ch => search.toLowerCase() == ch.name.toLowerCase()) ||
  guild.channels.resolve((search.match(idResolver) || ["0"])[0]);