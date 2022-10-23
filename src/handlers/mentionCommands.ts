import type { Client, Message, MessageReplyOptions, PartialMessage, Snowflake } from "discord.js";
import { MessageType, escapeInlineCode } from "discord.js";
import type { MentionCommand } from "../commands/mention";
import config from "../config";
import { fitText } from "../utils/text";
import { inspect } from "util";
import { join } from "path";
import { mainLogger } from "../utils/logger/main";
import { quickResponses } from "../commands/mention";
import { readdir } from "fs/promises";

const replies = new Map<Snowflake, Message>();
const commands = new Map<string, MentionCommand>();
const aliases = new Map<string, string>();

export default function handleMentionCommands(client: Client<true>): void {
  client
    .on("messageCreate", message => void handleMessage(message))
    .on("messageUpdate", async (_, potentialPartialMessage) => {
      const message = potentialPartialMessage.partial ? await potentialPartialMessage.fetch() : potentialPartialMessage;
      void handleMessage(message);
    });

  mainLogger.info("Mention command listener registered.");
}

async function handleMessage(partialMessage: Message | PartialMessage): Promise<void> {
  const message = partialMessage.partial ? await partialMessage.fetch() : partialMessage;
  if (!message.inGuild() || message.author.bot || message.type !== MessageType.Default && message.type !== MessageType.Reply) return;

  if (!RegExp(`^<@!?${partialMessage.client.user.id}>`, "u").exec(message.content)) return;

  const existingReply = replies.get(message.id);
  void handleCommand(message, existingReply);
}

async function handleCommand(message: Message<true>, existingReply?: Message): Promise<Message[]> {
  const args = message.content.split(" ").slice(1);
  const commandOrAlias = (args.shift() ?? "").toLowerCase();

  const quickResponse = quickResponses.find(([triggers]) => triggers.includes(commandOrAlias));
  if (quickResponse) return reply(quickResponse[1], message, existingReply).then(newReply => [message, newReply]);

  const commandName = aliases.get(commandOrAlias) ?? commandOrAlias;
  const command = commands.get(commandName);

  if (!command) return reply(`❓ Command \`${escapeInlineCode(fitText(commandName, 20))}\` not found.`, message, existingReply).then(newReply => [message, newReply]);
  if (command.ownerOnly && message.author.id !== config.ownerId) return reply("⛔ You don't have permission to do this. Only reason I can think of is that you don't have the skill to do this. Sounds like a skill issue honestly.", message, existingReply).then(newReply => [message, newReply]);
  if (!command.testArgs(args)) return reply("❓ Invalid arguments provided.", message, existingReply).then(newReply => [message, newReply]);

  return [message, await command.execute(message, options => reply(options, message, existingReply), args)];
}

async function reply(optionsOrContent: MessageReplyOptions | string, message: Message, existingReply?: Message): Promise<Message> {
  const options: MessageReplyOptions = {
    allowedMentions: { repliedUser: true },
    components: [],
    embeds: [],
    files: [],
    ...typeof optionsOrContent === "string" ? { content: optionsOrContent } : optionsOrContent,
  };
  if (existingReply) return existingReply.edit({ content: null, ...options });
  const newReply = await message.reply(options);
  replies.set(message.id, newReply);
  return newReply;
}

// loading commands
readdir(join(__dirname, "../commands/mention")).then(async files => {
  for (const fileName of files.filter(file => file.includes(".") && !file.startsWith("_") && file !== "index.js")) {
    const { default: command } = await import(`../commands/mention/${fileName}`) as { default: MentionCommand };
    const commandName = fileName.split(".")[0]!.toLowerCase();
    commands.set(commandName, command);
    if (command.aliases) for (const alias of command.aliases) aliases.set(alias, commandName);
  }
})
  .catch(err => mainLogger.error(`Failed to load mention commands: ${inspect(err)}`));
