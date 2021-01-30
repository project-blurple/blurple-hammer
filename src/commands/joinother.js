const { emojis, oauth, functions: { flat }, guilds } = require("../constants"), { oauth: db, subserveraccessoverrides: accessoverrides } = require("../database");

module.exports = {
  description: "Make a staff staff join a subserver. Requires OAuth2 set up on their Staff account.",
  options: [
    {
      type: 6,
      name: "staff",
      description: "The staff staff you want to add to a subserver.",
      required: true
    },
    {
      type: 3,
      name: "subserver",
      description: "The subserver you want to join.",
      required: true,
      choices: Object.values(guilds).filter(guild => typeof guild !== "string").map(guild => ({
        name: `${guild.acronym.split("").join(".")}. (${guild.name})`,
        value: guild.acronym.toLowerCase()
      }))
    },
    {
      type: 5,
      name: "force",
      description: "Whether to add them even though they don't have access to the server."
    }
  ],
  aliases: [],
  permissionRequired: 5 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ client, channel, member }, { staff, subserver, force = false }) => {
  const tokens = await db.get(staff.user.id) || {};
  
  oauth.tokenRequest({
    refreshToken: tokens.refresh_token,
    grantType: "refresh_token",
    scope: [ "identify", "guilds.join" ]
  }).then(async ({ access_token, refresh_token }) => {
    db.set(staff.user.id, { access_token, refresh_token });
  
    const { access, member: subMember } = await calculateAccess(staff.user.id, guilds.find(g => g.acronym.toLowerCase() == subserver), client)

    if (subMember) return channel.send(`${emojis.tickno} They are already in this subserver.`);
    if (!access && !force) return channel.send(`${emojis.tickno} They do not have access to this subserver.`);
    
    if (force) accessoverrides.set(`${server.id};${staff.user.id}`, member.user.id);

    oauth.addMember({
      accessToken: access_token,
      botToken: client.token,
      guildId: server.id,
      userId: staff.user.id,
      roles: allSubRoles
    }).then(() => {
      channel.send(`${emojis.tickyes} They are now added to **${guild.name}**.`);
    }).catch(e => {
      console.log(e);
      channel.send(`${emojis.tickno} An unknown error occurred when trying to add them to the subserver.`);
    });
  }).catch(e => console.log(e) && channel.send(`${emojis.tickno} Their OAuth2 is not set up correctly!`));
};