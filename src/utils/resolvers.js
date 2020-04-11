const constants = require("../constants")

module.exports.getRole = (search, guild) =>
  guild.roles.cache.find(r => r.name == search) ||
  guild.roles.cache.find(r => r.name.toLowerCase() == search.toLowerCase()) ||
  guild.roles.cache.get(getId(search))

module.exports.getMember = (search, guild) =>
  guild.members.cache.find(m => search == m.user.tag) ||
  guild.members.cache.find(m => search.toLowerCase() == m.user.tag.toLowerCase()) ||
  guild.members.cache.find(m => search == m.displayName) ||
  guild.members.cache.find(m => search.toLowerCase() == m.displayName.toLowerCase()) ||
  guild.members.cache.get(getId(search))

module.exports.getChannel = (search, guild) => {
  const channels = guild.channels.cache.filter(ch => ch.type == "text" && ch.viewable);
  return false ||
    channels.find(ch => search.toLowerCase() == ch.name.toLowerCase()) ||
    channels.get(getId(search))
}

module.exports.getMembers = (searches, guild) => {
  let members = [];
  for (const search of searches) {
    let member = module.exports.getMember(search, guild);
    if (member) members.push(member);
    else {
      let role = module.exports.getRole(search, guild); console.log(role)
      if (role) role.members.forEach(member => members.push(member));
    }
  }

  return members.map(m => m.id).filter(constants.onlyUnique).map(id => members.find(m => m.id == id));
}

module.exports.getUser = async (search, guild) => {
  const member = module.exports.getMember(search, guild);
  if (member) return member.user;
  else try {
    return await guild.client.users.fetch(search)
  } catch(e) {
    return null;
  }
}

const getId = search => (search.match(/[0-9]+/) || [null])[0]