import type { AppealAction, AppealDocument } from "../../database/models/Appeal";
import type { Client, TextChannel } from "discord.js";
import { ComponentType, TextInputStyle, time } from "discord.js";
import { buttonComponents, selectMenuComponents } from "../interactions/components";
import { createModalTextInput, getModalTextInput, modals } from "../interactions/modals";
import { Appeal } from "../../database/models/Appeal";
import Emojis from "../../constants/emojis";
import addLogToAppeal from "./logging";
import { appealEmailActionTemplates } from "./emails";
import config from "../../config";
import { finalResolutionColors } from "./finalResolutionColors";
import { fitText } from "../../utils/text";
import generateAppealMessage from "./messageEntry";
import { sendMail } from "../../utils/mail";

export default function registerAppealButtons(appeal: AppealDocument, client: Client<true>): void {
  // remove all appeal buttons
  const allButtons = Array.from(buttonComponents.keys());
  const appealButtons = allButtons.filter(buttonIdentifier => buttonIdentifier.startsWith(`appeal-${appeal.appealId}:`));
  appealButtons.forEach(buttonIdentifier => {
    buttonComponents.delete(buttonIdentifier);
  });

  // add new buttons
  buttonComponents.set(`appeal-${appeal.appealId}:refresh`, {
    allowedUsers: "all",
    async callback(button) {
      const appealNow = await Appeal.findOne({ appealId: appeal.appealId });
      if (!appealNow) return;

      void button.update(generateAppealMessage(appealNow, client));
    },
  });

  if (appeal.finalResolution) {
    buttonComponents.set(`appeal-${appeal.appealId}:viewFinalResolution`, {
      allowedUsers: "all",
      async callback(button) {
        const appealNow = await Appeal.findOne({ appealId: appeal.appealId });
        if (!appealNow) return;

        void button.reply({
          embeds: [
            {
              title: `Final Resolution for Appeal #${appealNow.appealId}`,
              description: `<@${appealNow.finalResolution!.staffId}> resolved this ${time(appealNow.finalResolution!.timestamp, "R")} with action **${appealNow.finalResolution!.action.toUpperCase()}**.`,
              fields: [
                { name: "Reason for the action (staff only)", value: fitText(appealNow.finalResolution!.reason, 1024) },
                { name: "Public statement (sent to user via email)", value: fitText(appealNow.finalResolution!.statement ?? "*No public statement was made and no email was sent to the user.*", 1024) },
              ],
              color: finalResolutionColors[appeal.finalResolution!.action],
            },
          ],
          ephemeral: true,
        });
      },
    });
  } else {
    if (appeal.staffAssigneeId) {
      buttonComponents.set(`appeal-${appeal.appealId}:unassign`, {
        allowedUsers: "all",
        async callback(button) {
          const appealNow = await Appeal.findOne({ appealId: appeal.appealId });
          if (!appealNow) return;

          addLogToAppeal(appealNow, `<@${button.user.id}> unassigned ${button.user.id === appealNow.staffAssigneeId ? "self" : `<@${appealNow.staffAssigneeId!}>`}.`, client, false);
          appealNow.staffAssigneeId = null;
          await appealNow.save();

          void button.update(generateAppealMessage(appealNow, client));
        },
      });
    } else {
      buttonComponents.set(`appeal-${appeal.appealId}:assign`, {
        allowedUsers: "all",
        async callback(button) {
          const appealNow = await Appeal.findOne({ appealId: appeal.appealId });
          if (!appealNow) return;

          addLogToAppeal(appealNow, `<@${button.user.id}> assigned to self.`, client, false);
          appealNow.staffAssigneeId = button.user.id;
          await appealNow.save();

          // add the user to the thread
          const appealChannel = button.client.channels.cache.get(config.channels.appeals) as TextChannel;
          const appealMessage = await appealChannel.messages.fetch(appeal.messageId).catch(() => null);
          void appealMessage?.thread?.members.add(button.user, "User assigned appeal");

          void button.update(generateAppealMessage(appealNow, client));
        },
      });
    }

    buttonComponents.set(`appeal-${appeal.appealId}:createFinalResolution`, {
      allowedUsers: "all",
      async callback(button) {
        const appealNow = await Appeal.findOne({ appealId: appeal.appealId });
        if (!appealNow) return;
        if (appealNow.staffAssigneeId !== button.user.id) return void button.reply({ content: `${Emojis.TickNo} You are not assigned to this appeal.`, ephemeral: true });

        return void button.reply({
          content: `${Emojis.Hammer} Pick an appropriate action below:`,
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.StringSelect,
                  placeholder: "Select an action",
                  customId: `appeal-${appeal.appealId}:createFinalResolution:selectAction`,
                  minValues: 1,
                  maxValues: 1,
                  options: [
                    { label: "Removal (completely remove punishment)", value: "removal" },
                    { label: "Reduction (reduce the current punishment)", value: "reduction" },
                    { label: "None (no action will be done)", value: "none" },
                    { label: "Invalid (appeal is invalid; no action will be done)", value: "invalid" },
                    { label: "Blocked (user will not be able to appeal for 90 days)", value: "blocked" },
                  ],
                },
              ],
            },
          ],
          ephemeral: true,
        });
      },
    });

    selectMenuComponents.set(`appeal-${appeal.appealId}:createFinalResolution:selectAction`, {
      selectType: "string",
      allowedUsers: "all",
      async callback(select) {
        const appealNow = await Appeal.findOne({ appealId: appeal.appealId });
        if (!appealNow) return;
        if (appealNow.staffAssigneeId !== select.user.id) return void select.reply({ content: `${Emojis.TickNo} You are not assigned to this appeal.`, ephemeral: true });

        const action = select.values[0] as AppealAction;
        return void select.showModal({
          title: "Create a Final Resolution",
          customId: `appeal-${appeal.appealId}:createFinalResolution:submitModal`,
          components: [
            createModalTextInput({
              customId: "action",
              style: TextInputStyle.Short,
              label: "Action (Do not change this)",
              minLength: action.length,
              maxLength: action.length,
              value: action,
              placeholder: `${action} (Do not change this!)`,
              required: true,
            }),
            createModalTextInput({
              customId: "reason",
              style: TextInputStyle.Paragraph,
              label: "Reason for the action (staff only)",
              placeholder: "This will only be shown to the staff members who can see the appeal. The appealer will not see this.",
              required: true,
            }),
            createModalTextInput({
              customId: "statement",
              style: TextInputStyle.Paragraph,
              label: "Public statement (sent to user via email)",
              value: appealEmailActionTemplates[action](appeal),
              placeholder: "Leave this empty if you don't want to send an email to the user.",
              required: false,
            }),
          ],
        });
      },
    });

    modals.set(`appeal-${appeal.appealId}:createFinalResolution:submitModal`, async modal => {
      const appealNow = await Appeal.findOne({ appealId: appeal.appealId });
      if (!appealNow) return;
      if (appealNow.staffAssigneeId !== modal.user.id) return void modal.reply({ content: `${Emojis.TickNo} You are not assigned to this appeal.`, ephemeral: true });

      const action = getModalTextInput(modal.components, "action") as AppealAction;
      const reason = getModalTextInput(modal.components, "reason")!;
      const statement = getModalTextInput(modal.components, "statement");

      appealNow.finalResolution = {
        staffId: modal.user.id,
        timestamp: new Date(),
        action,
        reason,
        statement: statement?.length ? statement : null,
      };
      addLogToAppeal(appealNow, `<@${modal.user.id}> resolved with action ${appealNow.finalResolution.action.toUpperCase()}.`, modal.client);
      void appealNow.save();

      if (statement) {
        void sendMail(
          [appealNow.user.tag, appealNow.user.email],
          `Appeal #${appealNow.appealId} has been resolved`,
          statement,
        );
      }

      return void modal.reply({ content: `${Emojis.TickYes} Final resolution has been created.`, components: [], ephemeral: true });
    });
  }

  if (appeal.userStatement.length > 1024) {
    buttonComponents.set(`appeal-${appeal.appealId}:viewFullStatement`, {
      allowedUsers: "all",
      async callback(button) {
        const appealNow = await Appeal.findOne({ appealId: appeal.appealId });
        if (!appealNow) return;

        return void button.reply({
          embeds: [
            {
              author: {
                name: `${appeal.user.tag} (${appeal.user.id})`,
                // eslint-disable-next-line camelcase
                icon_url: appeal.user.avatarUrl,
              },
              title: `Appeal #${appealNow.appealId} - User Statement`,
              description: appealNow.userStatement,
            },
          ],
          ephemeral: true,
        });
      },
    });
  }

  if (appeal.userReason.length > 1024) {
    buttonComponents.set(`appeal-${appeal.appealId}:viewFullReason`, {
      allowedUsers: "all",
      async callback(button) {
        const appealNow = await Appeal.findOne({ appealId: appeal.appealId });
        if (!appealNow) return;

        return void button.reply({
          embeds: [
            {
              author: {
                name: `${appeal.user.tag} (${appeal.user.id})`,
                // eslint-disable-next-line camelcase
                icon_url: appeal.user.avatarUrl,
              },
              title: `Appeal #${appealNow.appealId} - Why should we appeal your punishment?`,
              description: appealNow.userReason,
            },
          ],
          ephemeral: true,
        });
      },
    });
  }
}
