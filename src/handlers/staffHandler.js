const config = require("../../config.json"), { app, guilds, functions: { getPermissionLevel, flat, onlyUnique }, oauth, emojis } = require("../constants"), { oauth: db, subserveraccessoverrides: overrides, strips } = require("../database");

module.exports = client => {
  setInterval(async () => {
    const users = flat([
      ...client.guilds.cache.get(guilds.main).members.cache.filter(user => getPermissionLevel(user) > 0),
      ...client.guilds.cache.filter(g => g.id !== guilds.main).map(guild => ([...guild.members.cache]))
    ], 2).map(member => member.id).filter(member => member).filter(onlyUnique);
    for (const id of users) await checkMemberAccess(id, client);
  }, 60000);

  client.on("guildMemberUpdate", async (oldMember, member) => {
    if (
      member.guild.id == guilds.main &&
      (
        getPermissionLevel(oldMember) !== 0 ||
        getPermissionLevel(member) !== 0
      )
    ) checkMemberAccess(member.user.id, client);
  });

  client.on("guildMemberAdd", member => {
    if (member.guild.id !== guilds.main) checkMemberAccess(member.user.id, client);
  });

  app.get(config.oauthPath, async (req, res) => {
    if (req.query.code) {
      const { access_token, refresh_token } = await oauth.tokenRequest({
        code: req.query.code,
        scope: "identify guilds.join",
        grantType: "authorization_code"
      }).catch(e => { console.log(e); return {}; });
      if (!access_token) return res.redirect("https://www.youtube.com/watch?v=NhyE3errfnI");
      
      const { id } = await oauth.getUser(access_token);
      db.set(id, { access_token, refresh_token });
      
      client.users.cache.get(id).send(`${emojis.tada} Your OAuth2 has successfully been linked.`);
      checkMemberAccess(id, client);

      return res.status(200).send("okbye<script>window.close();</script>");
    } else res.redirect("https://www.youtube.com/watch?v=NhyE3errfnI");
  });
};

async function checkMemberAccess(id, client) {
  const
    guild = client.guilds.cache.get(guilds.main),
    member = guild.members.cache.get(id);
  if (!member) {
    for (const subserver of Object.values(guilds).filter(p => typeof p !== "string")) {
      const 
        subGuild = client.guilds.cache.get(subserver.id),
        subMember = subGuild.members.cache.get(id);
      if (subMember && !subMember.user.bot) console.log("Kick member", subMember.user.tag, "from server", subGuild.name, "because not in main server");
    }
  } else if (!member.user.bot) {
    for (const subserver of Object.values(guilds).filter(p => typeof p !== "string")) {

      const { guild: subGuild, member: subMember, access, override, addRoles, removeRoles } = await calculateAccess(id, subserver, client);

      if (!access && !override && subMember) console.log("Kick member", member.user.tag, "from server", subGuild.name, "because no access", await subMember.kick("Missing access").then(() => "success").catch(() => "failure"));
      else if (access == 2 && !subMember) console.log("Add member", member.user.tag, "to server", subGuild.name, "with roles", addRoles, await addMemberToGuild(id, subserver.id, addRoles).then(() => "success").catch(() => "failure")); 
      else {
        if (access && subMember && addRoles.length) console.log("Add roles to", member.user.tag, "in server", subGuild.name, addRoles, await subMember.roles.add(addRoles).then(() => "success").catch(() => "failure"));
        if (access && subMember && removeRoles.length) console.log("Remove roles from", member.user.tag, "in server", subGuild.name, removeRoles, await subMember.roles.remove(removeRoles).then(() => "success").catch(() => "failure"));
      }
    }
  }
}

module.exports.checkMemberAccess = checkMemberAccess;

async function calculateAccess(id, subserver, client) {
  const
    mainGuild = client.guilds.cache.get(guilds.main),
    mainMember = mainGuild.members.cache.get(id),
    mainRoles = [
      ...mainMember.roles.cache.map(r => r.id).filter(id => Object.keys(subserver.staffAccess).includes(id)),
      ...(await strips.get(id) || []),
      mainMember.user.id
    ],

    guild = client.guilds.cache.get(subserver.id),
    member = guild.members.cache.get(id),
    roles = member ? member.roles.cache.map(r => r.id) : [],
    
    access = Math.max(0, ...mainRoles.map(id => subserver.staffAccess[id] ? subserver.staffAccess[id].access : 0)),
    override = await overrides.get(`${subserver.id};${id}`),

    subRoles = flat(Object.values(subserver.staffAccess).map(o => o.roles)).filter(onlyUnique),
    allowedRoles = flat(mainRoles.map(id => subserver.staffAccess[id] ? subserver.staffAccess[id].roles : [])).filter(onlyUnique),
    disallowedRoles = subRoles.filter(id => !allowedRoles.includes(id)),

    addRoles = allowedRoles.filter(id => !roles.includes(id)),
    removeRoles = disallowedRoles.filter(id => roles.includes(id));
  
  return { guild, member, access, override, addRoles, removeRoles };
}

module.exports.calculateAccess = calculateAccess;

function addMemberToGuild(userId, guildId, roles = []) {
  return new Promise((resolve, reject) => db.get(userId).then((tokens = {}) => {
    oauth.tokenRequest({
      refreshToken: tokens.refresh_token,
      grantType: "refresh_token",
      scope: [ "identify", "guilds.join" ]
    }).then(({ access_token, refresh_token }) => {
      db.set(userId, { access_token, refresh_token });

      oauth.addMember({
        accessToken: access_token,
        botToken: config.token,
        guildId, userId, roles
      }).then(resolve).catch(e => reject(e, "addMember"));
    }).catch(e => reject(e, "tokenRequest"));
  }).catch(e => reject(e, "promise")));
}