import { PermissionLevel, getPermissionLevel } from "../../constants/permissions";
import type { ContextMenuCommand } from ".";
import Emojis from "../../constants/emojis";
import Roles from "../../constants/roles";

const command: ContextMenuCommand = {
  type: "USER",
  execute(interaction, member) {
    if (getPermissionLevel(member.user) < PermissionLevel.SUPPORT) {
      return interaction.reply({
        content: `${Emojis.WEEWOO} You can't toggle the duty role of a user with a permission level lower than \`${PermissionLevel[`${PermissionLevel.SUPPORT}`]}\``,
        ephemeral: true,
      });
    }

    if (member.roles.cache.has(Roles.STAFF_ON_DUTY)) {
      member.roles.remove(Roles.STAFF_ON_DUTY, `Toggled by ${interaction.member?.user.username} (${interaction.member?.user.id})`);
      interaction.reply({
        content: `${Emojis.THUMBSUP} User ${member} no longer has the duty role.`,
        ephemeral: true,
      });
    } else {
      member.roles.add(Roles.STAFF_ON_DUTY, `Toggled by ${interaction.member?.user.username} (${interaction.member?.user.id})`);
      interaction.reply({
        content: `${Emojis.THUMBSUP} User ${member} now has the duty role.`,
        ephemeral: true,
      });
    }

  },
  permissionLevelRequired: PermissionLevel.NONE,
};

export default command;
