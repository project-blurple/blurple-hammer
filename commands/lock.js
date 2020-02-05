module.exports = {
  description: "",
  usage: {},
  examples: {},
  aliases: [],
  checkArgs: (args) => args.length == 1
  permissionRequired: 2, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 Promise#0001
}

module.exports.run = module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {}