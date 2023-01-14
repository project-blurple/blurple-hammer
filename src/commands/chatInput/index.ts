import type{ ApplicationCommandAutocompleteNumericOptionData, ApplicationCommandAutocompleteStringOptionData, ApplicationCommandBooleanOptionData, ApplicationCommandChannelOptionData, ApplicationCommandMentionableOptionData, ApplicationCommandNonOptionsData, ApplicationCommandNumericOptionData, ApplicationCommandRoleOptionData, ApplicationCommandStringOptionData, ApplicationCommandUserOptionData, Awaitable, ChatInputCommandInteraction } from "discord.js";
import type{ Autocomplete } from "../../handlers/interactions/autocompletes";
import { readdirSync } from "fs";

export type FirstLevelChatInputCommand = ChatInputCommandMeta & {
  public?: true;
} & (ChatInputCommandExecutable | ChatInputCommandGroup<SecondLevelChatInputCommand>);

export type SecondLevelChatInputCommand = ChatInputCommandMeta & (ChatInputCommandExecutable | ChatInputCommandGroup<ThirdLevelChatInputCommand>);

export type ThirdLevelChatInputCommand = ChatInputCommandExecutable & ChatInputCommandMeta;

export type ChatInputCommand = FirstLevelChatInputCommand | SecondLevelChatInputCommand | ThirdLevelChatInputCommand;

export interface ChatInputCommandExecutable {
  options?: [ChatInputCommandOptionData, ...ChatInputCommandOptionData[]];
  execute(interaction: ChatInputCommandInteraction<"cached">): Awaitable<void>;
}

export interface ChatInputCommandGroup<NthLevelChatInputCommand extends SecondLevelChatInputCommand | ThirdLevelChatInputCommand> {
  subcommands: [NthLevelChatInputCommand, ...NthLevelChatInputCommand[]];
}

export interface ChatInputCommandMeta {
  name: string;
  description: string;
}

export type ChatInputCommandOptionDataAutocomplete =
  | (Omit<ApplicationCommandAutocompleteNumericOptionData, "autocomplete"> & { autocomplete: Autocomplete<number> })
  | (Omit<ApplicationCommandAutocompleteStringOptionData, "autocomplete"> & { autocomplete: Autocomplete<string> });

export type ChatInputCommandOptionDataNoAutocomplete =
| ApplicationCommandBooleanOptionData
| ApplicationCommandChannelOptionData
| ApplicationCommandMentionableOptionData
| ApplicationCommandNonOptionsData
| ApplicationCommandRoleOptionData
| ApplicationCommandUserOptionData
| Omit<ApplicationCommandNumericOptionData, "autocomplete">
| Omit<ApplicationCommandStringOptionData, "autocomplete">;

export type ChatInputCommandOptionData = ChatInputCommandOptionDataAutocomplete | ChatInputCommandOptionDataNoAutocomplete;

export const allChatInputCommands = readdirSync(__dirname)
  .filter(file => !file.includes("index"))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires -- we need this for it to be synchronous
  .map(file => require(`./${file}`).default as FirstLevelChatInputCommand);
