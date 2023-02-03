import type { ButtonComponentData, MessageCreateOptions, Snowflake } from "discord.js";
import { ButtonStyle, ComponentType } from "discord.js";
import type { AboutSection } from ".";
import Emojis from "../emojis";
import { buttonComponents } from "../../handlers/interactions/components";
import config from "../../config";

const section5RoleDescriptions: AboutSection = {
  title: "Role Descriptions",
  embed: {
    fields: [
      {
        name: "Staff Roles",
        value: formatRoleList({
          [config.roles.teamLeaders]: "Responsible for the management of the community behind the scenes.",
          [config.roles.leadershipStaff]: "Responsible for assisting in managing the community and the staff team.",
          [config.roles.moderationStaff]: "Responsible for the moderation of all channels and enforce our server rules. They are also responsible for handling all server submissions.",
          [config.roles.supportStaff]: "Responsible for either the development of our internal bots or the creation of various designs used in Project Blurple.",
        }),
      },
      {
        name: "Colored Roles",
        value: formatRoleList({
          [config.roles.partners]: "Server owners that have partnered up with Project Blurple.",
          [config.roles.megaDonators]: "Users who donated an enormous value to be given to Blurple users.",
          [config.roles.donators]: "Given to users who kindly donated prizes during the event.",
          [config.roles.retiredStaff]: "Staff members who voluntarily resigned from the team.",
          [config.roles.blurpleServerRepresentative]: "Blurple server representatives who are celebrating with us and joined the server roster in blurple server list.",
          [config.roles.blurpleUser]: "Blurple users who are celebrating with us by setting their profile picture to a Blurple-colored picture.",
          [config.roles.painters]: "Blurple users who have collected paint and unlocked the mighty role.",
          [config.roles.artists]: "Blurple users who have shown their artistic skills in the Blurple Canvas.",
          [config.roles.adventurers]: "Blurple users who have or are currently participating in the Project Blurple Minecraft server.",
        }),
      },
      {
        name: "Self-obtainable Roles",
        value: formatRoleList({
          [config.roles.miscellaneous.archiveAccess]: "Has access to archived channels.",
          [config.roles.miscellaneous.eventsPing]: "Gets notified whenever we have an event.",
        }),
      },
    ],
  },
  components: selfObtainableRoleButtons({
    [config.roles.miscellaneous.archiveAccess]: "Archive Access",
    [config.roles.miscellaneous.eventsPing]: "Events Ping",
  }),
};

export default { ...section5RoleDescriptions } as AboutSection;

function formatRoleList(roleDescriptions: Record<Snowflake, string>) {
  return Object.entries(roleDescriptions)
    .map(([roleId, description]) => `<@&${roleId}> » ${description}`)
    .join("\n\n");
}

function selfObtainableRoleButtons(roles: Record<Snowflake, string>): MessageCreateOptions["components"] {
  for (const roleId in roles) {
    buttonComponents.set(`self-assign-role:${roleId}`, {
      allowedUsers: "all",
      persistent: true,
      callback(button) {
        const hasRole = button.member.roles.cache.has(roleId);
        if (hasRole) {
          void button.member.roles.remove(roleId, "User self-removed role");
          void button.reply({ content: `${Emojis.ThumbsUp} Removed the <@&${roleId}> role.`, ephemeral: true });
        } else {
          void button.member.roles.add(roleId, "User self-assigned role");
          void button.reply({ content: `${Emojis.ThumbsUp} Added the <@&${roleId}> role.`, ephemeral: true });
        }
      },
    });
  }

  const buttons = Object.entries(roles).map<ButtonComponentData>(([roleId, roleName]) => ({
    type: ComponentType.Button,
    label: `Toggle ${roleName}-role`,
    style: ButtonStyle.Secondary,
    customId: `self-assign-role:${roleId}`,
  }));

  // group buttons into groups of 5
  const groups: Array<typeof buttons> = [];
  for (let i = 0; i < buttons.length; i += 5) groups.push(buttons.slice(i, i + 5));

  return groups.map(group => ({ type: ComponentType.ActionRow, components: group }));
}
