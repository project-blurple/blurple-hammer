const idResolver = /[0-9]+/

module.exports.getRole = (search, guild) =>
  guild.roles.cache.find(r => r.name == search) ||
  guild.roles.cache.find(r => r.name.toLowerCase() == search.toLowerCase())

module.exports.getMember = (search, guild) =>
  guild.members.cache.find(m => search == m.user.tag) ||
  guild.members.cache.find(m => search.toLowerCase() == m.user.tag.toLowerCase()) ||
  guild.members.cache.find(m => search == m.displayName) ||
  guild.members.cache.find(m => search.toLowerCase() == m.displayName.toLowerCase())

module.exports.getChannel = (search, guild) => {
  const channels = guild.channels.cache.filter(ch => ch.type == "text" && ch.viewable);
  return false ||
    channels.find(ch => search.toLowerCase() == ch.name.toLowerCase()) ||
    channels.get(search.match(idResolver))
}

module.exports.getMembers = (searches, guild) => {
  let members = []; console.log(searches)
  for (const search of searches) { console.log(search)
    let member = module.exports.getMember(search, guild); console.log(member)
    if (member) members.push(member);
    else {
      let role = module.exports.getRole(search, guild); console.log(role)
      if (role) role.members.forEach(member => members.push(member));
    }
  }

  return members;
}