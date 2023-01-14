import type{ ApplicationCommandOptionChoiceData, AutocompleteInteraction, Awaitable } from "discord.js";
import { allChatInputCommands } from "../../commands/chatInput";

export type Autocomplete<QueryType extends number | string> = (query: QueryType, interaction: AutocompleteInteraction<"cached">) => Awaitable<Array<ApplicationCommandOptionChoiceData<QueryType>>>;

export default async function autocompleteHandler(interaction: AutocompleteInteraction<"cached">): Promise<void> {
  const hierarchy = [interaction.commandName, interaction.options.getSubcommandGroup(false), interaction.options.getSubcommand(false)] as const;
  let command = allChatInputCommands.find(({ name }) => name === hierarchy[0]);
  if (command && hierarchy[1] && "subcommands" in command) command = command.subcommands.find(({ name }) => name === hierarchy[1]);
  if (command && hierarchy[2] && "subcommands" in command) command = command.subcommands.find(({ name }) => name === hierarchy[2]);

  if (command && "options" in command) {
    const { name, value } = interaction.options.getFocused(true);
    const option = command.options.find(({ name: optionName }) => optionName === name);
    if (option && "autocomplete" in option) {
      const choices = await option.autocomplete(value as never, interaction);
      return interaction.respond(choices);
    }
  }
}
