import config from "../config";
import mongoose from "mongoose";
import { mongooseLogger } from "../utils/logger";

mongoose.set("debug", (collectionName, method, query, doc) => mongooseLogger.debug(JSON.stringify({ collectionName, method, query, doc })));

export * from "./models/AccessOverride";
export * from "./models/OAuthTokens";
export * from "./models/Strip";

export const connection = mongoose.connect(config.databaseUri);

connection
  .then(() => mongooseLogger.info("Connected to database"))
  .catch(err => mongooseLogger.error(`Error when connecting to database: ${JSON.stringify({ err })}`));
