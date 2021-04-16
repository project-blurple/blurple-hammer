const { emojis } = require("../../constants"), { timezones } = require("../../database");

module.exports = {
  description: "Get a staff member's timezone, or set someone's timezone.",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to get the timezone of."
    },
    {
      type: 3,
      name: "timezone",
      description: "The new timezone you want to set. Format: UTC±XX:XX",
    }
  ],
  aliases: [],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ channel, member }, { user = member, timezone = "" }) => {
  timezone = timezone.replace("UTC", "");
  if (timezone) {
    await timezones.set(user.user.id, timezone);
    channel.send(`${emojis.tickyes} The timezone for ${user.user.tag} has been set to UTC${timezone}.`);
  } else {
    const userTimezone = await timezones.get(user.user.id);
    if (!userTimezone) return channel.send(`${emojis.tickno} This user has no timezone registered yet.`);
    
    const
      offset = userTimezone.split(":")[0].replace("+0", "+").replace("-0", "-") + "." + (parseInt(userTimezone.split(":")[1]) / 60 * 10),
      date = getTimeInTimezone(offset);
    channel.send(`📋 ${user.user.tag}'s timezone is UTC${userTimezone} and their local time is \`${date}\`.`);
  }
};

function getTimeInTimezone(offset) { // https://stackoverflow.com/a/8207708
  console.log(offset);
  const
    d = new Date(),
    utc = d.getTime() + (d.getTimezoneOffset() * 60000),
    nd = new Date(utc + (3600000*offset));
  return nd.toLocaleString();
}