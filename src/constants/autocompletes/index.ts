import type { ApplicationCommandOptionChoiceData, AutocompleteInteraction, Awaitable } from "discord.js";

export interface Autocomplete<QueryType extends boolean | number | string> {
  execute(query: QueryType, interaction: AutocompleteInteraction<"cached">): Awaitable<ApplicationCommandOptionChoiceData[]>;
}
