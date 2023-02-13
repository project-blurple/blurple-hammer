import OAuth2 from "discord-oauth2";
import { createLogger } from "winston";
import config from "../config";
import { createFileTransports, globalFormat } from "./logger";

const oauth = new OAuth2({
  clientId: config.client.id,
  clientSecret: config.client.secret,
  credentials: Buffer.from(`${config.client.id}:${config.client.secret}`).toString("base64"),
});

const oauthLogger = createLogger({ format: globalFormat, transports: createFileTransports("discord-oauth2", ["debug", "warn"]) });
oauth.on("debug", message => oauthLogger.debug(message));
oauth.on("warn", message => oauthLogger.warn(message));

export default oauth;
