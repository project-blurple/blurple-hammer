const { restrictions, guilds } = require("../constants");

module.exports = async client => {
  const nickRole = client.guilds.cache.get(guilds.main).roles.cache.get(restrictions.find(r => r.name == "nick").role);
  client.on("guildMemberUpdate", async (old, member) => {
    if (
      old.nickname !== member.nickname &&
      member.roles.cache.has(nickRole.id)
    ) {
      const audits = await member.guild.fetchAuditLogs({
        type: "MEMBER_UPDATE"
      }), entry = audits.entries.sort((a, b) => parseInt(b.id) - parseInt(a.id)).find(e => 
        e.target.id == member.id &&
        e.changes.find(ch => ch.key == "nick")
      );

      if (
        entry &&
        entry.executor.id == member.id
      ) member.edit({ nick: old.nickname });
    }
  })
}