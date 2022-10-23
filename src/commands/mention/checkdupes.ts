import Emojis from "../../constants/emojis";
import type { MentionCommand } from ".";

const command: MentionCommand = {
  aliases: ["filterdupes", "dupes"],
  testArgs(args) { return args.length >= 1; },
  async execute(_, reply, args) {
    const filtered = args.filter((value, index, self) => self.indexOf(value) === index);
    return reply(`${Emojis.Sparkle} Filtered ${args.length - filtered.length} duplicate${args.length - filtered.length === 1 ? "" : "s"} out of ${args.length} total argument${args.length === 1 ? "" : "s"}: \n> \`\`\`fix\n${filtered.join(" ")}\`\`\``);
  },
};

export default { ...command } as const;
