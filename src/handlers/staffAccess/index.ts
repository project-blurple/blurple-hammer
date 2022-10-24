import type { Client, Snowflake } from "discord.js";
import refreshSubserverAccess from "./subservers";

export default function handleStaffAccess(client: Client<true>): void {
  void Promise.all(client.guilds.cache.map(guild => guild.members.fetch())).then(async memberChunks => {
    const members = memberChunks.reduce<Snowflake[]>((a, b) => [...a, ...b.map(member => member.id).filter(id => !a.includes(id))], []);
    for (const member of members) await refreshSubserverAccess(member, client);

    client.on("guildMemberAdd", member => refreshSubserverAccess(member.id, client));
    client.on("guildMemberRemove", member => refreshSubserverAccess(member.id, client));
    client.on("guildMemberUpdate", member => refreshSubserverAccess(member.id, client));
  });
}
