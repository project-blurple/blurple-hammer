module.exports = {
  description: "",
  usage: {},
  examples: {},
  aliases: [],
  permissionRequired: 2, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
  checkArgs: (args) => {
    if (args[0] == "-all" && args.length == 1) return true;
    else if (!args.length) return true;
    else return false;
  }
}

module.exports.run = module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {}