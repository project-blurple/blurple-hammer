import { join } from "path";
import cookieParser from "cookie-parser";
import type { Client } from "discord.js";
import type { Express } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet, { contentSecurityPolicy } from "helmet";
import morgan from "morgan";
import { createLogger } from "winston";
import config from "../../config";
import { createFileTransports, globalFormat } from "../../utils/logger";
import handleWebAppeals from "./appeals";
import handleWebStaffPortal from "./staffPortal";

export default function handleWeb(client: Client<true>): void {
  if (config.appeals) handleWebAppeals(client, config.appeals);
  if (config.staffPortal) handleWebStaffPortal(client, config.staffPortal);
}

export const webFolderPath = join(__dirname, "../../../web");

export function createExpressApp(name: string, numberOfProxies = 0): [app: Express, listen: (port: number) => void] {
  const app = express();
  app.set("trust proxy", numberOfProxies);

  // logging
  const logger = createLogger({ format: globalFormat, transports: createFileTransports(`express-${name}`, ["http"]) });
  app.use(morgan(":remote-addr :method :url :status :res[content-length] - :response-time ms", { stream: { write: message => logger.http(`Received HTTP request: ${message.slice(0, -1)}`) }}));

  // security
  app.use(helmet({
    // for docusaurus
    contentSecurityPolicy: {
      directives: {
        "img-src": [...Array.from(contentSecurityPolicy.getDefaultDirectives()["img-src"]!), "https://cdn.discordapp.com/"],
        "script-src": [...Array.from(contentSecurityPolicy.getDefaultDirectives()["script-src"]!), "'unsafe-inline'"],
      },
    },
    // for cloudflare assets, apparently they don't support COEP
    crossOriginEmbedderPolicy: false,
  }));
  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000,
      max: 5000,
      legacyHeaders: true,
      standardHeaders: true,
      handler: (_, res) => res.status(429).sendFile(join(webFolderPath, "too_many_requests.html")),
      skipSuccessfulRequests: false,
      skipFailedRequests: true,
    }),
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 500,
      legacyHeaders: true,
      standardHeaders: true,
      handler: (_, res) => res.status(429).sendFile(join(webFolderPath, "too_many_requests.html")),
      skipSuccessfulRequests: true,
      skipFailedRequests: false,
    }),
  );

  // miscellaneois
  app.use(cookieParser());

  // static files
  app.use(express.static(join(webFolderPath, "static")));

  return [
    app,
    port => {
      app.all("*", (_, res) => res.status(404).sendFile(join(webFolderPath, "not_found.html")));
      app.listen(port, () => logger.info(`Listening on port ${port}`));
    },
  ];
}
