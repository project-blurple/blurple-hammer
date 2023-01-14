import { ApplicationCommandOptionType } from "discord.js";
import Emojis from "../../constants/emojis";
import type { FirstLevelChatInputCommand } from ".";

export default {
  name: "bean",
  description: "Bean a user",
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user to bean",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "message",
      description: "The message to bean with",
      required: true,
    },
  ],
  execute(interaction) {
    const user = interaction.options.getUser("user", true);
    const message = interaction.options.getString("message", true);
    return void interaction.reply({ content: `${user.toString()}: You have been beaned for ${message} ${Emojis.Sparkle}` });
  },
} as FirstLevelChatInputCommand;
