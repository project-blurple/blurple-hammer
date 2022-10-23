import type { ApplicationCommandAutocompleteNumericOptionData, ApplicationCommandAutocompleteStringOptionData, ApplicationCommandBooleanOptionData, ApplicationCommandChannelOptionData, ApplicationCommandMentionableOptionData, ApplicationCommandNonOptionsData, ApplicationCommandNumericOptionData, ApplicationCommandRoleOptionData, ApplicationCommandStringOptionData, ApplicationCommandUserOptionData, Awaitable, ChatInputCommandInteraction } from "discord.js";
import type { Autocomplete } from "../../constants/autocompletes";

type ApplicationCommandAllowedOptions =
  | ApplicationCommandAutocompleteNumericOptionData
  | ApplicationCommandAutocompleteStringOptionData
  | ApplicationCommandBooleanOptionData
  | ApplicationCommandChannelOptionData
  | ApplicationCommandMentionableOptionData
  | ApplicationCommandNonOptionsData
  | ApplicationCommandNumericOptionData
  | ApplicationCommandRoleOptionData
  | ApplicationCommandStringOptionData
  | ApplicationCommandUserOptionData
;

export interface ChatInputCommand {
  description: string;
  options?: [ApplicationCommandAllowedOptions, ...ApplicationCommandAllowedOptions[]];
  autocompletes?: Record<string, Autocomplete<never>>;
  ownerOnly?: true;
  execute(interaction: ChatInputCommandInteraction<"cached">): Awaitable<void>;
}
