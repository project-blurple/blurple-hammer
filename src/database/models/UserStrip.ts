import type { DocumentType } from "@typegoose/typegoose";
import type { Snowflake } from "discord.js";
import { getModelForClass, prop, PropType } from "@typegoose/typegoose";

export class UserStripSchema {
  @prop({ type: [String], required: true }, PropType.ARRAY) roleIds!: Snowflake[];
  @prop({ type: String, required: true }) userId!: Snowflake;
}

export type UserStripDocument = DocumentType<UserStripSchema>;

export const UserStrip = getModelForClass(UserStripSchema);
