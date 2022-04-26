import Emojis from "../../constants/emojis";
import { OAuthTokensDatabase } from "../../database";
import type { SlashCommand } from ".";
import { checkMemberAccess } from "../../modules/portal/access";
import config from "../../config";
import { oauth } from "../../utils/oauth";
import { scope } from "../../modules/portal/oauth";

const command: SlashCommand = {
  description: "Check if your staff authentication is set up correctly",
  async execute(interaction) {
    const tokens = await OAuthTokensDatabase.findOne({ userId: interaction.user.id });

    if (!tokens) {
      return interaction.reply({
        content: `${Emojis.TICKNO} Your authentication is not set up, click [here](${config.web?.portal?.link}) to authenticate.`,
        ephemeral: true,
      });
    }

    oauth.tokenRequest({
      refreshToken: tokens.refreshToken,
      grantType: "refresh_token",
      scope,
    }).then(async ({ access_token: accessToken, refresh_token: refreshToken }) => {
      tokens.accessToken = accessToken;
      tokens.refreshToken = refreshToken;
      await tokens.save();
      interaction.reply({
        content: `${Emojis.THUMBSUP} Your authentication is working. Join subservers with \`/join\``,
        ephemeral: true,
      });
      checkMemberAccess(interaction.user);
    }).catch(() => interaction.reply({
      content: `${Emojis.WEEWOO} Your authentication is not working, click [here](${config.web?.portal?.link}) to re-authenticate.`,
      ephemeral: true,
    }));
  },
};

export default command;
