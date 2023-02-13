import type { Client } from "discord.js";
import { SubserverAccessOverride } from "../../database/models/SubserverAccessOverride";
import { refreshAllSubserverAccess, refreshSubserverAccess } from "./subserverAccess/refresh";

export default function handleServerPolicies(client: Client<true>): void {
  refreshAllSubserverAccess(client);

  client.on("guildMemberAdd", member => void refreshSubserverAccess(member.id, client));
  client.on("guildMemberUpdate", member => void refreshSubserverAccess(member.id, client));
  client.on("guildMemberRemove", async member => {
    await SubserverAccessOverride.deleteMany({ userId: member.id, guildId: member.guild.id });
    void refreshSubserverAccess(member.id, client);
  });
}
