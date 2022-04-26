import Emojis from "../../constants/emojis";
import type { Module } from "..";
import { OAuthTokensDatabase } from "../../database";
import { app } from "../../utils/express";
import { checkMemberAccess } from "./access";
import config from "../../config";
import { hammerLogger } from "../../utils/logger/hammer";
import { oauth } from "../../utils/oauth";

export const scope = ["identify", "guilds.join"];

const authorizeLink = oauth.generateAuthUrl({
  prompt: "none",
  scope,
});

export default (client => {
  app.get(`${config.web?.portal?.path}`, async (req, res) => {
    const code = `${req.query.code || ""}`;
    if (!code) return res.redirect(authorizeLink);

    const { access_token: accessToken, refresh_token: refreshToken } = await oauth.tokenRequest({
      code,
      scope,
      grantType: "authorization_code",
      redirectUri: `${config.web?.portal?.link}`,
    }).catch(() => {
      hammerLogger.warn(`Failed to get access token and refresh token from code ${code}. User is unknown.`);
      return {} as never;
    });

    if (!accessToken || !refreshToken) return res.redirect(authorizeLink);

    const { id } = await oauth.getUser(accessToken);
    OAuthTokensDatabase.findOne({ userId: id }).then(async oAuthTokens => {
      if (oAuthTokens) {
        oAuthTokens.accessToken = accessToken;
        oAuthTokens.refreshToken = refreshToken;
        await oAuthTokens.save();
      } else {
        await OAuthTokensDatabase.create({ userId: id, accessToken, refreshToken });
      }
    });

    res.redirect("https://discord.com/oauth2/authorized");

    const user = await client.users.fetch(id);
    user.send(`${Emojis.TADA} Your OAuth2 has successfully been linked.`);
    checkMemberAccess(user);
  });
}) as Module;
