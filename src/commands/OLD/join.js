const config = require("../../config.json"), { emojis, oauth, guilds } = require("../constants"), { oauth: db } = require("../database"), { calculateAccess } = require("../handlers/staffHandler.js");

module.exports = {
  description: "Join a subserver. Requires OAuth2 set up on your Staff account.",
  options: [
    {
      type: 3,
      name: "subserver",
      description: "The subserver you want to join.",
      required: true,
      choices: Object.values(guilds).filter(guild => typeof guild !== "string").map(guild => ({
        name: `${guild.acronym.split("").join(".")}. (${guild.name})`,
        value: guild.acronym.toLowerCase()
      }))
    }
  ],
  aliases: [],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ client, channel, member }, { subserver: acronym }) => {
  const tokens = await db.get(member.user.id) || {};
  
  oauth.tokenRequest({
    refreshToken: tokens.refresh_token,
    grantType: "refresh_token",
    scope: [ "identify", "guilds.join" ]
  }).then(async ({ access_token, refresh_token }) => {
    db.set(member.user.id, { access_token, refresh_token });
  
    const
      subserver = Object.values(guilds).find(g => typeof g !== "string" && g.acronym.toLowerCase() == acronym),
      { access, member: subMember, addRoles } = await calculateAccess(member.user.id, subserver, client);

    if (subMember) return channel.send(`${emojis.tickno} You are already in this subserver.`);
    if (!access) return channel.send(`${emojis.tickno} You do not have access to add yourself to this subserver.`);

    oauth.addMember({
      accessToken: access_token,
      botToken: client.token,
      guildId: subserver.id,
      userId: member.user.id,
      roles: addRoles
    }).then(() => {
      channel.send(`${emojis.tickyes} You are now added to **${subserver.name}**.`);
    }).catch(e => {
      console.log(e);
      channel.send(`${emojis.tickno} An unknown error occurred when trying to add you to the subserver.`);
    });
  }).catch(e => {
    console.log(e);
    channel.send(`${emojis.tickno} Your OAuth2 is not working! \`${config.prefix}oauth\``);
  });
};