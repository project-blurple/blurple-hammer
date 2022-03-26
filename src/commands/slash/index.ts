import type { ApplicationCommandOptionData, Awaitable, CommandInteraction } from "discord.js";
import type { Autocomplete } from "../../handlers/interactions/autocompletes";
import type { PermissionLevel } from "../../constants/permissions";

export interface SlashCommand {
  description: string;
  options?: Array<ApplicationCommandOptionData>;
  autocompletes?: {
    [optionName: string]: Autocomplete;
  }
  execute(interaction: CommandInteraction): Awaitable<void>;
}

export const permissions: Record<string, PermissionLevel> = {

};
