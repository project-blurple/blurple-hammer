import type Roles from "../roles";
import type { Snowflake } from "discord.js";
import assets from "./assets";
import dev from "./dev";
import dev2 from "./dev2";
import minecraft from "./minecraft";
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

export default [assets, dev, dev2, minecraft, staff] as Array<Subserver>;
