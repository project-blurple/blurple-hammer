const contents = require("./contents.js");

const channel_id = "412755378732793868";

module.exports = client => {
  client.on("message", async message => {
    if (
      message.channel &&
      message.channel.id == channel_id &&
      message.content == "refresh"
    ) {
      // hide the channel so people who somehow have notifications for all the messages in the channel doesn't get notified
      try {
        await message.channel.updateOverwrite(message.guild.roles.everyone, {
          VIEW_CHANNEL: false
        });
      } catch(e) {/* something went wrong */}

      // delete the contents of the channel that can be bulk-deleted
      try {
        await message.channel.bulkDelete(50);
        await sleep(1000);
      } catch(e) {/* something went wrong */}

      // delete messages that can't be bulk-deleted
      const messages = await message.channel.messages.fetch(), navigation = {};
      await Promise.all(messages.map(m => m.delete()));

      // send the contents
      let first = true;
      for (const content of contents) {
        if (typeof content == "string") await message.channel.send(first ? "" : "** **", {
          files: [
            {
              attachment: require("path").join(__dirname, content),
              name: "banner.png"
            }
          ]
        }); else {
          const m = await message.channel.send({ embed: Object.assign({ color: 0x7289DA }, content.embed) });
          if (content.navigation) navigation[content.navigation] = m.url;
        }
        first = false;
      }

      // set up navigation
      await message.channel.send("** **", {
        files: [
          {
            attachment: require("path").join(__dirname, "images/navigation.png"),
            name: "banner.png"
          }
        ]
      });
      await message.channel.send({
        embed: {
          description: Object.keys(navigation).map(name => `• [${name}](<${navigation[name]}>)`).join("\n"),
          color: 0x7289DA
        }
      });

      // unhide the channel
      try {
        await message.channel.lockPermissions();
      } catch(e) {/* something went wrong */}
    }
  });
};

const sleep = time => new Promise(resolve => setTimeout(resolve, time));