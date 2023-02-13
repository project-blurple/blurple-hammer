import type{ Client, Message, MessageReplyOptions, Snowflake } from "discord.js";
import { MessageType, escapeInlineCode } from "discord.js";
import { allMentionCommands, quickResponses } from "../commands/mention";
import config from "../config";
import mainLogger from "../utils/logger/main";
import { fitText } from "../utils/text";

const replies = new Map<Snowflake, Message>();

export default function handleMentionCommands(client: Client<true>): void {
  client
    .on("messageCreate", message => handleMessage(message))
    .on("messageUpdate", async (_, potentialPartialMessage) => {
      if (replies.has(potentialPartialMessage.id)) handleMessage(potentialPartialMessage.partial ? await potentialPartialMessage.fetch() : potentialPartialMessage);
    });

  mainLogger.info("Mention command listener registered.");
}

function handleMessage(message: Message): void {
  if (
    !message.inGuild() ||
    message.author.bot ||
    message.type !== MessageType.Default && message.type !== MessageType.Reply ||
    !RegExp(`^<@!?${message.client.user.id}>`, "u").exec(message.content)
  ) return;

  const existingReply = replies.get(message.id);
  const args = message.content.split(" ").slice(1);
  const trigger = (args.shift() ?? "").toLowerCase();

  const quickResponse = quickResponses.find(([triggers]) => triggers.includes(trigger));
  if (quickResponse) return void reply(quickResponse[1], message, existingReply);

  const command = allMentionCommands.find(({ names }) => names.includes(trigger));
  if (!command) return void reply(`❓ Command \`${escapeInlineCode(fitText(trigger, 20))}\` not found.`, message, existingReply);
  if (command.ownerOnly && message.author.id !== config.ownerId) return void reply("⛔ You don't have permission to do this.", message, existingReply);
  if (!command.testArgs(args)) return void reply("❓ Invalid arguments provided.", message, existingReply);

  return void command.execute(message, options => reply(options, message, existingReply), args);
}

async function reply(content: MessageReplyOptions | string, message: Message, existingReply?: Message): Promise<Message> {
  const options: MessageReplyOptions = {
    allowedMentions: { repliedUser: true },
    components: [],
    embeds: [],
    files: [],
    ...typeof content === "string" ? { content } : content,
  };

  if (existingReply) return existingReply.edit({ content: null, ...options });

  const newReply = await message.reply(options);
  replies.set(message.id, newReply);
  return newReply;
}
