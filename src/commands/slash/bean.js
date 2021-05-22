module.exports = {
  description: "Bean someone",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to bean.",
      required: true
    },
    {
      type: 3,
      name: "reason",
      description: "The reason for the beanz.",
    }
  ],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = ({ respond }, { user, reason}) => {
    if (reason){
        respond(`<@!${user}>, you've been beaned!`);
    } else {
        respond(`${user}, you've been beaned for ${reason}!`);
    }
};
