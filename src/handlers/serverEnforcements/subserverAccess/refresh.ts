import type { Client, Snowflake } from "discord.js";
import subservers, { SubserverAccess } from "../../../constants/subservers";
import { OAuthTokens } from "../../../database/models/OAuthTokens";
import type { OAuthTokensDocument } from "../../../database/models/OAuthTokens";
import calculateAccess from "./calculator";
import { inspect } from "util";
import oauth from "../../../utils/oauth";
import { staffLogger } from "../../../utils/logger/staff";

export async function refreshSubserverAccess(userId: Snowflake, client: Client): Promise<void> {
  let tokens: OAuthTokensDocument | false | null = false;
  for (const subserver of subservers) {
    const server = client.guilds.cache.get(subserver.id);
    if (server) {
      const member = await server.members.fetch({ user: userId, force: false }).catch(() => null);
      const { access, applicableRoles, prohibitedRoles } = await calculateAccess(userId, subserver, client);

      // kick user for having no access
      if (access === SubserverAccess.Denied && member && !member.user.bot) {
        await member.kick("User has no access to subserver")
          .then(() => staffLogger.info(`Kicked user ${userId} from subserver ${subserver.name} due to no access`))
          .catch(err => staffLogger.error(`Failed to kick user ${userId} from subserver ${subserver.name}: ${inspect(err)}`));

      // force-add user
      } else if (access === SubserverAccess.Forced && !member) {
        if (tokens === false) {
          tokens = await OAuthTokens.findOne({ userId }).then(tokenDoc => {
            if (!tokenDoc) return null;
            return oauth.tokenRequest({
              refreshToken: tokenDoc.refreshToken,
              grantType: "refresh_token",
              scope: ["identify", "guilds.join"],
            })
              .then(async ({ access_token: accessToken, refresh_token: refreshToken }) => {
                tokenDoc.accessToken = accessToken;
                tokenDoc.refreshToken = refreshToken;
                await tokenDoc.save();
                return tokenDoc;
              })
              .catch(err => {
                staffLogger.debug(`Failed to refresh access token for user ${userId}: ${inspect(err)}`);
                return null;
              });
          });
        }

        if (tokens) {
          await oauth.addMember({
            accessToken: tokens.accessToken,
            botToken: client.token!,
            guildId: subserver.id,
            userId,
            roles: applicableRoles,
          })
            .then(() => staffLogger.info(`Added user ${userId} to subserver ${subserver.name} due to forced access`))
            .catch(err => staffLogger.error(`Failed to add user ${userId} to subserver ${subserver.name}: ${inspect(err)}`));
        } else {
          staffLogger.debug(`Failed to add user ${userId} to subserver ${subserver.name} because access token could not be refreshed`);
        }

      // apply roles to existing member
      } else if (member) {
        const rolesToAdd = applicableRoles.filter(role => !member.roles.cache.has(role));
        if (rolesToAdd.length > 0) {
          await member.roles.add(rolesToAdd, "Role is forced (policy)");
          staffLogger.debug(`Added roles ${rolesToAdd.join(", ")} to user ${userId} in subserver ${subserver.name} due to roles being forced`);
        }

        const rolesToRemove = prohibitedRoles.filter(role => member.roles.cache.has(role));
        if (rolesToRemove.length > 0) {
          await member.roles.remove(rolesToRemove, "User is not allowed to have this role (policy)");
          staffLogger.debug(`Removed roles ${rolesToRemove.join(", ")} from user ${userId} in subserver ${subserver.name} due to roles being prohibited`);
        }
      }
    }
  }
  staffLogger.debug(`Refreshed subserver access for user ${userId}`);
}

export function refreshAllSubserverAccess(client: Client<true>): void {
  void Promise.all(client.guilds.cache.map(guild => guild.members.fetch())).then(async memberChunks => {
    const members = memberChunks.reduce<Snowflake[]>((a, b) => [...a, ...b.map(member => member.id).filter(id => !a.includes(id))], []);
    for (const member of members) await refreshSubserverAccess(member, client);
  });
}
