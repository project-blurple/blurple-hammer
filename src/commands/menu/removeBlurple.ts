import type { ButtonComponentData, GuildMember, InteractionReplyOptions, InteractionUpdateOptions } from "discord.js";
import Emojis from "../../constants/emojis";
import type { MenuCommand } from ".";
import config from "../../config";

export default {
  name: "Remove Blurple User",
  type: "user",
  execute(interaction, target) {

	if (target.roles.cache.has(config.blurpleUser)) {
		void target.roles.remove(config.blurpleUser);
		return void interaction.reply({ content: `${config.TickYes} ${target.user.tag} no longer has the Blurple User role.`, ephemeral: true });
	} else {
		return void interaction.reply({ content: `${config.TickNo} ${target.user.tag} does not have the Blurple User role.`, ephemeral: true });
	}
  },
} as MenuCommand;