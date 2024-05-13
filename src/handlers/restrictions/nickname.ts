import type { Client } from "discord.js";
import { AuditLogEvent } from "discord.js";
import config from "../../config";

export default function handleNicknameRestriction(client: Client<true>): void {
  client.on("guildMemberUpdate", (old, member) => void (async () => {
    if (old.nickname !== member.nickname && member.roles.cache.has(config.roles.restrictions.nick)) {
      const audits = await member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberUpdate });
      const entry = audits.entries.sort((a, b) => b.createdTimestamp - a.createdTimestamp).find(({ target, changes }) => target?.id === member.id && changes.some(change => change.key === "nick"));

      if (entry?.executor?.id === member.id) await member.setNickname(old.nickname, "User is restricted from changing their nickname");
    }
  })());
}
