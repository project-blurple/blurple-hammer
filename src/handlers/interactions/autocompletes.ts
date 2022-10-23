import type { AutocompleteInteraction } from "discord.js";
import type { ChatInputCommand } from "../../commands/chatInput";

export default async function autocompleteHandler(interaction: AutocompleteInteraction<"cached">): Promise<void> {
  const path = [interaction.commandName, interaction.options.getSubcommandGroup(false), interaction.options.getSubcommand(false)].filter(Boolean) as string[];

  const { default: command } = await import(`../../commands/chatInput/${path.join("/")}`) as { default?: ChatInputCommand };
  if (!command) return;

  const autocompletes = command.autocompletes ?? {};
  const { name, value } = interaction.options.getFocused(true);
  const autocomplete = autocompletes[name];

  const choices = await autocomplete?.execute(value as never, interaction);
  if (choices) void interaction.respond(choices);
}
