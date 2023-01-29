import Emojis from "../../constants/emojis";
import type { MentionCommand } from ".";

export default {
  names: ["filterdupes", "dupes"],
  testArgs(args) { return args.length >= 1; },
  execute(_, reply, args) {
    const filtered = args.filter((value, index, self) => self.indexOf(value) === index);
    return void reply(`${Emojis.Sparkle} Filtered ${args.length - filtered.length} duplicate${args.length - filtered.length === 1 ? "" : "s"} out of ${args.length} total argument${args.length === 1 ? "" : "s"}: \n> \`\`\`fix\n${filtered.join(" ")}\`\`\``);
  },
} as MentionCommand;
