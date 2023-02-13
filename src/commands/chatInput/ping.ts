import { msToHumanShortTime } from "../../utils/time";
import type{ FirstLevelChatInputCommand } from ".";

export default {
  name: "ping",
  description: "Ping the bot",
  public: true,
  async execute(interaction) {
    const now = Date.now();
    await interaction.deferReply();
    return void interaction.editReply(`🏓 Server latency is \`${Date.now() - now}ms\`, shard latency is \`${Math.ceil(interaction.guild.shard.ping)}ms\` and my uptime is \`${msToHumanShortTime(interaction.client.uptime)}\`.`);
  },
} as FirstLevelChatInputCommand;
