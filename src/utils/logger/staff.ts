import { createFileTransports, globalFormat } from ".";
import { createLogger } from "winston";

export const staffLogger = createLogger({
  format: globalFormat,
  transports: createFileTransports("staff", ["info", "debug"]),
});
