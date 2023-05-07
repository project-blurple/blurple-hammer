import config from "../../config";
import Emojis from "../../constants/emojis";
import type { MentionCommand } from ".";

export default {
  names: ["d"],
  testArgs(args) { return args.length === 1 || args.length === 2 && args[1] === "m"; },
  async execute(_, reply, [userId, mega]) {
    // only active in staff server
    if (_.guildId !== "573169434227900417") return;

    const member = await _.client.guilds.cache.get(config.mainGuildId)?.members.fetch(userId!);
    if (!member) return void reply(`${Emojis.TickNo} Member not found on main server`);

    const role = mega ? config.roles.megaDonators : config.roles.donators;
    if (member.roles.cache.has(role)) {
      void member.roles.remove(role, "Donator role removed");
      return void reply(`${Emojis.TickYes} ${mega ? "Mega donator" : "Donator"} role removed from ${member.user.tag}.`);
    }

    void member.roles.add(role, "Donator role added");
    return void reply(`${Emojis.TickYes} ${mega ? "Mega donator" : "Donator"} role added to ${member.user.tag}.`);
  },
} as MentionCommand;
