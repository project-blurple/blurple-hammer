const config = require("../../config.json"), roles = require("./roles.js"), { guilds } = require("./");

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
  getPermissionLevel: user => {
    if (config.owner === user.id) return 7; // bot owner
    const
      guild = user.client.guilds.cache.get(guilds.main),
      member = guild.members.cache.get(user.id);
    if (!member) return 0; // not in main server
    const memberRoles = member.roles.cache.map(r => r.id);
    if (memberRoles.includes(roles.admin)) return 6; // director
    if (memberRoles.includes(roles.executive)) return 5; // executive
    if (memberRoles.includes(roles.executiveassistant)) return 4; // executive assistant
    if (memberRoles.includes(roles.mod)) return 3; // moderator
    if (memberRoles.includes(roles.helper)) return 2; // helper
    if (memberRoles.includes(roles.assistant)) return 1; // assistant (developers and creative associates)
    if (memberRoles.includes(roles.botban)) return -1; // banned from using bots
    return 0; // normal user
  },
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