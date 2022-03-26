import Emojis from "../../constants/emojis";
import type { MentionCommand } from ".";
import { PermissionLevel } from "../../constants/permissions";
import { msToTime } from "../../utils/time";

const command: MentionCommand = {
  aliases: ["pong", "latency"],
  async execute(message, reply) {
    const start = Date.now();
    const botMsg = await reply(`${Emojis.LOADING} Pinging...`);
    botMsg.edit(`${Emojis.SPARKLE} Pong! Server latency is \`${Date.now() - start}ms\`, API latency is \`${Math.round(message.client.ws.ping)}ms\` and my uptime is \`${msToTime(message.client.uptime || 0)}\`.`);
  },
  permissionLevelRequired: PermissionLevel.NONE,
  testArgs(args) {
    return args.length === 0;
  },
};

export default command;
