import type { Client, Snowflake } from "discord.js";
import { createExpressApp, webFolderPath } from ".";
import { decode, sign, verify } from "../../utils/webtokens";
import { OAuthTokens } from "../../database/models/OAuthTokens";
import { allStaffRoles } from "../../constants/staff";
import config from "../../config";
import express from "express";
import { join } from "path";
import oauth from "../../utils/oauth";
import { refreshSubserverAccess } from "../serverEnforcements/subservers/access/refresh";

export default function handleWebStaffPortal(client: Client<true>, webConfig: Exclude<typeof config["staffPortal"], null>): void {
  const [app, listen] = createExpressApp("staff-portal", webConfig.numberOfProxies);

  const redirectUri = new URL("/oauth-callback", webConfig.url).href;
  const authorizationLink = (state?: string) => oauth.generateAuthUrl({
    prompt: "none",
    redirectUri,
    scope: ["identify", "guilds.join"],
    ...state && { state },
  });

  // create token
  app.get("/oauth-callback", (req, res) => {
    const code = String(req.query["code"]);
    const state = String(req.query["state"]) || "/";
    if (!code) return res.redirect(authorizationLink(state));

    void oauth.tokenRequest({
      code,
      scope: ["identify", "guilds.join"],
      grantType: "authorization_code",
      redirectUri,
    })
      .then(async ({ access_token: accessToken, refresh_token: refreshToken }) => {
        const { id } = await oauth.getUser(accessToken);

        const tokens = await OAuthTokens.findOne({ userId: id }) ?? new OAuthTokens({ userId: id });
        tokens.accessToken = accessToken;
        tokens.refreshToken = refreshToken;
        await tokens.save();

        res.cookie("token", await sign({ id })).redirect(state);
        void refreshSubserverAccess(id, client);
      })
      .catch(() => res.redirect(authorizationLink(state)));
  });

  // login and logout
  app.get("/login", (_, res) => res.clearCookie("token").redirect(authorizationLink("/")));
  app.get("/logout", (_, res) => res.clearCookie("token").sendFile(join(webFolderPath, "logout.html")));

  // check if token is valid
  app.use((req, res, next) => {
    const { token } = req.cookies as { token?: string };
    if (!token) return res.redirect(authorizationLink(req.path));

    void verify(token).then(valid => {
      if (valid) return next();
      res.redirect(authorizationLink(req.path));
    });
  });

  // check if user is staff
  app.use((req, res, next) => {
    const { token } = req.cookies as { token: string };

    const { id } = decode<{ id: Snowflake }>(token);
    void client.guilds.cache.get(config.mainGuildId)!.members.fetch({ user: id, force: false }).catch(() => null)
      .then(member => {
        if (member?.roles.cache.some(role => allStaffRoles.includes(role.id))) return next();
        return res.status(403).sendFile(join(webFolderPath, "forbidden.html"));
      });
  });

  // serve content
  app.use(express.static(join(webFolderPath, "staff-document")));
  app.get("*", (_, res) => res.status(404).sendFile(join(webFolderPath, "staff-document", "404.html")));

  // start app
  listen(webConfig.port);
}
