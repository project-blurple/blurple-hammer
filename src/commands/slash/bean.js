module.exports = {
  description: "Bena someone",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to bean.",
      required: true
    }
  ],
  permissionRequired: 1 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = ({ respond }, { user }) => respond(`<@!${user}>, you've been beaned!`);