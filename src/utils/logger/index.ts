export const dailyRotateFileOptions = {
  maxSize: "25m",
  maxFiles: "14d",
  zippedArchive: true,
  extension: ".log",
};

export { discordLogger } from "./discord";
export { expressLogger } from "./express";
export { hammerLogger } from "./hammer";
export { mongooseLogger } from "./mongoose";
