import type { Client, Snowflake } from "discord.js";
import config from "../../../config";
import type { Subserver } from "../../../constants/subservers";
import { SubserverAccess } from "../../../constants/subservers";
import { SubserverAccessOverride } from "../../../database/models/SubserverAccessOverride";
import { UserStrip } from "../../../database/models/UserStrip";

export default async function calculateAccess(userId: Snowflake, subserver: Subserver, client: Client): Promise<{ access: SubserverAccess; applicableRoles: Snowflake[]; prohibitedRoles: Snowflake[] }> {
  const member = await client.guilds.cache.get(config.mainGuildId)!.members.fetch({ user: userId, force: false }).catch(() => null);
  if (!member) return { access: SubserverAccess.Denied, applicableRoles: [], prohibitedRoles: []};

  const override = await SubserverAccessOverride.findOne({ userId, subserverId: subserver.id });
  if (override) return { access: SubserverAccess.Allowed, applicableRoles: subserver.userOverrideNoticeRoleId ? [subserver.userOverrideNoticeRoleId] : [], prohibitedRoles: []};

  const members = client.guilds.cache.map(guild => guild.members.cache.get(userId));

  const userStrip = await UserStrip.findOne({ userId });
  const allUserOrRoleIdsApplicable = [
    member.id,
    ...member.roles.cache.map(role => role.id),
    ...userStrip?.roleIds ?? [],
    ...members.flatMap(user => user?.roles.cache.map(role => role.id) ?? []),
  ].filter((id, index, array) => array.indexOf(id) === index);

  const allEntries = Object.entries(subserver.staffAccess);
  const applicableEntries = allEntries.filter(([userOrRoleId]) => allUserOrRoleIdsApplicable.includes(userOrRoleId)).map(([, access]) => access);
  const otherManagedEntries = allEntries.map(([, access]) => access).filter(access => !applicableEntries.some(entry => entry === access));

  const access = applicableEntries.reduce((previous, { access: current = SubserverAccess.Denied }) => current > previous ? current : previous, SubserverAccess.Denied);
  const applicableRoles = applicableEntries.reduce<Snowflake[]>((previous, { roles = []}) => previous.concat(roles), []).filter((role, index, array) => array.indexOf(role) === index);
  const prohibitedRoles = otherManagedEntries.reduce<Snowflake[]>((previous, { roles = []}) => previous.concat(roles), []).filter((role, index, array) => array.indexOf(role) === index && !applicableRoles.includes(role));
  if (subserver.userOverrideNoticeRoleId) prohibitedRoles.push(subserver.userOverrideNoticeRoleId);

  return { access, applicableRoles, prohibitedRoles };
}
