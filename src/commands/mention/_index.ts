import type { Awaitable, Message, MessageOptions } from "discord.js";
import type { PermissionLevel } from "../../constants/permissions";

export interface MentionCommand {
  aliases: string[];
  execute(message: Message, reply: (contentOrOptions: string | MessageOptions) => Promise<Message>, args: string[]): Awaitable<void>;
  testArgs(args: string[]): boolean;
  permissionLevelRequired: PermissionLevel;
}
