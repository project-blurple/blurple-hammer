import type { Awaitable, Message, MessageReplyOptions } from "discord.js";

export interface MentionCommand {
  aliases?: [string, ...string[]];
  ownerOnly?: true;
  testArgs(args: string[]): boolean;
  execute(message: Message<true>, reply: (options: MessageReplyOptions | string) => Promise<Message>, args: string[]): Awaitable<Message>;
}

export const quickResponses: Array<[
  triggers: [string, ...string[]],
  response: string,
]> = [];
