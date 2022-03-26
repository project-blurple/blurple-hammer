import type { Message, MessageOptions, Snowflake } from "discord.js";
import Emojis from "../constants/emojis";
import type { MentionCommand } from "../commands/mention/_index";
import { getPermissionLevel } from "../constants/permissions";
import { hammerLogger } from "../utils/logger";
import { inspect } from "util";
import { join } from "path";
import { readdir } from "fs/promises";


export default async (message: Message) => {
  const existingReply = replies.get(message.id);
  if (!existingReply && message.editedTimestamp) return; // ignore editing into a command, but allow editing from a command to a new command

  const args = message.content.split(" ").slice(1);
  const commandOrAlias = (args.shift() || "").toLowerCase();

  const commandName = aliases.get(commandOrAlias) || commandOrAlias;
  const command = commands.get(commandName);
  if (!command) return reply(message, `${Emojis.ANGER} Command does not exist. It might've been moved to a slash command.`, existingReply);

  const permissionLevel = getPermissionLevel(message.author);
  if (permissionLevel < command.permissionLevelRequired) return reply(message, `${Emojis.ANGER} You don't have permission to use this command.`, existingReply);

  if (!command.testArgs(args)) return reply(message, `${Emojis.ANGER} Invalid arguments.`, existingReply);

  return command.execute(message, (contentOrOptions: string | MessageOptions) => reply(message, contentOrOptions, existingReply), args);
};


const replies = new Map<Snowflake, Message>();

async function reply(message: Message, contentOrOptions: string | MessageOptions, existingReply?: Message) {
  const options: MessageOptions = {
    allowedMentions: { repliedUser: false },
    ...typeof contentOrOptions === "string" ? { content: contentOrOptions } : contentOrOptions,
  };
  if (existingReply) return existingReply.edit(options);
  const newReply = await message.reply(options);
  replies.set(message.id, newReply);
  return newReply;
}


// loading commands
const commands = new Map<string, MentionCommand>(), aliases = new Map<string, string>();
readdir(join(__dirname, "../commands/mention")).then(async files => {
  for (const file of files.filter(file => file.endsWith(".js") && !file.startsWith("_"))) {
    const { default: command } = await import(`../commands/mention/${file}`) as { default: MentionCommand };
    const commandName = file.replace(".js", "").toLowerCase();
    commands.set(commandName, command);
    if (command.aliases) for (const alias of command.aliases) aliases.set(alias, commandName);
  }
}).catch(e => hammerLogger.error(`Failed to load mention commands: ${inspect(e)}`));
