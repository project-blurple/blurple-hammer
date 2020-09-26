module.exports = {
  description: "(BACKUP ONLY) Kick someone.",
  usage: {
    "<user>": "The user you want to kick.",
    "[reason...]": "The reason for your kick."
  },
  examples: {},
  aliases: [ "bukick", "auttajadownplskick" ],
  permissionRequired: 2, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length
}

const { getMember } = require("../utils/resolvers.js"), constants = require("../constants")

module.exports.run = async (client, message, args) => {
  let memberQuery = args.shift(), member = await getMember(memberQuery, message.guild);
  if (!member) return message.channel.send(`${constants.emojis.tickno} No user was found with your query.`)
  if (constants.getPermissionLevel(member) > 0) return message.channel.send(`${constants.emojis.tickno} Are you seriously trynna kick one of your own?`)

  let reason = args.join(" ") || "They were kinda sus. (No reason provided)"
  message.guild.channels.cache.get(constants.backupModerationLogChannel).send({
    embed: {
      title: "Kick",
      color: 0x3498db,
      description: [
        `**User:** ${member} \`${member.user.tag}\` (${member.user.id})`,
        `**Moderator:** ${message.author} \`${message.author.tag}\` (${message.author.id})`,
        `**Reason:** ${reason}`
      ].join("\n"),
      thumbnail: {
        url: member.user.displayAvatarURL({ size: 256, dynamic: true })
      }
    }
  })
  await member.kick(`Action done by ${message.author.tag} (${message.author.id}) with reason: ${reason}`);
  message.channel.send(`${constants.emojis.tickyes} ${constants.gifs.kick[Math.floor(Math.random() * constants.gifs.kick.length)]}`)
}