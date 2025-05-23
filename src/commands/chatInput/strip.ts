import type { FirstLevelChatInputCommand } from ".";
import config from "../../config";
import Emojis from "../../constants/emojis";
import { UserStrip } from "../../database/models/UserStrip";

export default {
  name: "strip",
  description: "Strip yourself (staff-only command)",
  public: true,
  async execute(interaction) {
    const strip = await UserStrip.findOne({ userId: interaction.user.id });
    if (strip) {
      await interaction.member.roles.add(strip.roleIds, "User unstripped");
      await strip.deleteOne();
      return void interaction.reply({ content: `${Emojis.ThumbsUp} You have been unstripped.`, ephemeral: true });
    }

    const isStaff = interaction.member.roles.cache.find(role => role.id === config.roles.staff.all);
    if (!isStaff) return void interaction.reply({ content: `${Emojis.ThumbsDown} You cannot strip yourself.`, ephemeral: true });

    const me = await interaction.guild.members.fetchMe({ force: false, cache: true });
    const roleIds = interaction.member.roles.cache.filter(role => role.id !== interaction.guild.roles.everyone.id && !role.managed && me.roles.highest.position > role.position).map(role => role.id);

    await UserStrip.create({ userId: interaction.user.id, roleIds });
    await interaction.member.roles.remove(roleIds, "User stripped");
    return void interaction.reply({ content: `${Emojis.ThumbsUp} You have been stripped.`, ephemeral: true });
  },
} as FirstLevelChatInputCommand;
