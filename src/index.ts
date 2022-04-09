import { Client, Intents, Options } from "discord.js";
import { discordLogger, hammerLogger } from "./utils/logger";
import Emojis from "./constants/emojis";
import type { Module } from "./modules";
import config from "./config";
import { connection } from "./database";
import { inspect } from "util";
import interactionsHandler from "./handlers/interactions";
import { join } from "path";
import mentionCommandHandler from "./handlers/mentionCommands";
import { readdir } from "fs/promises";

const client = new Client({
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

client.once("ready", async client => {
  hammerLogger.info(`Logged in as ${client.user.tag}. Caching everything...`);

  // cache everything. not really needed but always handy.
  const start = Date.now();
  await Promise.all(client.guilds.cache.map(async guild => {
    await guild.fetch();
    await guild.members.fetch();
    await guild.channels.fetch();
    await guild.channels.fetchActiveThreads();
    await guild.roles.fetch();
    hammerLogger.info(`Cached guild ${guild.name} in ${Date.now() - start}ms`);
  }));
  hammerLogger.info(`Cached all guilds in ${Date.now() - start}ms. Starting handlers and modules...`);

  interactionsHandler(client);

  // load modules
  readdir(join(__dirname, "modules"))
    .then(async files => {
      const start = Date.now();
      for (const file of files.filter(file => !file.startsWith("index"))) {
        try {
          const module = (await import(join(__dirname, "modules", file))).default as Module;
          await module(client);
          hammerLogger.info(`Module "${file}" loaded`);
        } catch (e) {
          hammerLogger.error(`Module "${file}" failed to load: ${inspect(e)}`);
        }
      }
      hammerLogger.info(`Modules loaded in ${Date.now() - start}ms.`);
    })
    .catch(e => hammerLogger.error(`Error loading modules: ${inspect(e)}`));
});

client.on("messageCreate", async message => {
  if (
    !message.guild ||
    message.type !== "DEFAULT" ||
    message.author.bot
  ) return;

  // mention command handler
  if (message.content.match(`^<@!?${client.user?.id}> `)) return void mentionCommandHandler(message);
  else if (message.content.match(`^<@!?${client.user?.id}>`)) await message.react(Emojis.WAVE);
});

client.on("messageUpdate", (_, message) => {
  if (!message.partial && message.content.match(`^<@!?${client.user?.id}> `)) return void mentionCommandHandler(message);
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

hammerLogger.info("Connecting to database.");
connection.then(() => {
  hammerLogger.info("Database connected, logging in to Discord.");
  client.login(config.client.token);
}).catch(e => hammerLogger.warn(`Database connection failed: ${inspect(e)}`));