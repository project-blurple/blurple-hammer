const config = require("../../config.json"), { app, guilds, functions: { getPermissionLevel, flat, onlyUnique }, oauth, emojis } = require("../constants"), { oauth: db } = require("../database");

module.exports = client => {
  client.on("guildMemberUpdate", (oldMember, member) => {
    if (
      member.guild.id == guilds.main &&
      (
        getPermissionLevel(oldMember) !== 0 ||
        getPermissionLevel(member) !== 0
      )
    ) checkMemberAccess(member.user.id, client);
  });

  app.get("/oauth-callback", async (req, res) => {
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

function checkMemberAccess(id, client) {
  const
    guild = client.guilds.cache.get(guilds.main),
    member = guild.members.cache.get(id);
  if (!member) {
    console.log("member with id", id, "does not exist??");
  } else {
    for (const subserver of Object.values(guilds).filter(p => typeof p !== "string")) {
      const
        sGuild = client.guilds.cache.get(subserver.id),
        sMember = sGuild.members.cache.get(id),
        allMainServerRoles = member.roles.cache.map(r => r.id).filter(id => Object.keys(subserver.staffAccess).includes(id)),
        access = Math.max(0, ...allMainServerRoles.map(id => subserver.staffAccess[id].access)), // 0 = none, 1 = allowed, 2 = auto-add
        allSubserverRoles = flat(Object.values(subserver.staffAccess).map(o => o.roles)).filter(onlyUnique),
        allAllowedRoles = flat(allMainServerRoles.map(id => subserver.staffAccess[id].roles)).filter(onlyUnique),
        disallowedRoles = allSubserverRoles.filter(id => !allAllowedRoles.includes(id));
      console.log(disallowedRoles, allAllowedRoles, allSubserverRoles, access);

      if (!access && sMember) console.log("Kick member", id, "from server", sGuild.name, "because no access");
      else if (access == 2 && !sGuild.members.cache.has(id)) addMemberToGuild(id, subserver.id, allAllowedRoles).catch(console.log);
      else {
        if (access && sMember && allAllowedRoles.find(id => !sMember.roles.cache.has(id))) sMember.roles.add(allAllowedRoles.filter(id => !sMember.roles.cache.has(id)));
        if (access && sMember && sMember.roles.cache.find(r => disallowedRoles.includes(r.id))) sMember.roles.remove(disallowedRoles.filter(id => sMember.roles.cache.has(id)));
      }
    }
  }
}

module.exports.checkMemberAccess = checkMemberAccess;

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