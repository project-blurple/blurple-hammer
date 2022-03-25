import type Roles from "../roles";
import type { Snowflake } from "discord.js";
import staff from "./staff";

export enum Access {
  PROHIBITED,
  OPTIONAL,
  FORCED,
}

export interface Subserver {
  id: Snowflake;
  name: string;
  acronym: string;
  staffAccess: {
    [key in Roles | Snowflake]?: {
      presence?: Access;
      roles?: Array<Snowflake>;
    };
  }
}

export default [staff] as Array<Subserver>;
