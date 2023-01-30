import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import type { ForumChannel, Snowflake, StageChannel, TextChannel, VoiceChannel } from "discord.js";
import Emojis from "../../../constants/emojis";
import type { SecondLevelChatInputCommand } from "..";
import config from "../../../config";
import { inspect } from "util";

export default {
  name: "unlock",
  description: "Unlock a channel",
  options: [
    {
      type: ApplicationCommandOptionType.Channel,
      name: "channel",
      description: "The channel to unlock",
      channelTypes: [
        ChannelType.GuildForum,
        ChannelType.GuildStageVoice,
        ChannelType.GuildText,
        ChannelType.GuildVoice,
      ],
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "channel_group",
      description: "The channel group to unlock",
      choices: [
        { name: "All public channels", value: "public" },
        { name: "Blurplefier channels", value: "blurplefier" },
      ],
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "reason",
      description: "The reason for unlocking the channel",
    },
  ],
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const channels: Snowflake[] = [];

    const singularChannel = interaction.options.getChannel("channel");
    if (singularChannel) channels.push(singularChannel.id);

    const channelGroup = interaction.options.getString("channel_group") as "blurplefier" | "public" | undefined;
    if (channelGroup === "blurplefier") channels.push(...config.channels.blurplefierChannels);
    if (channelGroup === "public") channels.push(...config.channels.publicChannels);

    const reason = interaction.options.getString("reason");

    const success: Snowflake[] = [];
    const errors: string[] = [];
    const interval = setInterval(() => {
      void interaction.editReply({
        content: [
          `${Emojis.Loading} Unlocking channels... (${success.length + errors.length}/${channels.length})`,
          `Unlocked: ${success.map(channelId => `<#${channelId}>`).join(", ")} | In queue: ${channels.slice(success.length + errors.length).map(channelId => `<#${channelId}>`)
            .join(", ")}`,
          errors.length && `Failed to unlock channels:\n${errors.map(error => `• ${error}`).join("\n")}`,
        ].filter(Boolean).join("\n"),
      });
    }, 1000);

    for (const channelId of channels) {
      const channel = interaction.guild.channels.cache.get(channelId);
      if (channel) {
        const result = await unlockChannel(channel as never, reason);
        if (typeof result === "string") errors.push(`Failed to unlock channel <#${channelId}>: ${result}`);
        else success.push(channelId);
      } else errors.push(`Channel ${channelId} not found.`);
    }

    clearInterval(interval);
    return void interaction.editReply({
      content: [
        `${Emojis.ThumbsUp} Channels are now unlocked: ${success.map(channelId => `<#${channelId}>`).join(", ") || "*None.*"}`,
        errors.length && errors.map(error => `• ${error}`).join("\n"),
      ].filter(Boolean).join("\n"),
    });
  },
} as SecondLevelChatInputCommand;

function unlockChannel(channel: ForumChannel | StageChannel | TextChannel | VoiceChannel, reason: string | null): Promise<string | true> {
  if (channel.permissionOverwrites.cache.find(overwrite => overwrite.id === channel.guild.roles.everyone.id)?.deny.has("SendMessages") === false) return Promise.resolve("Channel is already unlocked.");
  return channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: null, SendMessagesInThreads: null, CreatePublicThreads: null, CreatePrivateThreads: null, AddReactions: null })
    .then(async () => {
      if ("send" in channel) await channel.send(`${Emojis.WeeWoo} ***This channel is now unlocked.*** ${reason ? `\n>>> *${reason}*` : ""}`);
      return true as const;
    })
    .catch(err => inspect(err).split("\n")[0]!.trim());
}
