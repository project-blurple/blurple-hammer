import { createLogger, transports } from "winston";
import { createFileTransports, globalFormat } from ".";

const databaseLogger = createLogger({
  format: globalFormat,
  transports: [
    ...createFileTransports("database", ["debug"]),
    new transports.Console({ level: "info" }),
  ],
});

export default databaseLogger;
