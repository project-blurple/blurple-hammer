import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import type { BeAnObject } from "@typegoose/typegoose/lib/types";
import type { Snowflake } from "discord.js";

export class Strip {
  @prop({ type: String, required: true }) userId!: Snowflake;
  @prop({ type: [String], required: true }) roleIds!: Array<Snowflake>;
}

export type StripDocument = DocumentType<Strip, BeAnObject>;
export const StripDatabase = getModelForClass(Strip);
