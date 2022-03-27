import type { ApplicationCommandOptionChoice, AutocompleteInteraction, Awaitable } from "discord.js";
import type { SlashCommand } from "../../commands/slash";

export type Autocomplete = (query: string | number, interaction: AutocompleteInteraction) => Awaitable<Array<ApplicationCommandOptionChoice>>;

export default async (interaction: AutocompleteInteraction) => {
  const path = [interaction.commandName, interaction.options.getSubcommandGroup(false), interaction.options.getSubcommand(false)].filter(Boolean);
  const command = (await import(`../../commands/slash/${path.join("/")}`)).default as SlashCommand;
  const autocompletes = command.autocompletes || {};

  const { name, value } = interaction.options.getFocused(true);
  const autocomplete = autocompletes[name];

  if (autocomplete) {
    const response = await autocomplete(value, interaction);
    interaction.respond(response);
  }
};
