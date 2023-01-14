import type{ ContextMenuCommandInteraction } from "discord.js";
import { allMenuCommands } from "../../commands/menu";

export default async function menuCommandHandler(interaction: ContextMenuCommandInteraction<"cached">): Promise<void> {
  const command = allMenuCommands.find(({ name }) => name === interaction.commandName);
  if (interaction.isMessageContextMenuCommand() && command?.type === "message") {
    const target = await interaction.channel?.messages.fetch(interaction.targetId).catch(() => null);
    if (target) return command.execute(interaction, target);
  } else if (interaction.isUserContextMenuCommand() && command?.type === "user") {
    const target = await interaction.guild.members.fetch(interaction.targetId).catch(() => null);
    if (target) return command.execute(interaction, target);
  }
}
