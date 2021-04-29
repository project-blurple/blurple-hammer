module.exports = {
  blank: "<:blank:831188041862873149>",
  loading: "<a:loading:572202235342225418>",
  blurple: "<:blurple:673265867840290859>",
  thumbsup: "<:thumbsup:673265868301533194>",
  birthdayhat: "<:birthdayhat:673265867995217931>",
  tickyes: "<:tickyes:673265868213452855>",
  drippingheart: "<:drippingheart:673265868318310401>",
  pingsock: "<:pingsock:673265868385550376>",
  hammer: "<:hammer:673265868414910520>",
  darkblurple: "<:darkblurple:673265868444270602>",
  tada: "<:tada:673265868188287007>",
  tickno: "<:tickno:673265868461047828>",
  star: "<:star:673265868490145825>",
  wave: "<:wave:673265868498796591>",
  weewoo: "<a:weewoo:673265868079366155>",
  sparkle: "<:sparkle:673265868603654183>",
  love: "<a:love:673265868666437632>",
  white: "<:white:673265868716638208>",
  thumbsdown: "<:thumbsdown:673265868662112269>",
  heart: "<:heart:673265871094939674>"
};

module.exports.ids = {};
for (const name in module.exports) if (name !== "ids") module.exports.ids[name] = module.exports[name].replace(/\D/g, "");