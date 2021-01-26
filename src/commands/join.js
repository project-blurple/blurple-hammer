const config = require("../../config.json"), { emojis, oauth, functions: { flat } } = require("../constants"), { oauth: db } = require("../database");

module.exports = {
  mainOnly: true,
  description: "Join a subserver. Requires OAuth2 set up on your Staff account.",
  options: [
    {
      type: 3,
      name: "subserver",
      description: "The subserver you want to join.",
      required: true,
      choices: [
        {
          name: "Blurple Staff Operations Center",
          value: "staff"
        },
        {
          name: "B.A.R.F. (Blurple Asset Resource Facility)",
          value: "assets"
        },
        {
          name: "B.A.D. (Blurple Application Development)",
          value: "dev"
        }
      ]
    }
  ],
  aliases: [],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ client, channel, member }, { subserver }) => {
  const tokens = await db.get(member.user.id) || {};
  
  oauth.tokenRequest({
    refreshToken: tokens.refresh_token,
    grantType: "refresh_token",
    scope: [ "identify", "guilds.join" ]
  }).then(({ access_token, refresh_token }) => {
    db.set(member.user.id, { access_token, refresh_token });

    const
      server = require(`../constants/subservers/${subserver}.js`),
      guild = client.guilds.cache.get(server.id),
      allRoles = member.roles.cache.map(r => r.id).filter(id => Object.keys(server.staffAccess).includes(id)),
      access = allRoles.map(id => server.staffAccess[id].access).includes(true),
      allSubRoles = flat(allRoles.map(id => server.staffAccess[id].roles));
    
    if (!access) return channel.send(`${emojis.tickno} You do not have access to this subserver.`);
    if (guild.members.cache.get(member.user.id)) return channel.send(`${emojis.tickno} You are already in this subserver.`);

    oauth.addMember({
      accessToken: access_token,
      botToken: client.token,
      guildId: server.id,
      userId: member.user.id,
      roles: allSubRoles
    }).then(() => {
      channel.send(`${emojis.tickyes} You are now added to **${guild.name}**.`)
    }).catch(e => {
      console.log(e);
      channel.send(`${emojis.tickno} An unknown error occurred when trying to add you to the subserver.`)
    })
  }).catch(e => console.log(e) && channel.send(`${emojis.tickno} Your OAuth2 is not working! \`${config.prefix}oauth\``));
};