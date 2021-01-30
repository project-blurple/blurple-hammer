const config = require("../../config.json"), { emojis, oauth } = require("../constants"), { oauth: db } = require("../database"), { checkMemberAccess } = require("../handlers/staffHandler.js");

module.exports = {
  mainOnly: true,
  description: "Check if OAuth2 is set up correctly or not for you or someone else.",
  options: [],
  aliases: [ "oauth2" ],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ client, channel, member }) => {
  const tokens = await db.get(member.user.id), link = `${client.options.http.api}/oauth2/authorize?client_id=${client.user.id}&redirect_uri=${encodeURI(config.oauth.redirectUri)}&response_type=code&scope=identify%20guilds.join`;
  if (!tokens || !tokens.refresh_token) return channel.send(`${emojis.tickno} Click this link to set up OAuth2: <${link}>`);
  
  oauth.tokenRequest({
    refreshToken: tokens.refresh_token,
    grantType: "refresh_token",
    scope: [ "identify", "guilds.join" ]
  }).then(({ access_token, refresh_token }) => {
    db.set(member.user.id, { access_token, refresh_token });
    channel.send(`${emojis.tickyes} Your OAuth2 is working! Join subservers with \`/join\``);
    checkMemberAccess(member.user.id, client);
  }).catch(() => channel.send(`${emojis.tickno} Your OAuth2 is not working! Click this link and reauthorize me: <${link}>`));
};