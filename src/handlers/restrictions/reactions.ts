import type { Client } from "discord.js";
import config from "../../config";

export default function handleReactionsRestriction(client: Client<true>): void {
  client.on("messageReactionAdd", async (reaction, user) => {
    const member = await reaction.message.guild?.members.fetch({ user: user.id, force: false }).catch(() => null);
    if (member?.roles.cache.has(config.roles.restrictions.reactions)) await reaction.users.remove(user.id);
  });
}
