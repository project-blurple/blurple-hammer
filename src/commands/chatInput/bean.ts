import { ApplicationCommandOptionType } from "discord.js";
import type { ChatInputCommand } from ".";
import Emojis from "../../constants/emojis";

const command: ChatInputCommand = {
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
};

export default { ...command } as ChatInputCommand;
