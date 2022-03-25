import type { Snowflake } from "discord.js";
import { createQuickDatabase } from "./quick";

export const strips = createQuickDatabase<Array<Snowflake>>("strips"); // userId: Array<roleIds>
export const oauthTokens = createQuickDatabase<{ accessToken: string; refreshToken: string; }>("oauth"); // userId: { accessToken: string; refreshToken: string; }
export const subserverOverrides = createQuickDatabase<Snowflake>("subserverOverrides"); // `${guildId}-${userId}`: adminId
