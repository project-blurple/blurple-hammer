import type { Awaitable, Client } from "discord.js";

export type Module = (client: Client<true>) => Awaitable<void>;
