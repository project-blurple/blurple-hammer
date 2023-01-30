import { PolicyStatus, ServerType, policies } from "../../constants/policies";
import getPolicyStatus, { getServerType } from "../../handlers/serverEnforcements/policyStatus";
import { Colors } from "discord.js";
import type { EmbedField } from "discord.js";
import Emojis from "../../constants/emojis";
import type { MentionCommand } from ".";
import type { Policy } from "../../constants/policies";

export default {
  names: ["policycheck", "checkpolicy", "policystatys", "serverstatus"],
  ownerOnly: true,
  testArgs(args) { return args.length === 0 || args.length === 1; },
  async execute(message, reply, [serverId = message.guildId]) {
    const guild = message.client.guilds.cache.get(serverId);
    if (!guild) return void reply(`${Emojis.Anger} I am not in a server with the ID \`${serverId}\`.`);

    const policyStatus = Object.entries(await getPolicyStatus(guild));
    return void reply({
      content: `${Emojis.Sparkle} This is the policy status for server \`${guild.name}\` (type: \`${{
        [ServerType.Main]: "MAIN",
        [ServerType.Subserver]: "SUBSERVER",
        [ServerType.Other]: "OTHER",
        [ServerType.Unknown]: "UNKNOWN",
      }[getServerType(guild)]}\`):`,
      embeds: [
        ...policyStatus.some(([, { status }]) => status === PolicyStatus.NonCompliant) ?
          [
            {
              title: "Non-Compliant Policies",
              fields: policyStatus.filter(([, { status }]) => status === PolicyStatus.NonCompliant).map<EmbedField>(([policy, { message: policyMessage }]) => ({ name: policies[Number(policy) as Policy].description, value: policyMessage ?? "*No more information provided.*", inline: false })),
              color: Colors.Red,
            },
          ] :
          [],
        ...policyStatus.some(([, { status }]) => status === PolicyStatus.Compliant) ?
          [
            {
              title: "Compliant Policies",
              fields: policyStatus.filter(([, { status }]) => status === PolicyStatus.Compliant).map<EmbedField>(([policy, { message: policyMessage }]) => ({ name: policies[Number(policy) as Policy].description, value: policyMessage ?? "*No more information provided.*", inline: false })),
              color: Colors.Green,
            },
          ] :
          [],
      ],
    });
  },
} as MentionCommand;
