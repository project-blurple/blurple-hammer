const config = require("../../../config.json"), { emojis, oauth } = require("../../constants"), { oauth: db } = require("../../database"), { checkMemberAccess } = require("../../handlers/staffHandler.js");

module.exports = {
  description: "Check if your staff authentication to Project Blurple is set up correctly.",
  options: [],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
}

module.exports.run = async ({ member, respond }) => {
  const tokens = await db.get(member.user.id);
  if (!tokens || !tokens.refresh_token) return respond(`${emojis.tickno} Click this link to authenticate: <${config.authLink}>`);
  
  oauth.tokenRequest({
    refreshToken: tokens.refresh_token,
    grantType: "refresh_token",
    scope: [ "identify", "guilds.join" ]
  }).then(({ access_token, refresh_token }) => {
    db.set(member.user.id, { access_token, refresh_token });
    respond(`${emojis.tickyes} Your authentication is working! Join subservers with \`/join\``);
    checkMemberAccess(member.user.id, client);
  }).catch(() => respond(`${emojis.tickno} Your authentication is not working! Click this link and reauthorize me: <${config.authLink}>`));
};