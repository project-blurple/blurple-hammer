import type { ContextMenuCommand } from "../../commands/menu";
import type { ContextMenuCommandInteraction } from "discord.js";
import config from "../../config";

export default async function contextMenuCommandHandler(interaction: ContextMenuCommandInteraction<"cached">): Promise<void> {
  const applicationCommand = interaction.client.guilds.cache.get(config.guildId)!.commands.cache.find(({ name }) => name === interaction.commandName);
  if (!applicationCommand) return;

  const { default: command } = await import(`../../commands/menu/${applicationCommand.name}`) as { default: ContextMenuCommand };

  if (command.type === "MESSAGE" && interaction.isMessageContextMenuCommand()) {
    const target = await interaction.channel?.messages.fetch(interaction.targetId).catch(() => null);
    if (!target) return;
    return command.execute(interaction, target);
  }

  if (command.type === "USER" && interaction.isUserContextMenuCommand()) {
    const target = await interaction.guild.members.fetch(interaction.targetId).catch(() => null);
    if (!target) return;
    return command.execute(interaction, target);
  }
}
