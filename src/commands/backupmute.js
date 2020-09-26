module.exports = {
  description: "(BACKUP ONLY) Mute someone.",
  usage: {
    "<user>": "The user you want to mute.",
    "[reason...]": "The reason for your mute."
  },
  examples: {},
  aliases: [ "bumute", "auttajadownplsmute" ],
  permissionRequired: 2, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => args.length
}

const { getMember } = require("../utils/resolvers.js"), constants = require("../constants")

module.exports.run = async (client, message, args) => {
  let memberQuery = args.shift(), member = await getMember(memberQuery, message.guild);
  if (!member) return message.channel.send(`${constants.emojis.tickNo} No user was found with your query.`)
  if (constants.getPermissionLevel(member) > 0) return message.channel.send(`${constants.emojis.tickNo} Are you seriously trynna mute one of your own?`)

  let reason = args.join(" ") || "They were kinda sus. (No reason provided)"
  message.guild.channels.cache.get(constants.backupModerationLogChannel).send({
    embed: {
      title: "Mute",
      color: 0xf1c40f,
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
  await member.roles.add(constants.roles.muted, `Action done by ${message.author.tag} (${message.author.id}) with reason: ${reason}`);
  message.channel.send(`${constants.emojis.tickYes} ${constants.gifs.mute[Math.floor(Math.random() * constants.gifs.mute.length)]}`)
  setTimeout(() => member.roles.remove(constants.roles.muted, `Unmuted after timer.`), 3600000)
}