import { PermissionLevel, getPermissionLevel } from "../../constants/permissions";
import { SlashCommand, permissions } from "../../commands/slash";
import type { CommandInteraction } from "discord.js";

export default async (interaction: CommandInteraction) => {
  const command = interaction.guild?.commands.cache.find(c => c.name === interaction.commandName);

  if (command) {
    const permissionLevel = await getPermissionLevel(interaction.user);
    if (permissionLevel < (permissions[command.name] || PermissionLevel.NONE)) return;

    const path = [command.name];

    const subCommandOrGroup = command.options.find(o => o.type === "SUB_COMMAND" || o.type === "SUB_COMMAND_GROUP");
    if (subCommandOrGroup) {
      path.push(subCommandOrGroup.name);
      if (subCommandOrGroup.type === "SUB_COMMAND_GROUP") {
        const subCommand = subCommandOrGroup.options?.find(o => o.type === "SUB_COMMAND");
        if (subCommand) path.push(subCommand.name);
      }
    }

    const commandFile = (await import(`../../commands/slash/${path.join("/")}`)).default as SlashCommand;
    commandFile.execute(interaction);
  }
};
