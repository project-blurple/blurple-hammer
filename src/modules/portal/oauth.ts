import Emojis from "../../constants/emojis";
import type { Module } from "..";
import { app } from "../../utils/express";
import { checkMemberAccess } from "./access";
import config from "../../config";
import { hammerLogger } from "../../utils/logger/hammer";
import { oauth } from "../../utils/oauth";
import { oauthTokens } from "../../database";

const authorizeLink = oauth.generateAuthUrl({
  prompt: "none",
  scope: ["identify", "guilds.join"],
});

export default (client => {
  app.get(`${config.web?.portal?.path}`, async (req, res) => {
    const code = `${req.query.code || ""}`;
    if (!code) return res.redirect(authorizeLink);

    const { access_token: accessToken, refresh_token: refreshToken } = await oauth.tokenRequest({
      code,
      scope: ["identify", "guilds.join"],
      grantType: "authorization_code",
      redirectUri: `${config.web?.portal?.link}`,
    }).catch(() => {
      hammerLogger.warn(`Failed to get access token and refresh token from code ${code}. User is unknown.`);
      return {} as never;
    });

    if (!accessToken || !refreshToken) return res.redirect(authorizeLink);

    const { id } = await oauth.getUser(accessToken);
    oauthTokens.set(id, { accessToken, refreshToken });

    res.redirect("https://discord.com/oauth2/authorized");

    const user = await client.users.fetch(id);
    user.send(`${Emojis.TADA} Your OAuth2 has successfully been linked.`);
    checkMemberAccess(user);
  });
}) as Module;
