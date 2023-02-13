import { readdirSync } from "fs";
import type{ Awaitable, GuildMember, Message, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";

interface BaseMenuCommand {
  name: string;
  public?: true;
}

export interface UserMenuCommand extends BaseMenuCommand {
  type: "user";
  execute(interaction: UserContextMenuCommandInteraction<"cached">, target: GuildMember): Awaitable<void>;
}

export interface MessageMenuCommand extends BaseMenuCommand {
  type: "message";
  execute(interaction: MessageContextMenuCommandInteraction<"cached">, target: Message<true>): Awaitable<void>;
}

export type MenuCommand = MessageMenuCommand | UserMenuCommand;

export const allMenuCommands = readdirSync(__dirname)
  .filter(file => !file.includes("index") && (file.endsWith(".js") || file.endsWith(".ts")))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires -- we need this for it to be synchronous
  .map(file => require(`./${file}`).default as MenuCommand);
