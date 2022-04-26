import { PermissionLevel, getPermissionLevel } from "../../../constants/permissions";
import type { SlashCommand } from "..";

const command: SlashCommand = {
  description: "Debug your permission level",
  execute(interaction) {
    const permissionLevel = getPermissionLevel(interaction.user);
    interaction.reply({
      content: `Your permission level is ${permissionLevel} (${PermissionLevel[permissionLevel]})`,
    });
  },
};

export default command;
