import type { ForumChannel, Snowflake, StageChannel, TextChannel, VoiceChannel } from "discord.js";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { inspect } from "util";
import type { SecondLevelChatInputCommand } from "..";
import config from "../../../config";
import Emojis from "../../../constants/emojis";

export default {
  name: "lock",
  description: "Lock a channel",
  options: [
    {
      type: ApplicationCommandOptionType.Channel,
      name: "channel",
      description: "The channel to lock",
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
      description: "The channel group to lock",
      choices: [
        { name: "All public channels", value: "public" },
        { name: "Blurplefier channels", value: "blurplefier" },
      ],
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "reason",
      description: "The reason for locking the channel",
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
          `${Emojis.Loading} Locking channels... (${success.length + errors.length}/${channels.length})`,
          `Locked: ${success.map(channelId => `<#${channelId}>`).join(", ")} | In queue: ${channels.slice(success.length + errors.length).map(channelId => `<#${channelId}>`)
            .join(", ")}`,
          errors.length && `Failed to lock channels:\n${errors.map(error => `• ${error}`).join("\n")}`,
        ].filter(Boolean).join("\n"),
      });
    }, 1000);

    for (const channelId of channels) {
      const channel = interaction.guild.channels.cache.get(channelId);
      if (channel) {
        const result = await lockChannel(channel as never, reason);
        if (typeof result === "string") errors.push(`Failed to lock channel <#${channelId}>: ${result}`);
        else success.push(channelId);
      } else errors.push(`Channel ${channelId} not found.`);
    }

    clearInterval(interval);
    return void interaction.editReply({
      content: [
        `${Emojis.ThumbsUp} Channels are now locked: ${success.map(channelId => `<#${channelId}>`).join(", ") || "*None.*"}`,
        errors.length && errors.map(error => `• ${error}`).join("\n"),
      ].filter(Boolean).join("\n"),
    });
  },
} as SecondLevelChatInputCommand;

function lockChannel(channel: ForumChannel | StageChannel | TextChannel | VoiceChannel, reason: null | string): Promise<string | true> {
  if (channel.permissionOverwrites.cache.find(overwrite => overwrite.id === channel.guild.roles.everyone.id)?.deny.has("SendMessages")) return Promise.resolve("Channel is already locked.");
  return channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: false, SendMessagesInThreads: false, CreatePublicThreads: false, CreatePrivateThreads: false, AddReactions: false })
    .then(async () => {
      if ("send" in channel) await channel.send(`${Emojis.WeeWoo} ***This channel is now locked.*** ${reason ? `\n>>> *${reason}*` : ""}`);
      return true as const;
    })
    .catch((err: unknown) => inspect(err).split("\n")[0]!.trim());
}
