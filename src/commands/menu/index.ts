import type { Awaitable, GuildMember, Message, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";

interface MessageMenuCommand {
  type: "MESSAGE";
  execute(interaction: MessageContextMenuCommandInteraction<"cached">, target: Message): Awaitable<void>;
}

interface UserMenuCommand {
  type: "USER";
  execute(interaction: UserContextMenuCommandInteraction<"cached">, target: GuildMember): Awaitable<void>;
}

export type ContextMenuCommand = {
  ownerOnly?: true;
} & (MessageMenuCommand | UserMenuCommand);
