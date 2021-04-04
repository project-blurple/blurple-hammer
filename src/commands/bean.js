

module.exports = {
  description: "Bean someone ... because why not?",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to ban",
      required: true
    },
    {
      type: 3,
      name: "reason",
      description: "The reason for the beanz."
    }
  ],
  aliases: [],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ channel }, { user, reason = "" }) => {
  if (reason == ""){  
    channel.send(`${user}, you've been beaned!`);
  } else {
    channel.send(`${user}, you've been beaned for ${reason}!`);
  }
};
