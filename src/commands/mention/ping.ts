import type{ MentionCommand } from ".";
import { msToHumanShortTime } from "../../utils/time";

export default {
  names: ["ping", "pong", ""],
  testArgs(args) { return args.length === 0; },
  async execute(message, reply) {
    const now = Date.now();
    const botMessage = await reply("〽️ Pinging...");
    return void botMessage.edit(`🏓 Server latency is \`${Date.now() - now}ms\`, shard latency is \`${Math.ceil(message.guild.shard.ping)}ms\` and my uptime is \`${msToHumanShortTime(message.client.uptime)}\`.`);
  },
} as MentionCommand;
