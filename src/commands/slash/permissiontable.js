const { emojis, resolvers: { getRole }, embedColor } = require("../../constants");

module.exports = {
  description: "Get a table of permissions.",
  options: [
    {
      type: 7,
      name: "channel",
      description: "The channel you want to get the permission table for, instead of the whole server."
    },
    {
      type: 3,
      name: "roles",
      description: "The roles you want to filter for, separated with a comma. Accepts IDs or names."
    },
    {
      type: 3,
      name: "permissions",
      description: "The permissions you want to filter for, separated with a comma."
    }
  ],
  permissionRequired: 4 // 0 All, 1 Assistant, 2 Helper, 3 Moderator, 4 Exec.Assistant, 5 Executive, 6 Director, 7 Promise#0001
};

const { allow, deny, none } = {
  allow: "✅",
  deny: "❌",
  none: "✴️"
};

module.exports.run = async ({ guild, respond }, { channel, roles = "blurple executives, executive assistants, moderators, official blurple bots, utility bots, muted, @everyone", permissions = "view channel, send messages, manage messages, embed links, attach files, connect, speak, change nickname" }) => {
  roles = roles.split(", ").map(r => getRole(r, guild)).filter(r => r);
  permissions = permissions.split(", ").map(p => p.toUpperCase().replace(/ /g, "_"));
  channel = guild.channels.cache.get(channel);

  if (!roles) return respond(`${emojis.tickno} No roles were found with that search.`, true);
  
  if (channel) respond({
    title: `Permission table for #${channel.name}`,
    description: `**Filtering for these permissions:**\n${permissions.map(p => `> • \`${p}\``).join("\n")}`,
    fields: [
      {
        name: "Role",
        value: roles.map(r => `• ${r}${emojis.blank}`).join("\n"),
        inline: true
      },
      {
        name: "Permissions",
        value: roles.map(r => {
          let perms = channel.permissionOverwrites.find(p => p.id == r.id);
          if (!perms) return permissions.map(() => none).join("|"); // placeholder
          return permissions.map(p => {
            if (perms.allow.has(p)) return allow;
            if (perms.deny.has(p)) return deny;
            return none;
          }).join("|");
        }).join("\n"),
        inline: true
      }
    ],
    color: embedColor
  }); else respond({
    title: "Permission table for the server",
    description: `**Filtering for these permissions:**\n${permissions.map(p => `> • \`${p}\``).join("\n")}`,
    fields: [
      {
        name: "Role",
        value: roles.map(r => `• ${r}${emojis.blank}`).join("\n"),
        inline: true
      },
      {
        name: "Permissions",
        value: roles.map(r => permissions.map(p => r.permissions.has(p) ? allow : none).join("|")).join("\n"),
        inline: true
      }
    ],
    color: embedColor
  });
};