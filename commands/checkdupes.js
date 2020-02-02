module.exports = {
  description: "Filter out duplicates of a list of IDs.",
  usage: {
    "<ids ...>": "A list of IDs to filter out duplicates of, separated with a space."
  },
  examples: {},
  aliases: [ "nodupes" ],
  permissionRequired: 1,
  checkArgs: (args) => true
}

const onlyUnique = (value, index, self) => self.indexOf(value) == index;

module.exports.run = module.exports.run = async (client, message, args, config, constants, permissionLevel, db) => {
  message.channel.send("```as\n" + args.filter(onlyUnique).filter(s => s).join(" ") + "\n```")
}