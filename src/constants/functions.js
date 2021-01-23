const config = require("../../config.json");

module.exports = {
  onlyUnique: (value, index, self) => self.indexOf(value) == index,
  flat: (input, depth = 1, stack = []) => {
    for (let item of input) if (item instanceof Array && depth > 0) module.exports.flat(item, depth - 1, stack); else stack.push(item);
    return stack;
  },
  parseArgs: _arguments => (_arguments.match(/"[^"]+"|[^ ]+/g) || []).map(argument => argument.startsWith("\"") && argument.endsWith("\"") ? argument.slice(1).slice(0, -1) : argument),
  msToTime: ms => {
    let
      days = Math.floor(ms / 86400000), // 24*60*60*1000
      daysms = ms % 86400000, // 24*60*60*1000
      hours = Math.floor(daysms / 3600000), // 60*60*1000
      hoursms = ms % 3600000, // 60*60*1000
      minutes = Math.floor(hoursms / 60000), // 60*1000
      minutesms = ms % 60000, // 60*1000
      sec = Math.floor(minutesms / 1000),
      str = "";
    if (days) str = str + days + "d";
    if (hours) str = str + hours + "h";
    if (minutes) str = str + minutes + "m";
    if (sec) str = str + sec + "s";
  
    return str;
  },
  getPermissionLevel: member => {
    if (config.owner === member.user.id) return 7; // bot owner
    const roles = member.roles.cache.map(r => r.id);
    if (roles.includes(module.exports.roles.admin)) return 6; // director
    if (roles.includes(module.exports.roles.exec)) return 5; // executive
    if (roles.includes(module.exports.roles.srmod)) return 4; // executive assistant
    if (roles.includes(module.exports.roles.mod)) return 3; // moderator
    if (roles.includes(module.exports.roles.jrmod)) return 2; // helper
    if (roles.includes(module.exports.roles.helper)) return 1; // assistant (developers and creative associates)
    return 0; // normal user
  },
  lockMessage: user => `***CHANNEL IS LOCKED BY ${user}***`,
  getUsage: args => JSON.parse(JSON.stringify(args)).map(arg => {
    let str = arg.name;
    if (arg.type == 4 && !arg.choices) arg.choices = [ "number" ];
    else if (arg.type == 5) arg.choices = [ "boolean" ];
    else if (arg.type == 6) arg.choices = [ "member" ];
    else if (arg.type == 7) arg.choices = [ "channel" ];
    else if (arg.type == 8) arg.choices = [ "role" ];
    if (arg.choices && arg.choices.length) str = str + ": " + arg.choices.map(a => a.value || a).join("|");
    return arg.required ? `<${str}>` : `[${str}]`;
  }).join(" ")
};