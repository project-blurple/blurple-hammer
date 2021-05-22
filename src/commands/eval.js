module.exports = {
  description: "Run JavaScript code.",
  usage: {
    "<code ...>": "The JavaScript code you'd like to run. "
  },
  examples: {},
  aliases: [ "evaluate" ],
  permissionRequired: 7, // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
  checkArgs: (args) => !!args.length
};

module.exports.run = async ({ channel }, _, { content }) => {
  try {
    let evaled = eval(content);
    if (evaled instanceof Promise) {
      let start = Date.now();
      await Promise.all([ channel.send("♨️ Running..."), evaled ]).then(([ botMsg, output ]) => {
        if (typeof output != "string") output = require("util").inspect(output);
        botMsg.edit(`🆗 Evaluated successfully (\`${Date.now() - start}ms\`).\n\`\`\`js\n${output}\`\`\``);
      });
    } else {
      if (typeof evaled != "string") evaled = require("util").inspect(evaled);
      channel.send(`🆗 Evaluated successfully.\n\`\`\`js\n${evaled}\`\`\``);
    }
  } catch(e) {
    let err;
    if (typeof e == "string") err = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else err = e;
    channel.send(`🆘 JavaScript failed.\n\`\`\`fix\n${err}\`\`\``);
  }
};