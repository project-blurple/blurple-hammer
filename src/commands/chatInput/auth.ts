import Emojis from "../../constants/emojis";
import type { FirstLevelChatInputCommand } from ".";
import { OAuthTokens } from "../../database/models/OAuthTokens";
import config from "../../config";
import oauth from "../../utils/oauth";
import refreshSubserverAccess from "../../handlers/serverEnforcements/subservers/access/refresh";

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
