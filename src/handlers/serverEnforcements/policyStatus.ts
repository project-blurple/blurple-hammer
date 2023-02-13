import type { Guild } from "discord.js";
import config from "../../config";
import type { Policy } from "../../constants/policies";
import { PolicyStatus, ServerType, policies } from "../../constants/policies";
import subservers from "../../constants/subservers";

export default async function getPolicyStatus(guild: Guild): Promise<Record<Policy, { status: PolicyStatus; message?: string }>> {
  const me = await guild.members.fetchMe();
  const serverType = getServerType(guild);

  return Object.fromEntries(
    await Promise.all(
      Object.entries(policies).map(async ([policy, { appliesTo, check }]) => {
        if (!appliesTo.includes(serverType)) return [Number(policy) as Policy, { status: PolicyStatus.NonApplicable }];
        const [status, message] = await check({ guild, me });
        return [Number(policy) as Policy, { status, message }];
      }),
    ),
  ) as Record<Policy, { status: PolicyStatus; message?: string }>;
}

export function getServerType(guild: Guild): ServerType {
  let serverType = ServerType.Unknown;
  if (guild.id === config.mainGuildId) serverType = ServerType.Main;
  else if (subservers.some(subserver => subserver.id === guild.id)) serverType = ServerType.Subserver;
  else if (config.otherGuildIds.includes(guild.id)) serverType = ServerType.Other;
  return serverType;
}
