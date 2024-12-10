import type{ Awaitable, Message, MessageEditOptions, MessageReplyOptions } from "discord.js";
import { readdirSync } from "fs";

export interface MentionCommand {
  execute(message: Message<true>, reply: (content: MessageEditOptions & MessageReplyOptions | string) => Promise<Message>, args: string[]): Awaitable<void>;
  names: [string, ...string[]];
  ownerOnly?: true;
  testArgs(args: string[]): boolean;
}

export const quickResponses: Array<[
  triggers: [string, ...string[]],
  response: string,
]> = [];

export const allMentionCommands = readdirSync(__dirname)
  .filter(file => !file.includes("index") && (file.endsWith(".js") || file.endsWith(".ts")))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports -- we need this for it to be synchronous
  .map(file => require(`./${file}`).default as MentionCommand);
