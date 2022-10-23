import { createFileTransports, globalFormat } from ".";
import { createLogger, transports } from "winston";

export const databaseLogger = createLogger({
  format: globalFormat,
  transports: [
    ...createFileTransports("database", ["debug"]),
    new transports.Console({ level: "info" }),
  ],
});
