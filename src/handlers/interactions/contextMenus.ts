import type { ContextMenuCommand } from "../../commands/menu";
import type { ContextMenuInteraction } from "discord.js";


export default async (interaction: ContextMenuInteraction) => {
  const command = (await import(`../../commands/menu/${interaction.commandName}`)).default as ContextMenuCommand;

  if (command.type === "MESSAGE" && interaction.isMessageContextMenu()) {
    const message = await interaction.channel?.messages.fetch(interaction.targetId);
    if (message) command.execute(interaction, message);
  }

  if (command.type === "USER" && interaction.isUserContextMenu()) {
    const member = await interaction.guild?.members.fetch(interaction.targetId);
    if (member) command.execute(interaction, member);
  }
};
