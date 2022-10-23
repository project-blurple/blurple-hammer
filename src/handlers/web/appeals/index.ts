import { createExpressApp, webFolderPath } from "..";
import { sign, verify } from "../../../utils/webtokens";
import type { Client } from "discord.js";
import type config from "../../../config";
import express from "express";
import { join } from "path";
import oauth from "../../../utils/oauth";

export default function handleWebAppeals(client: Client<true>, webConfig: Exclude<typeof config["appeals"], null>): void {
  const [app, listen] = createExpressApp("staff-portal", webConfig.numberOfProxies);

  const redirectUri = new URL("/oauth-callback", webConfig.url).href;
  const authorizationLink = (state?: string) => oauth.generateAuthUrl({
    prompt: "consent",
    redirectUri,
    scope: ["identify", "email"],
    ...state && { state },
  });

  // create token
  app.get("/oauth-callback", (req, res) => {
    const code = String(req.query["code"]);
    const state = String(req.query["state"]) || "/";
    if (!code) return res.redirect(authorizationLink(state));

    void oauth.tokenRequest({
      code,
      scope: ["identify", "email"],
      grantType: "authorization_code",
      redirectUri,
    })
      .then(async ({ access_token: accessToken }) => {
        const { avatar, discriminator, email, id, username } = await oauth.getUser(accessToken);

        const tag = `${username}#${discriminator}`;
        const avatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${Number(discriminator) % 5}.png`;

        res.cookie("token", await sign({ id, tag, avatarUrl, email })).redirect(state);
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

  // serve content
  app.use(express.static(join(webFolderPath, "appeals")));
  // todo make content and serve it properly

  // start app
  listen(webConfig.port);
}
