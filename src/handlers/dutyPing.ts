import type { Client } from "discord.js";
import Emojis from "../constants/emojis";
import config from "../config";

export default function handleDutyPing(client: Client<true>): void {
  const role = client.guilds.cache.get(config.guildId)?.roles.cache.get(config.roles.staffOnDuty);
  client.on("messageCreate", message => {
    if (role && message.mentions.roles.has(role.id)) {
      void role.setMentionable(false, `Role was pinged in channel ${message.channelId} by ${message.author.tag}`);
      void message.react(Emojis.WeeWoo);
      setTimeout(() => void role.setMentionable(true), 1000 * 60 * 2);
    }
  });
}
