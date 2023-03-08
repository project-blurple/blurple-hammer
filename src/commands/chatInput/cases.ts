import type { AnySelectMenuInteraction, ButtonInteraction, ChatInputCommandInteraction, InteractionReplyOptions, InteractionUpdateOptions } from "discord.js";
import { ButtonStyle, ComponentType, Colors } from "discord.js";
import config from "../../config";
import Emojis from "../../constants/emojis";
import { zeppelinCaseTypes } from "../../constants/zeppelinCases";
import { ZeppelinCase } from "../../database/models/ZeppelinCase";
import { buttonComponents, selectMenuComponents } from "../../handlers/interactions/components";
import type { FirstLevelChatInputCommand } from ".";

export default {
  name: "cases",
  description: "View your cases",
  public: true,
  async execute(interaction) {
    return void interaction.reply({ ...await generateMessage(interaction), ephemeral: true });
  },
} satisfies FirstLevelChatInputCommand;

enum Filter { None, IssuedByAutomod, IssuedByHuman }
enum Sort { CreationDateAscending, CreationDateDescending }

const entriesPerPage = 5;

async function generateMessage(interaction: AnySelectMenuInteraction<"cached"> | ButtonInteraction<"cached"> | ChatInputCommandInteraction<"cached">, filter: Filter = Filter.None, sort: Sort = Sort.CreationDateAscending, page = 0): Promise<InteractionReplyOptions & InteractionUpdateOptions> {
  const allUserCases = (await ZeppelinCase.find({ userId: interaction.user.id })).filter(zeppCase => !zeppelinCaseTypes[zeppCase.type].hideForUser);
  const filteredAndSortedCases = allUserCases.filter(zeppCase => {
    switch (filter) {
      case Filter.IssuedByAutomod: return zeppCase.moderatorId === config.bots.zeppelin;
      case Filter.IssuedByHuman: return zeppCase.moderatorId !== config.bots.zeppelin;
      default: return true;
    }
  })
    .sort((a, b) => {
      switch (sort) {
        case Sort.CreationDateAscending: return a.createdAt.getTime() - b.createdAt.getTime();
        case Sort.CreationDateDescending: return b.createdAt.getTime() - a.createdAt.getTime();
        default: return 0;
      }
    });

  const casesPage = filteredAndSortedCases.slice(page * entriesPerPage, (page + 1) * entriesPerPage);

  selectMenuComponents.set(`${interaction.id}:filter`, {
    selectType: "string",
    allowedUsers: [interaction.user.id],
    async callback(select) {
      return void select.update(await generateMessage(interaction, Number(select.values[0] ?? Filter.None) as unknown as Filter, sort, page));
    },
  });

  selectMenuComponents.set(`${interaction.id}:sort`, {
    selectType: "string",
    allowedUsers: [interaction.user.id],
    async callback(select) {
      return void select.update(await generateMessage(interaction, filter, Number(select.values[0] ?? Sort.CreationDateAscending) as unknown as Sort, page));
    },
  });

  buttonComponents.set(`${interaction.id}:go-to-start`, {
    allowedUsers: [interaction.user.id],
    async callback(button) {
      return void button.update(await generateMessage(interaction, filter, sort, 0));
    },
  });

  buttonComponents.set(`${interaction.id}:go-back`, {
    allowedUsers: [interaction.user.id],
    async callback(button) {
      return void button.update(await generateMessage(interaction, filter, sort, page - 1));
    },
  });

  buttonComponents.set(`${interaction.id}:go-forward`, {
    allowedUsers: [interaction.user.id],
    async callback(button) {
      return void button.update(await generateMessage(interaction, filter, sort, page + 1));
    },
  });

  buttonComponents.set(`${interaction.id}:go-to-end`, {
    allowedUsers: [interaction.user.id],
    async callback(button) {
      return void button.update(await generateMessage(interaction, filter, sort, Math.floor(filteredAndSortedCases.length / entriesPerPage)));
    },
  });

  return {
    content: filteredAndSortedCases.length ? `${Emojis.Hammer} Showing page **${page + 1} of ${Math.floor(filteredAndSortedCases.length / entriesPerPage) + 1}** (${filteredAndSortedCases.length} cases total)` : `${Emojis.Hammer} You have a clean record!`,
    embeds: casesPage.map(zeppCase => ({
      color: zeppCase.hidden ? Colors.LightGrey : zeppelinCaseTypes[zeppCase.type].color,
      title: `${zeppelinCaseTypes[zeppCase.type].name} #${zeppCase.caseNumber} ${zeppCase.hidden ? "(hidden)" : ""}`,
      description: zeppCase.notes[0]?.body ?? "*No more information about this case is available.*",
      timestamp: zeppCase.createdAt.toISOString(),
    })),
    components: filteredAndSortedCases.length ?
      [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.StringSelect,
              placeholder: {
                [Sort.CreationDateAscending]: "Sorting by: Creation date (ascending)",
                [Sort.CreationDateDescending]: "Sorting by: Creation date (descending)",
              }[sort],
              customId: `${interaction.id}:sort`,
              minValues: 1,
              maxValues: 1,
              options: [
                { label: "Creation date (ascending)", value: String(Sort.CreationDateAscending) },
                { label: "Creation date (descending)", value: String(Sort.CreationDateDescending) },
              ],
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.StringSelect,
              placeholder: {
                [Filter.None]: "Filtering by: None",
                [Filter.IssuedByAutomod]: "Filtering by: Issued by Automod",
                [Filter.IssuedByHuman]: "Filtering by: Issued by Human",
              }[filter],
              customId: `${interaction.id}:filter`,
              minValues: 1,
              maxValues: 1,
              options: [
                { label: "None", value: String(Filter.None) },
                { label: "Issued by Automod", value: String(Filter.IssuedByAutomod) },
                { label: "Issued by Human", value: String(Filter.IssuedByHuman) },
              ],
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              label: "\u00ab",
              customId: `${interaction.id}:go-to-start`,
              style: ButtonStyle.Primary,
              disabled: page === 0,
            },
            {
              type: ComponentType.Button,
              label: "\u2039",
              customId: `${interaction.id}:go-back`,
              style: ButtonStyle.Primary,
              disabled: page === 0,
            },
            {
              type: ComponentType.Button,
              label: `${page + 1} / ${Math.ceil(filteredAndSortedCases.length / entriesPerPage)}`,
              customId: "disabled",
              style: ButtonStyle.Secondary,
              disabled: true,
            },
            {
              type: ComponentType.Button,
              label: "\u203A",
              customId: `${interaction.id}:go-forward`,
              style: ButtonStyle.Primary,
              disabled: page === Math.ceil(filteredAndSortedCases.length / entriesPerPage) - 1,
            },
            {
              type: ComponentType.Button,
              label: "\u00bb",
              customId: `${interaction.id}:go-to-end`,
              style: ButtonStyle.Primary,
              disabled: page === Math.ceil(filteredAndSortedCases.length / entriesPerPage) - 1,
            },
          ],
        },
      ] :
      [],
  };
}
