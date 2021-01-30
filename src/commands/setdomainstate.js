const { emojis, regex: { linkDomainRegex } } = require("../constants"), { domainstates } = require("../database");

module.exports = {
  description: "Set a domain's state to safe, unsafe or reset it back to default.",
  options: [
    {
      type: 3,
      name: "domain",
      description: "The domain you want to override the state of.",
      required: true
    },
    {
      type: 3,
      name: "state",
      description: "The new state of the domain.",
      required: true,
      choices: [
        {
          name: "Safe",
          value: "safe"
        },
        {
          name: "Unsafe",
          value: "unsafe"
        },
        {
          name: "Default",
          value: "default"
        }
      ]
    }
  ],
  aliases: [],
  permissionRequired: 2 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

module.exports.run = async ({ channel }, { domain, state }) => {
  domain = (domain.toLowerCase().match(linkDomainRegex) || [null])[0];
  if (!domain) return channel.send(`${emojis.tickno} Invalid domain.`);
  if (domain.startsWith("www.")) domain = domain.replace("www.", "");
  if (state == "safe") {
    domainstates.set(domain, true);
    channel.send(`${emojis.tickyes} Domain \`${domain}\` is now considered safe.`);
  } else if (state == "unsafe") {
    domainstates.set(domain, false);
    channel.send(`${emojis.tickyes} Domain \`${domain}\` is now considered unsafe.`);
  } else if (state == "default") {
    domainstates.unset(domain);
    channel.send(`${emojis.tickyes} Domain \`${domain}\` is no longer overwritten and its safe status will be evaluated automatically by MyWOT and Google Safe Browsing.`);
  }
};