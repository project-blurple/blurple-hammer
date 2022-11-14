import type { Awaitable, Guild, GuildMember } from "discord.js";
import config from "../../../config";
import subservers from "../../../constants/subservers";

export enum Policy {
  BotRoleIsAdministrator,
  BotRoleIsHighestRole,
  EveryoneRoleNoPermissions,
  BotRolesIncludeBotTag,
  NotInUnknownServers,
}

export enum PolicyStatus { Compliant, NonCompliant, NonApplicable }
export enum ServerType { Main, Subserver, Other, Unknown }

export const policies: Record<Policy, {
  description: string;
  appliesTo: ServerType[];
  check(details: { guild: Guild; me: GuildMember }): Awaitable<[status: PolicyStatus, message?: string]>;
}> = {
  [Policy.BotRoleIsAdministrator]: {
    description: "Bot role is Administrator",
    appliesTo: [ServerType.Main, ServerType.Subserver],
    check: ({ guild, me }) => {
      const botRole = guild.roles.botRoleFor(me);
      if (!botRole) return [PolicyStatus.NonCompliant, "No bot role is present."];
      if (botRole.permissions.has("Administrator")) return [PolicyStatus.Compliant];
      return [PolicyStatus.NonCompliant];
    },
  },
  [Policy.BotRoleIsHighestRole]: {
    description: "Bot role is highest role",
    appliesTo: [ServerType.Subserver],
    check: ({ guild, me }) => {
      const botRole = guild.roles.botRoleFor(me);
      if (!botRole) return [PolicyStatus.NonCompliant, "No bot role is present."];
      if (botRole.id === guild.roles.highest.id) return [PolicyStatus.Compliant];
      return [PolicyStatus.NonCompliant];
    },
  },
  [Policy.EveryoneRoleNoPermissions]: {
    description: "Everyone role has no permissions",
    appliesTo: [ServerType.Subserver],
    check: ({ guild }) => {
      const everyoneRole = guild.roles.everyone;
      if (everyoneRole.permissions.equals(0n)) return [PolicyStatus.Compliant];
      return [PolicyStatus.NonCompliant];
    },
  },
  [Policy.BotRolesIncludeBotTag]: {
    description: "Bot roles start with [BOT]",
    appliesTo: [ServerType.Main, ServerType.Subserver],
    check: ({ guild }) => {
      const botRoles = guild.roles.cache.filter(role => role.managed && role.name !== "Server Boosters");
      const nonCompliantRoles = botRoles.filter(role => !role.name.startsWith("[BOT] "));
      if (nonCompliantRoles.size === 0) return [PolicyStatus.Compliant];
      return [PolicyStatus.NonCompliant, `The following roles are managed by bots but do not start with "[BOT] ": ${nonCompliantRoles.map(role => role.name).join(", ")}`];
    },
  },
  [Policy.NotInUnknownServers]: {
    description: "Bot is not in unknown servers",
    appliesTo: [ServerType.Unknown],
    check: () => [PolicyStatus.NonCompliant],
  },
};

export default async function getPolicyStatus(guild: Guild): Promise<Record<Policy, { status: PolicyStatus; message?: string }>> {
  const me = await guild.members.fetchMe();

  let serverType = ServerType.Unknown;
  if (guild.id === config.mainGuildId) serverType = ServerType.Main;
  else if (subservers.some(subserver => subserver.id === guild.id)) serverType = ServerType.Subserver;
  else if (config.otherGuildIds.includes(guild.id)) serverType = ServerType.Other;

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
