import Roles from "./roles";
import type { User } from "discord.js";
import config from "../config";

export enum PermissionLevel {
  BLACKLISTED,
  NONE,
  SUPPORT,
  MODERATOR,
  LEADERSHIP,
  TEAM_LEADERS,
  ADMINISTRATOR,
  BOT_OWNER,
}

export const rolePermissions = {
  [Roles.ADMINISTRATORS]: PermissionLevel.ADMINISTRATOR,
  [Roles.TEAM_LEADERS]: PermissionLevel.TEAM_LEADERS,
  [Roles.LEADERSHIP_STAFF]: PermissionLevel.LEADERSHIP,
  [Roles.MODERATION_STAFF]: PermissionLevel.MODERATOR,
  [Roles.SUPPORT_STAFF]: PermissionLevel.SUPPORT,
  [Roles.NO_BOT_ACCESS]: PermissionLevel.BLACKLISTED,
};

export function getPermissionLevel(user: User): PermissionLevel {
  if (user.id === config.ownerId) return PermissionLevel.BOT_OWNER;
  const member = user.client.guilds.resolve(config.guildId)?.members.resolve(user.id);
  if (member) {
    const roles = member.roles.cache.map(r => r.id);
    for (const [role, level] of Object.entries(rolePermissions)) if (roles.includes(role)) return level;
  }
  return PermissionLevel.NONE;
}
