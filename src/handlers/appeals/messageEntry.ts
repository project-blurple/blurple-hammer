import type { Client, InteractionUpdateOptions, MessageCreateOptions } from "discord.js";
import { Colors, ComponentType, time, ButtonStyle } from "discord.js";
import type { AppealDocument } from "../../database/models/Appeal";
import { fitText } from "../../utils/text";
import registerAppealButtons from "./buttons";
import finalResolutionColors from "./finalResolutionColors";

export default function generateAppealMessage(appeal: AppealDocument, client: Client<true>): InteractionUpdateOptions & MessageCreateOptions {
  registerAppealButtons(appeal, client);

  let color: number = Colors.White;
  if (appeal.staffAssigneeId) color = Colors.LightGrey;
  if (appeal.finalResolution) color = finalResolutionColors[appeal.finalResolution.action];

  return {
    ...appeal.staffAssigneeId && { content: `*Assigned to <@${appeal.staffAssigneeId}>.*` },
    ...appeal.finalResolution && { content: `Resolved by <@${appeal.finalResolution.staffId}> ${time(appeal.finalResolution.timestamp, "R")} with action **${appeal.finalResolution.action.toUpperCase()}**.` },
    allowedMentions: { users: appeal.staffAssigneeId && !appeal.finalResolution ? [appeal.staffAssigneeId] : []},
    embeds: [
      {
        author: {
          name: `${appeal.user.tag} (${appeal.user.id})`,
          // eslint-disable-next-line camelcase
          icon_url: appeal.user.avatarUrl,
        },
        title: `Appeal #${appeal.appealId} - ${appeal.type.toUpperCase()} ${appeal.caseId ? `- Case #${appeal.caseId}` : ""}`,
        color,
        fields: [
          { name: "User Statement", value: `${fitText(appeal.userStatement, 1024)}\n` },
          { name: "Why should we appeal your punishment?", value: `${fitText(appeal.userReason, 1024)}\n` },
          { name: "Appeal log", value: ((appeal.logs as typeof appeal["logs"] | undefined) ?? []).map(logEntry => `• ${time(logEntry.timestamp, "R")}: ${logEntry.message}`).join("\n") || "*No logs yet.*" },
          ...appeal.finalResolution ? [{ name: "Final resolution", value: `<@${appeal.finalResolution.staffId}> resolved this ${time(appeal.finalResolution.timestamp, "R")} with action **${appeal.finalResolution.action.toUpperCase()}**.\n>>> ${appeal.finalResolution.reason}` }] : [],
        ],
      },
    ],
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          ...appeal.finalResolution ?
            [
              {
                type: ComponentType.Button,
                customId: `appeal-${appeal.appealId}:viewFinalResolution`,
                style: ButtonStyle.Secondary as never,
                label: "View final resolution",
              },
            ] :
            [
              appeal.staffAssigneeId ?
                {
                  type: ComponentType.Button,
                  customId: `appeal-${appeal.appealId}:unassign`,
                  style: ButtonStyle.Secondary as never,
                  label: "Unassign",
                } :
                {
                  type: ComponentType.Button,
                  customId: `appeal-${appeal.appealId}:assign`,
                  style: ButtonStyle.Primary as never,
                  label: "Assign to me",
                },
              {
                type: ComponentType.Button,
                customId: `appeal-${appeal.appealId}:createFinalResolution`,
                style: ButtonStyle.Success as never,
                label: "Create a final resolution",
              },
            ],
          {
            type: ComponentType.Button,
            customId: `appeal-${appeal.appealId}:refresh`,
            style: ButtonStyle.Secondary,
            label: "Refresh",
          },
        ],
      },
      // if the statement or reason is longer than 1024 characters, add a button to view the full text
      ...Math.max(appeal.userStatement.length, appeal.userReason.length) > 1024 ?
        [
          {
            type: ComponentType.ActionRow,
            components: [
              ...appeal.userStatement.length > 1024 ?
                [
                  {
                    type: ComponentType.Button,
                    customId: `appeal-${appeal.appealId}:viewFullStatement`,
                    style: ButtonStyle.Secondary as never,
                    label: "View full statement",
                  },
                ] :
                [],
              ...appeal.userReason.length > 1024 ?
                [
                  {
                    type: ComponentType.Button,
                    customId: `appeal-${appeal.appealId}:viewFullReason`,
                    style: ButtonStyle.Secondary as never,
                    label: "View full reason",
                  },
                ] :
                [],
            ],
          },
        ] :
        [],
    ],
  };
}
