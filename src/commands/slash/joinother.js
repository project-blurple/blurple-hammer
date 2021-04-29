const { emojis, oauth, guilds } = require("../../constants"), { oauth: db, subserveraccessoverrides: accessoverrides } = require("../../database"), { calculateAccess } = require("../../handlers/staffHandler.js");

module.exports = {
  description: "Make a staff staff join a subserver. Requires OAuth2 set up on their Staff account.",
  options: [
    {
      type: 6,
      name: "staff",
      description: "The staff you want to add to a subserver.",
      required: true
    },
    {
      type: 3,
      name: "subserver",
      description: "The subserver you want to make the other join.",
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

module.exports.run = async ({ client, member, respond }, { staff, subserver: acronym, force = false }) => {
  const tokens = await db.get(staff) || {};

  oauth.tokenRequest({
    refreshToken: tokens.refresh_token,
    grantType: "refresh_token",
    scope: ["identify", "guilds.join"]
  }).then(async ({ access_token, refresh_token }) => {
    db.set(staff, { access_token, refresh_token });

    const subserver = Object.values(guilds).find(g => typeof g !== "string" && g.acronym.toLowerCase() == acronym),
      { access, member: subMember, addRoles } = await calculateAccess(staff, Object.values(guilds).find(g => typeof g !== "string" && g.acronym.toLowerCase() == acronym), client);

    if (subMember) return respond(`${emojis.tickno} They are already in this subserver.`);
    if (!access && !force) return respond(`${emojis.tickno} They do not have access to this subserver.`);

    if (force) accessoverrides.set(`${subserver.id};${staff}`, member.user.id);

    oauth.addMember({
      accessToken: access_token,
      botToken: client.token,
      guildId: subserver.id,
      userId: staff,
      roles: addRoles
    }).then(() => {
      respond(`${emojis.tickyes} They are now added to **${subserver.name}**.`);
    }).catch(e => {
      console.log(e);
      respond(`${emojis.tickno} An unknown error occurred when trying to add them to the subserver.`);
    });
  }).catch(e => {
    console.log(e);
    respond(`${emojis.tickno} Their OAuth2 is not set up correctly!`);
  });
};
