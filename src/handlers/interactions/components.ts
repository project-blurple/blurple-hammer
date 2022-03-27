import type { ButtonInteraction, MessageComponentInteraction, SelectMenuInteraction, Snowflake } from "discord.js";

interface ButtonComponent {
  type: "BUTTON";
  callback: (interaction: ButtonInteraction) => void;
}

interface SelectMenuComponent {
  type: "SELECT_MENU";
  callback: (interaction: SelectMenuInteraction) => void;
}

type Component = (ButtonComponent | SelectMenuComponent) & {
  allowedUsers: Array<Snowflake> | "all";
}

export const components = new Map<string, Component>();

export default (interaction: MessageComponentInteraction) => {
  const component = components.get(interaction.customId);
  if (component) {
    if (component.allowedUsers !== "all" && !component.allowedUsers.includes(interaction.user.id)) return;

    if (component.type === "BUTTON" && interaction.isButton()) component.callback(interaction);
    if (component.type === "SELECT_MENU" && interaction.isSelectMenu()) component.callback(interaction);
  }
};
