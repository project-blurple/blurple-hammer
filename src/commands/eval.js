module.exports = {
  description: "Evaluate some code.",
  options: [{
    type: 3,
    name: "code",
    description: "The code you want to run through the bot.",
    required: true
  }],
  aliases: [],
  permissionRequired: 7 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ channel, client }, { code }) => {
  try {
    let evaled = await eval(code);
    if (typeof evaled != "string") evaled = require("util").inspect(evaled);
    evaled = evaled.replace(client.token, "-- Redacted ---");

    channel.send(`🆗 Evaluated successfully.\n\`\`\`js\n${evaled}\`\`\``);
  } catch (e) {
    let err;
    if (typeof e == "string") err = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else err = e;
    channel.send(`🆘 JavaScript failed.\n\`\`\`fix\n${err}\`\`\``);
  }
};
