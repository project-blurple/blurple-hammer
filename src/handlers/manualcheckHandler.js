const { channels: { manualCheck }, functions: { getPermissionLevel }, roles } = require("../constants");

const check = "✅", cross = "❌";

module.exports = async message => {
  const m = await message.channel.send(message.author.id, {
    files: [ message.author.avatarURL({ format: "png", dynamic: true, size: 128 }) ]
  });
  await m.react(check);
  await m.react(cross);
  message.delete();
};

module.exports.setupEvents = async client => client.on("messageReactionAdd", (reaction, user) => {
  if (reaction.message.channel.id == manualCheck && !user.bot && getPermissionLevel(user)) {
    if (reaction.emoji.name == check) {
      const member = reaction.message.guild.members.cache.get(reaction.message.content);
      if (member) member.roles.add(roles.blurpleusers);
    }
    reaction.message.delete();
  }
});