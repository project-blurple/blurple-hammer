import { inspect } from "util";
import { ApplicationCommandOptionType } from "discord.js";
import config from "../../config";
import Emojis from "../../constants/emojis";
import subservers, { SubserverAccess } from "../../constants/subservers";
import { OAuthTokens } from "../../database/models/OAuthTokens";
import { SubserverAccessOverride } from "../../database/models/SubserverAccessOverride";
import { commandMentions } from "../../handlers/interactions";
import calculateAccess from "../../handlers/serverEnforcements/subserverAccess/calculator";
import mainLogger from "../../utils/logger/main";
import oauth from "../../utils/oauth";
import type { FirstLevelChatInputCommand } from ".";

export default {
  name: "forcejoin",
  description: "Force-join someone else in to a subserver",
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user to force-join",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "subserver",
      description: "The subserver to join",
      required: true,
      choices: subservers.map(server => ({
        name: `${server.acronym.split("").join(".")}. (${server.name})`,
        value: server.id,
      })),
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "reason",
      description: "The reason for force-joining the user",
      required: true,
    },
  ],
  async execute(interaction) {
    const user = interaction.options.getUser("user", true);

    const tokens = await OAuthTokens.findOne({ userId: user.id });
    if (!tokens) return void interaction.reply({ content: `${Emojis.TickNo} The user is not authenticated. Make them run ${commandMentions["auth"]!} or [copy this link](${new URL("/login", config.staffPortal!.url).href}) and give it to them if they're not staff.`, ephemeral: true });

    const subserver = subservers.find(server => server.id === interaction.options.getString("subserver", true))!;
    const server = interaction.client.guilds.cache.get(subserver.id)!;

    const { access } = await calculateAccess(interaction.user.id, subserver, interaction.client);
    if (access < SubserverAccess.Allowed) return void interaction.reply({ content: `${Emojis.TickNo} You don't have permission to force-join users in to this subserver.`, ephemeral: true });

    const member = await server.members.fetch(user.id).catch(() => null);
    if (member) return void interaction.reply({ content: `${Emojis.TickNo} They're already in this subserver!`, ephemeral: true });

    return void oauth.tokenRequest({
      refreshToken: tokens.refreshToken,
      grantType: "refresh_token",
      scope: ["identify", "guilds.join"],
    })
      .then(async ({ access_token: accessToken, refresh_token: refreshToken }) => {
        tokens.accessToken = accessToken;
        tokens.refreshToken = refreshToken;
        await tokens.save();

        await SubserverAccessOverride.create({
          userId: user.id,
          subserverId: subserver.id,
          issuerId: interaction.user.id,
          reason: interaction.options.getString("reason", true),
        });

        return void oauth.addMember({
          accessToken,
          guildId: subserver.id,
          userId: user.id,
          botToken: interaction.client.token,
        })
          .then(() => void interaction.reply({ content: `${Emojis.TickYes} Force-joined user ${user.toString()} to the subserver **${subserver.name}**.` }))
          .catch(err => {
            mainLogger.error(`Failed to force-add user ${interaction.user.id} to subserver ${subserver.name}: ${inspect(err)}`);
            return void interaction.reply({ content: `${Emojis.TickNo} An unknown error occurred when trying to force-join them to the subserver.`, ephemeral: true });
          });
      })
      .catch(() => {
        void tokens.delete();
        return void interaction.reply({ content: `${Emojis.TickNo} Their authentication is not working, please have them re-authenticate themselves using ${commandMentions["auth"]!} or [copy this link](${new URL("/login", config.staffPortal!.url).href}) and give it to them if they're not staff.`, ephemeral: true });
      });
  },
} as FirstLevelChatInputCommand;
