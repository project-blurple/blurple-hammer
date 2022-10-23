import type { ActionRowData, Awaitable, ModalSubmitInteraction, TextInputComponentData, TextInputModalData } from "discord.js";
import { ComponentType } from "discord.js";
import { mainLogger } from "../../utils/logger/main";

interface ModalInteractionDetails {
  callback(interaction: ModalSubmitInteraction<"cached">): Awaitable<void>;
}

export const modals = new Map<string, ModalInteractionDetails>();

export default function modalHandler(interaction: ModalSubmitInteraction<"cached">): void {
  const modal = modals.get(interaction.customId);
  if (!modal) return void mainLogger.debug(`Modal interaction ${interaction.customId} not found for interaction ${interaction.id}, channel ${interaction.channelId ?? "null"}, guild ${interaction.guildId}`);

  void modal.callback(interaction);
}

export function getModalTextInput(actionRows: ModalSubmitInteraction["components"], customId: string): string | null {
  const actionRow = actionRows.find(row => row.components.some(component => component.type === ComponentType.TextInput && component.customId === customId));
  if (!actionRow) return null;

  const textInput = actionRow.components.find(component => component.type === ComponentType.TextInput && component.customId === customId);
  if (!textInput) return null;

  return (textInput as TextInputModalData).value;
}

export function createModalTextInput(options: Omit<TextInputComponentData, "type">): ActionRowData<TextInputComponentData> {
  return {
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.TextInput,
        ...options,
      },
    ],
  };
}
