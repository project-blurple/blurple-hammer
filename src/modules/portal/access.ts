import { PermissionLevel, getPermissionLevel } from "../../constants/permissions";
import type { Snowflake, User } from "discord.js";
import { oauthTokens, strips, subserverOverrides } from "../../database";
import subservers, { Access, Subserver } from "../../constants/subservers";
import type { Module } from "..";
import config from "../../config";
import { hammerLogger } from "../../utils/logger/hammer";
import { inspect } from "util";
import { oauth } from "../../utils/oauth";

const module: Module = client => {
  setInterval(async () => {
    const users = [
      ...client.guilds.cache.filter(guild => guild.id !== config.guildId).map(guild => guild.members.cache.map(m => m.id)).flat(2),
      ...client.guilds.cache.get(config.guildId)?.members.cache.filter(m => getPermissionLevel(m.user) > PermissionLevel.NONE).map(m => m.id).flat() || [],
    ].filter((v, i, a) => a.indexOf(v) === i);
    for (const id of users) {
      const user = client.users.resolve(id);
      if (user) await checkMemberAccess(user);
    }
  }, 60_000);
};

export async function checkMemberAccess(user: User) {
  const guild = user.client.guilds.resolve(config.guildId);
  const member = await guild?.members.fetch({ user, force: false }).catch(() => undefined);

  if (!member) {
    for (const subserver of subservers) {
      const subGuild = user.client.guilds.resolve(subserver.id);
      const subMember = await subGuild?.members.fetch({ user, force: false }).catch(() => undefined);
      if (subMember) {
        hammerLogger.info(`Kicking member ${user.tag} from ${subserver.name}: Not in main server`);
        subMember.kick("Not in main server").catch(e => hammerLogger.warn(`Failed to kick member ${user.tag} from ${subserver.name}: ${inspect(e)}`));
      }
    }
  } else if (!member.user.bot) {
    for (const subserver of subservers) {
      const { member, access, override, addRoles, removeRoles } = await calculateAccess(user, subserver);
      if (access === Access.PROHIBITED && !override && member) {
        hammerLogger.info(`Kicking member ${user.tag} from ${subserver.name}: Access level too low, and no override was present`);
        member.kick("Access level too low, and no override was present").catch(e => hammerLogger.warn(`Failed to kick member ${user.tag} from ${subserver.name}: ${inspect(e)}`));
      } else if (access === Access.FORCED && !member) {
        hammerLogger.info(`Adding member ${user.tag} to ${subserver.name}: Access level is FORCED and user was not in server`);
        addMember(user, subserver, addRoles).catch(e => hammerLogger.warn(`Failed to add member ${user.tag} to ${subserver.name}: ${inspect(e)}`));
      } else {
        if (access !== Access.PROHIBITED && member && addRoles.length) {
          hammerLogger.info(`Adding roles ${addRoles.join(", ")} to ${user.tag} in ${subserver.name}`);
          member.roles.add(addRoles).catch(e => hammerLogger.warn(`Failed to add roles ${addRoles.join(", ")} to ${user.tag} in ${subserver.name}: ${inspect(e)}`));
        }
        if (access !== Access.FORCED && member && removeRoles.length) {
          hammerLogger.info(`Removing roles ${removeRoles.join(", ")} from ${user.tag} in ${subserver.name}`);
          member.roles.remove(removeRoles).catch(e => hammerLogger.warn(`Failed to remove roles ${removeRoles.join(", ")} from ${user.tag} in ${subserver.name}: ${inspect(e)}`));
        }
      }
    }
  }
}

export async function calculateAccess(user: User, subserver: Subserver) {
  const mainGuild = user.client.guilds.resolve(config.guildId);
  const mainMember = await mainGuild?.members.fetch({ user, force: false }).catch(() => undefined);
  if (!mainMember) return { access: Access.PROHIBITED, override: false, addRoles: [], removeRoles: []};

  const mainRoles = [
    ...mainMember.roles.cache.map(r => r.id),
    ...await strips.get(user.id) || [],
    user.id,
  ];

  const subGuild = user.client.guilds.resolve(subserver.id);
  const subMember = await subGuild?.members.fetch({ user, force: false }).catch(() => undefined);
  const subRoles = subMember?.roles.cache.map(r => r.id) ?? [];

  const access: Access = Math.max(0, ...mainRoles.map(id => subserver.staffAccess[id]?.presence || 0));
  const override = Boolean(await subserverOverrides.get(`${user.id}-${subserver.id}`));

  const managedRoles = Object.values(subserver.staffAccess).map(o => o?.roles || []).flat().filter((v, i, a) => a.indexOf(v) === i);
  const allowedRoles = mainRoles.map(id => subserver.staffAccess[id]?.roles || []).flat().filter((v, i, a) => a.indexOf(v) === i);
  const disallowedRoles = managedRoles.filter(r => !allowedRoles.includes(r));

  const addRoles = allowedRoles.filter(r => !subRoles.includes(r));
  const removeRoles = disallowedRoles.filter(r => subRoles.includes(r));

  return { member: subMember, access, override, addRoles, removeRoles };
}

async function addMember(user: User, { id: guildId }: Subserver, roles: Array<Snowflake>) {
  const tokens = await oauthTokens.get(user.id) || {} as never;
  if (!tokens) throw new Error(`User ${user.tag} has no tokens`);

  const { access_token: accessToken, refresh_token: refreshToken } = await oauth.tokenRequest({
    refreshToken: tokens.refreshToken,
    grantType: "refresh_token",
    scope: ["identify", "guilds.join"],
  }).catch(() => ({} as never));
  if (!accessToken || !refreshToken) throw new Error(`Failed to refresh tokens for user ${user.tag}`);

  await oauthTokens.set(user.id, { accessToken, refreshToken });

  return oauth.addMember({
    accessToken,
    botToken: config.client.token,
    guildId,
    userId: user.id,
    roles,
  });
}

export default module;
