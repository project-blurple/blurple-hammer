import { createLogger } from "winston";
import { createFileTransports, globalFormat } from ".";

const staffLogger = createLogger({
  format: globalFormat,
  transports: createFileTransports("staff", ["info", "debug"]),
});

export default staffLogger;
