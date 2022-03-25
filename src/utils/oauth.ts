import OAuth2 from "discord-oauth2";
import config from "../config";

export const oauth = new OAuth2({
  clientId: config.client.id,
  clientSecret: config.client.secret,
  credentials: Buffer.from(`${config.client.id}:${config.client.secret}`).toString("base64"),
  ...config.web?.portal?.link && { redirectUri: config.web?.portal?.link },
});
