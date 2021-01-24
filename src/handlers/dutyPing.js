const { emojis: { ids: { weewoo }} } = require("../constants");

module.exports = async (message, sod) => {
  await sod.setMentionable(false, `Role was pinged in #${message.channel.name}`);
  await message.react(weewoo);
  setTimeout(() => sod.setMentionable(true), 120000);
};