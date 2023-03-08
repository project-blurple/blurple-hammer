import type{ ChatInputCommandInteraction } from "discord.js";
import { allChatInputCommands } from "../../commands/chatInput";

export default function chatInputCommandHandler(interaction: ChatInputCommandInteraction<"cached">): void {
  const hierarchy = [interaction.commandName, interaction.options.getSubcommandGroup(false), interaction.options.getSubcommand(false)] as const;
  let command = allChatInputCommands.find(({ name }) => name === hierarchy[0]);
  if (command && hierarchy[1] && "subcommands" in command) command = command.subcommands.find(({ name }) => name === hierarchy[1]);
  if (command && hierarchy[2] && "subcommands" in command) command = command.subcommands.find(({ name }) => name === hierarchy[2]);

  if (command && "execute" in command) return void command.execute(interaction);
}
