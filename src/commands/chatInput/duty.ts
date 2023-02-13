import config from "../../config";
import Emojis from "../../constants/emojis";
import type { FirstLevelChatInputCommand } from ".";

export default {
  name: "duty",
  description: "Toggle the duty role",
  async execute(interaction) {
    const role = interaction.guild.roles.cache.get(config.roles.staffOnDuty)!;
    if (interaction.member.roles.cache.has(role.id)) {
      await interaction.member.roles.remove(role, "User toggled duty role");
      return void interaction.reply({ content: `${Emojis.TickYes} You no longer have the duty role.`, ephemeral: true });
    }

    await interaction.member.roles.add(role, "User toggled duty role");
    return void interaction.reply({ content: `${Emojis.TickYes} You now have the duty role.`, ephemeral: true });
  },
} as FirstLevelChatInputCommand;
