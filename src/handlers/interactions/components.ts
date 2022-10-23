import type { Awaitable, ButtonInteraction, SelectMenuInteraction, Snowflake } from "discord.js";
import { mainLogger } from "../../utils/logger/main";

interface SelectMenuComponentDetails {
  type: "SELECT_MENU";
  callback(interaction: SelectMenuInteraction<"cached">): Awaitable<void>;
}

interface ButtonComponentDetails {
  type: "BUTTON";
  callback(interaction: ButtonInteraction<"cached">): Awaitable<void>;
}

type ComponentInteractionDetails = {
  allowedUsers: "all" | [Snowflake, ...Snowflake[]];
} & (ButtonComponentDetails | SelectMenuComponentDetails);

export const components = new Map<string, ComponentInteractionDetails>();

export default function componentHandler(interaction: ButtonInteraction<"cached"> | SelectMenuInteraction<"cached">): void {
  const component = components.get(interaction.customId);
  if (!component) return void mainLogger.info(`Component interaction ${interaction.customId} not found for interaction ${interaction.id}, channel ${interaction.channelId}, guild ${interaction.guildId}`);

  if (component.allowedUsers !== "all" && !component.allowedUsers.includes(interaction.user.id)) return;
  void component.callback(interaction as never);
}
