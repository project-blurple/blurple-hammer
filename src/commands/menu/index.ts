import type { Awaitable, GuildMember, Message, MessageContextMenuInteraction, UserContextMenuInteraction } from "discord.js";
import type { PermissionLevel } from "../../constants/permissions";

interface MessageMenuCommand {
  type: "MESSAGE";
  execute(interaction: MessageContextMenuInteraction, target: Message): Awaitable<void>;
}

interface UserMenuCommand {
  type: "USER";
  execute(interaction: UserContextMenuInteraction, target: GuildMember): Awaitable<void>;
}

export type ContextMenuCommand = (MessageMenuCommand | UserMenuCommand) & {
  permissionLevelRequired: PermissionLevel;
};
