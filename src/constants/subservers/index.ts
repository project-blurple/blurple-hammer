import type { Snowflake } from "discord.js";
import assetsSubserver from "./assets";
import dev2Subserver from "./dev2";
import devSubserver from "./dev";
import minecraftSubserver from "./minecraft";
import staffSubserver from "./staff";

export enum Access { Denied, Allowed, Forced }

export interface Subserver {
  id: Snowflake;
  name: string;
  acronym: string;

  // snowflake can either be role id or user id
  staffAccess: Record<Snowflake, {
    access?: Access;
    roles?: Snowflake[];
  }>;

  userOverrideNoticeRoleId?: Snowflake;
}

export default [
  assetsSubserver,
  devSubserver,
  dev2Subserver,
  minecraftSubserver,
  staffSubserver,
] as Subserver[];
