import config from "../../config";
import Emojis from "../../constants/emojis";
import type { MenuCommand } from ".";

export default {
  name: "Remove Blurple User",
  type: "user",
  execute(interaction, target) {

    if (target.roles.cache.has(config.roles.blurpleUser)) {
      void target.roles.remove(config.roles.blurpleUser);
      return void interaction.reply({ content: `${Emojis.TickYes} ${target.user.tag} no longer has the Blurple User role.`, ephemeral: true });
    }
    return void interaction.reply({ content: `${Emojis.TickNo} ${target.user.tag} does not have the Blurple User role.`, ephemeral: true });

  },
} as MenuCommand;
