import { Client, Intents, Options } from "discord.js";
import { discordLogger, hammerLogger } from "./utils/logger";
import type { Module } from "./modules";
import config from "./config";
import { inspect } from "util";
import { join } from "path";
import mentionCommandHandler from "./handlers/mentionCommands";
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
  }));
  hammerLogger.info(`Cached in ${Date.now() - start}ms. Starting handlers and modules...`);

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

client.on("messageUpdate", async (_, message) => {
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

client.login(config.client.token);
