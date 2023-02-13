import config from "../../config";
import Emojis from "../../constants/emojis";
import { OAuthTokens } from "../../database/models/OAuthTokens";
import { refreshSubserverAccess } from "../../handlers/serverEnforcements/subserverAccess/refresh";
import oauth from "../../utils/oauth";
import type { FirstLevelChatInputCommand } from ".";

export default {
  name: "auth",
  description: "Authenticate yourself to the staff portal to gain access",
  async execute(interaction) {
    const tokens = await OAuthTokens.findOne({ userId: interaction.user.id });
    if (!tokens) return void interaction.reply({ content: `${Emojis.Sparkle} Authenticate yourself [here](${new URL("/login", config.staffPortal!.url).href}).`, ephemeral: true });

    return void oauth.tokenRequest({
      refreshToken: tokens.refreshToken,
      grantType: "refresh_token",
      scope: ["identify", "guilds.join"],
    })
      .then(({ access_token: accessToken, refresh_token: refreshToken }) => {
        tokens.accessToken = accessToken;
        tokens.refreshToken = refreshToken;
        void tokens.save().then(() => refreshSubserverAccess(interaction.user.id, interaction.client));

        return void interaction.reply({ content: `${Emojis.TickYes} Your authentication works!`, ephemeral: true });
      })
      .catch(() => {
        void tokens.delete();
        return void interaction.reply({ content: `${Emojis.TickNo} Your authentication is no longer working, please authenticate yourself [here](${new URL("/login", config.staffPortal!.url).href}).`, ephemeral: true });
      });
  },
} as FirstLevelChatInputCommand;
