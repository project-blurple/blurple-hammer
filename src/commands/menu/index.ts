import type{ Awaitable, GuildMember, Message, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import { readdirSync } from "fs";

interface BaseMenuCommand {
  name: string;
  public?: true;
}

export interface UserMenuCommand extends BaseMenuCommand {
  execute(interaction: UserContextMenuCommandInteraction<"cached">, target: GuildMember): Awaitable<void>;
  type: "user";
}

export interface MessageMenuCommand extends BaseMenuCommand {
  execute(interaction: MessageContextMenuCommandInteraction<"cached">, target: Message<true>): Awaitable<void>;
  type: "message";
}

export type MenuCommand = MessageMenuCommand | UserMenuCommand;

export const allMenuCommands = readdirSync(__dirname)
  .filter(file => !file.includes("index") && (file.endsWith(".js") || file.endsWith(".ts")))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports -- we need this for it to be synchronous
  .map(file => require(`./${file}`).default as MenuCommand);
