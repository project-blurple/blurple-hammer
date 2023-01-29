import { createExpressApp, webFolderPath } from ".";
import { decode, sign, verify } from "../../utils/webtokens";
import { Appeal } from "../../database/models/Appeal";
import type { AppealType } from "../../database/models/Appeal";
import type { Client } from "discord.js";
import config from "../../config";
import { createNewAppeal } from "../appeals";
import express from "express";
import { join } from "path";
import oauth from "../../utils/oauth";
import { readFileSync } from "fs";
import superagent from "superagent";

export default function handleWebAppeals(client: Client<true>, webConfig: Exclude<typeof config["appeals"], null>): void {
  const [app, listen] = createExpressApp("appeals", webConfig.numberOfProxies);

  const redirectUri = new URL("/oauth-callback", webConfig.url).href;
  const authorizationLink = (state?: string) => oauth.generateAuthUrl({
    prompt: "consent",
    redirectUri,
    scope: ["identify", "email"],
    ...state && { state },
  });

  const alertPage = readFileSync(join(webFolderPath, "appeals/alert.html"), "utf8");

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
        const avatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp` : `https://cdn.discordapp.com/embed/avatars/${Number(discriminator) % 5}.webp`;

        res.cookie("token", await sign({ id, tag, avatarUrl, email })).redirect(state);
      })
      .catch(() => res.redirect(authorizationLink(state)));
  });

  // login and logout
  app.get("/login", (_, res) => res.clearCookie("token").redirect(authorizationLink("/")));
  app.get("/logout", (_, res) => res.clearCookie("token").sendFile(join(webFolderPath, "logout.html")));

  // serve css
  app.get("/main.css", (_, res) => res.sendFile(join(webFolderPath, "appeals/main.css")));

  // check if token is valid
  app.use((req, res, next) => {
    const { token } = req.cookies as { token?: string };
    if (!token) return res.redirect(authorizationLink(req.path));

    void verify(token).then(valid => {
      if (valid) return next();
      if (req.method === "GET") return res.redirect(authorizationLink(req.path));
      return res.status(401).sendFile(join(webFolderPath, "unauthorized.html"));
    });
  });

  // check if user is banned
  app.use((req, res, next) => {
    const { token } = req.cookies as { token: string };
    const { id } = decode<{ id: string }>(token);

    void Appeal.findOne({ "user.id": id, "finalResolution.action": "blocked", "finalResolution.timestamp": { $gte: new Date(Date.now() - 7776000000) }})
      .then(Boolean)
      .then(isBanned => {
        if (isBanned) {
          res.send(alertPage
            .replace(/\$\{TITLE\}/gu, "Blocked")
            .replace(/\$\{MESSAGE\}/gu, "You have been blocked from using the appeals system due to misuse. Your ban will be lifted after 90 days. If you believe this is an error, please contact BlurpleMail or <a href=\"mailto:promise@projectblurple.com\">promise@projectblurple.com</a>.<br/><br/><a href=\"/logout\">Logout</a>"));
        } else next();
      });
  });

  // check if user already has an unresolved appeal
  app.use((req, res, next) => {
    const { token } = req.cookies as { token: string };
    const { id } = decode<{ id: string }>(token);

    void Appeal.findOne({ "user.id": id, "finalResolution": null })
      .then(Boolean)
      .then(hasAppeal => {
        if (hasAppeal) {
          res.send(alertPage
            .replace(/\$\{TITLE\}/gu, "Appeal already exists")
            .replace(/\$\{MESSAGE\}/gu, "You already have an unresolved appeal. Please wait until it is resolved before creating a new one. We will email you when your appeal is resolved. If you believe this is an error, please contact BlurpleMail or <a href=\"mailto:promise@projectblurple.com\">promise@projectblurple.com</a>.<br/><br/><a href=\"/logout\">Logout</a>"));
        } else next();
      });
  });

  // serve content
  app.get("/", (_, res) => res.sendFile(join(webFolderPath, "appeals/form.html")));
  app.get("/server.webp", (_, res) => void superagent(client.guilds.cache.get(config.mainGuildId)!.iconURL({ extension: "webp", size: 256 })!).then(image => res.set("Content-Type", image.type).send(image.body)));
  app.get("/avatar.webp", (req, res) => {
    const { token } = req.cookies as { token: string };
    const { avatarUrl } = decode<{ avatarUrl: string }>(token);

    // fetch the avatar and send it without redirecting
    void superagent(avatarUrl).then(image => res.set("Content-Type", image.type).send(image.body));
  });
  app.post("/", express.urlencoded({ extended: true }), (req, res) => {
    const { body } = req as {
      body?: {
        "case-type": AppealType;
        "case-id": string;
        "user-statement": string;
        "reason": string;
      };
    };

    // validate body
    if (
      !body ||
      // check: case type
      !["ban", "kick", "mute", "warning"].includes(body["case-type"]) ||
      // check: case id
      typeof body["case-id"] !== "string" ||
      body["case-id"].length > 5 ||
      // check: user statement
      typeof body["user-statement"] !== "string" ||
      !body["user-statement"] ||
      body["user-statement"].length > 4096 ||
      // check: reason
      typeof body.reason !== "string" ||
      !body.reason ||
      body.reason.length > 4096
    ) return res.status(400).sendFile(join(webFolderPath, "bad_request.html"));

    // send appeal to staff
    const { token } = req.cookies as { token: string };
    const { id, tag, email, avatarUrl } = decode<{ id: string; tag: string; email: string; avatarUrl: string }>(token);
    createNewAppeal({ id, tag, email, avatarUrl }, {
      type: body["case-type"],
      caseId: body["case-id"] || null,
      userStatement: body["user-statement"],
      userReason: body.reason,
    }, client);

    // respond with alert. we reset the cookie so they can't send another appeal by accident. just a really wacky way to prevent duplicate appeals
    res.clearCookie("token").send(alertPage
      .replace(/\$\{TITLE\}/gu, "Appeal sent successfully")
      .replace(/\$\{MESSAGE\}/gu, `Your appeal has been sent to the staff team. You will be notified when a decision has been made through the email attached to your Discord account (${email}). If you're unable to access this email, please contact BlurpleMail or <a href="mailto:promise@projectblurple.com">promise@projectblurple.com</a>.`));
  });

  // start app
  listen(webConfig.port);
}
