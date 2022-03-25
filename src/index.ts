import { Client, Intents, Options } from "discord.js";
import { discordLogger, hammerLogger } from "./utils/logger";
import type { Module } from "./modules";
import config from "./config";
import { inspect } from "util";
import { join } from "path";
import { readdir } from "fs/promises";

export const client = new Client({
  makeCache: Options.cacheEverything(),
  partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "GUILD_SCHEDULED_EVENT"],
  userAgentSuffix: [
    "Blurple Hammer Bot",
    "https://github.com/project-blurple/blurple-hammer",
    "https://projectblurple.com",
  ],
  presence: { status: "online" },
  intents: Object.values(Intents.FLAGS),
  allowedMentions: { parse: [], users: [], roles: [], repliedUser: true },
});

client.once("ready", client => {
  hammerLogger.info(`Logged in as ${client.user.tag}`);

  // todo: interaction handler

  readdir(join(__dirname, "modules"))
    .then(async files => {
      for (const file of files) {
        try {
          const module = (await import(join(__dirname, "modules", file))).default as Module;
          await module(client);
          hammerLogger.info(`Module "${file}" loaded`);
        } catch (e) {
          hammerLogger.error(`Module "${file}" failed to load: ${inspect(e)}`);
        }
      }
    })
    .catch(e => hammerLogger.error(`Error running modules: ${inspect(e)}`));
});

client
  .on("debug", info => void discordLogger.debug(info))
  .on("error", error => void discordLogger.error(`Cluster errored. ${inspect(error)}`))
  .on("rateLimit", rateLimitData => void discordLogger.warn(`Rate limit ${JSON.stringify(rateLimitData)}`))
  .on("ready", () => void discordLogger.info("All shards have been connected."))
  .on("shardDisconnect", (event, id) => void discordLogger.warn(`Shard ${id} disconnected. ${inspect(event)}`))
  .on("shardError", (error, id) => void discordLogger.error(`Shard ${id} errored. ${inspect(error)}`))
  .on("shardReady", id => void discordLogger.info(`Shard ${id} is ready.`))
  .on("shardReconnecting", id => void discordLogger.warn(`Shard ${id} is reconnecting.`))
  .on("shardResume", (id, replayed) => void discordLogger.info(`Shard ${id} resumed. ${replayed} events replayed.`))
  .on("warn", info => void discordLogger.warn(info));

client.login(config.client.token);
