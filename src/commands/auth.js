const config = require("../../config.json"), { emojis, oauth, authLink } = require("../constants"), { oauth: db } = require("../database"), { checkMemberAccess } = require("../handlers/staffHandler.js");

module.exports = {
  mainOnly: true,
  description: "Check if your authentication to Project Blurple is set up correctly.",
  options: [],
  aliases: [ "oauth" ],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ client, channel, member }) => {
  const tokens = await db.get(member.user.id);
  if (!tokens || !tokens.refresh_token) return channel.send(`${emojis.tickno} Click this link to authenticate: <${config.authLink}>`);
  
  oauth.tokenRequest({
    refreshToken: tokens.refresh_token,
    grantType: "refresh_token",
    scope: [ "identify", "guilds.join" ]
  }).then(({ access_token, refresh_token }) => {
    db.set(member.user.id, { access_token, refresh_token });
    channel.send(`${emojis.tickyes} Your authentication is working! Join subservers with \`/join\``);
    checkMemberAccess(member.user.id, client);
  }).catch(() => channel.send(`${emojis.tickno} Your authentication is not working! Click this link and reauthorize me: <${config.authLink}>`));
};