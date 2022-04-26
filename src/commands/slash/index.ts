import type { ApplicationCommandAutocompleteOption, ApplicationCommandChannelOptionData, ApplicationCommandChoicesData, ApplicationCommandNonOptionsData, ApplicationCommandNumericOptionData, Awaitable, CommandInteraction } from "discord.js";
import type { Autocomplete } from "../../handlers/interactions/autocompletes";
import { PermissionLevel } from "../../constants/permissions";

export interface SlashCommand {
  description: string;
  options?: Array<(
    | ApplicationCommandChoicesData
    | ApplicationCommandNonOptionsData
    | ApplicationCommandChannelOptionData
    | ApplicationCommandAutocompleteOption
    | ApplicationCommandNumericOptionData
  )>;
  autocompletes?: {
    [optionName: string]: Autocomplete;
  }
  execute(interaction: CommandInteraction): Awaitable<void>;
  onlyInMainServer?: true;
}

export const permissions: Record<string, PermissionLevel> = {
  debug: PermissionLevel.BLACKLISTED,
  gif: PermissionLevel.MODERATOR,
};
