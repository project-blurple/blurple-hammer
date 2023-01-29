import type { Snowflake } from "discord.js";
import { readdirSync } from "fs";

export enum SubserverAccess { Denied, Allowed, Forced }

export interface Subserver {
  id: Snowflake;
  name: string;
  acronym: string;

  // snowflake can either be role id or user id
  staffAccess: Record<Snowflake, {
    access?: SubserverAccess;
    roles?: Snowflake[];
  }>;

  userOverrideNoticeRoleId?: Snowflake;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires -- we can't import this in the file because it's a circular dependency
const subservers = [...require("./overrides").default as Subserver[]];
if (!subservers.length) {
  readdirSync(__dirname)
    .filter(file => file !== "index.ts" && file !== "overrides")
    .forEach(file => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires -- we need this for it to be synchronous
      const subserver = require(`./${file}`).default as Subserver;
      subservers.push(subserver);
    });
}

export default subservers;
