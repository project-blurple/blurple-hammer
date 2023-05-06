import { readdirSync } from "fs";
import type{ Awaitable, Message, MessageEditOptions, MessageReplyOptions } from "discord.js";

export interface MentionCommand {
  names: [string, ...string[]];
  ownerOnly?: true;
  testArgs(args: string[]): boolean;
  execute(message: Message<true>, reply: (content: string | MessageEditOptions & MessageReplyOptions) => Promise<Message>, args: string[]): Awaitable<void>;
}

export const quickResponses: Array<[
  triggers: [string, ...string[]],
  response: string,
]> = [];

export const allMentionCommands = readdirSync(__dirname)
  .filter(file => !file.includes("index") && (file.endsWith(".js") || file.endsWith(".ts")))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires -- we need this for it to be synchronous
  .map(file => require(`./${file}`).default as MentionCommand);
