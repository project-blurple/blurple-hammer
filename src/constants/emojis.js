module.exports = {
  white: "<:white:840901385426829312>",
  wave: "<:wave:840901016220336149>",
  tickyes: "<:tickyes:840901012441006100>",
  tickno: "<:tickno:840901009010458645>",
  thumbsup: "<:thumbsup:840901010216976396>",
  thumbsdown: "<:thumbsdown:840901014550085652>",
  tada: "<:tada:840901013727871006>",
  star: "<:star:840901011274989588>",
  sparkle: "<:sparkle:840901008204234772>",
  hammer: "<:hammer:840901015317250058>",
  blank: "<:blank:840901752642338837>"
};

module.exports.ids = {};
for (const name in module.exports) if (name !== "ids") module.exports.ids[name] = module.exports[name].replace(/\D/g, "");