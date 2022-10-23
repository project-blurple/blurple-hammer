import { createFileTransports, globalFormat } from "../../utils/logger";
import type { Client } from "discord.js";
import type { Express } from "express";
import config from "../../config";
import cookieParser from "cookie-parser";
import { createLogger } from "winston";
import express from "express";
import handleWebAppeals from "./appeals";
import handleWebStaffPortal from "./staffPortal";
import helmet from "helmet";
import { join } from "path";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

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
  app.use(helmet());
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
