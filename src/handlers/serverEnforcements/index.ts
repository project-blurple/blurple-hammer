import type { Client } from "discord.js";
import refreshAllSubserverAccess from "./subservers/access/refreshAll";

export default function handleServerPolicies(client: Client<true>): void {
  refreshAllSubserverAccess(client);
}
