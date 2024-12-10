import type { Client, Snowflake } from "discord.js";
import express from "express";
import { join } from "path";
import { createExpressApp, webFolderPath } from "..";
import config from "../../../config";
import { OAuthTokens } from "../../../database/models/OAuthTokens";
import oauth from "../../../utils/oauth";
import { decode, sign, verify } from "../../../utils/webtokens";
import { refreshSubserverAccess } from "../../serverEnforcements/subserverAccess/refresh";
import cloneStaffDocument, { staffDocumentFolder } from "./staffDocumentCloner";

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
    const code = typeof req.query["code"] === "string" ? req.query["code"] : null;
    const state = typeof req.query["code"] === "string" && req.query["code"] || "/";
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

  // refresh staff document
  app.post("/refresh-staff-document", (req, res) => {
    const { authorization } = req.headers;
    if (authorization !== config.staffDocumentCloningToken) return res.status(401).send("Unauthorized");

    return void cloneStaffDocument()
      .then(() => res.status(200).send("OK"))
      .catch(() => res.status(500).send("Internal Server Error"));
  });

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
        if (member?.roles.cache.find(role => role.id === config.roles.staff.all)) return next();
        return res.status(403).sendFile(join(webFolderPath, "forbidden.html"));
      });
  });

  // serve content
  app.get("/api/users/:userId.json", (req, res) => {
    client.users.fetch(req.params.userId, { cache: true, force: false }).then(user => {
      res.setHeader("Cache-Control", "public, max-age=0").send({
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.displayAvatarURL({ extension: "webp", size: 32 }),
      });
    })
      .catch(() => res.status(404).send({ error: "user not found" }));
  });
  app.use(express.static(staffDocumentFolder));
  app.get("*", (_, res) => res.status(404).sendFile(join(webFolderPath, "staff-document", "404.html")));

  // start app
  listen(webConfig.port);
}
