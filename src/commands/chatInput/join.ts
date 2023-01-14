import subservers, { Access } from "../../constants/subservers";
import { ApplicationCommandOptionType } from "discord.js";
import Emojis from "../../constants/emojis";
import type { FirstLevelChatInputCommand } from ".";
import { OAuthTokens } from "../../database/models/OAuthTokens.model";
import calculateAccess from "../../handlers/serverEnforcements/subservers/access/calculator";
import { commandMentions } from "../../handlers/interactions";
import { inspect } from "util";
import { mainLogger } from "../../utils/logger/main";
import oauth from "../../utils/oauth";

export default {
  name: "join",
  description: "Join a subserver",
  options: [
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
  ],
  async execute(interaction) {
    const tokens = await OAuthTokens.findOne({ userId: interaction.user.id });
    if (!tokens) return void interaction.reply({ content: `${Emojis.TickNo} You're not authenticated. Run ${commandMentions["auth"]!}.`, ephemeral: true });

    const subserver = subservers.find(server => server.id === interaction.options.getString("subserver", true))!;
    const server = interaction.client.guilds.cache.get(subserver.id)!;

    const member = await server.members.fetch(interaction.user.id).catch(() => null);
    if (member) return void interaction.reply({ content: `${Emojis.TickNo} You're already in this subserver!`, ephemeral: true });

    return void oauth.tokenRequest({
      refreshToken: tokens.refreshToken,
      grantType: "refresh_token",
      scope: ["identify", "guilds.join"],
    })
      .then(async ({ access_token: accessToken, refresh_token: refreshToken }) => {
        tokens.accessToken = accessToken;
        tokens.refreshToken = refreshToken;
        await tokens.save();

        const { access, applicableRoles: roles } = await calculateAccess(interaction.user.id, subserver, interaction.client);

        if (access < Access.Allowed) return void interaction.reply({ content: `${Emojis.TickNo} You don't have access to this subserver.`, ephemeral: true });

        return void oauth.addMember({
          accessToken,
          guildId: subserver.id,
          userId: interaction.user.id,
          botToken: interaction.client.token,
          roles,
        })
          .then(() => void interaction.reply({ content: `${Emojis.TickYes} Added you to the subserver **${subserver.name}**.` }))
          .catch(err => {
            mainLogger.error(`Failed to add user ${interaction.user.id} to subserver ${subserver.name}: ${inspect(err)}`);
            return void interaction.reply({ content: `${Emojis.TickNo} An unknown error occurred when trying to add you to the subserver.`, ephemeral: true });
          });
      })
      .catch(() => {
        void tokens.delete();
        return void interaction.reply({ content: `${Emojis.TickNo} Your authentication is not working, please re-authenticate yourself using ${commandMentions["auth"]!}`, ephemeral: true });
      });
  },
} as FirstLevelChatInputCommand;
