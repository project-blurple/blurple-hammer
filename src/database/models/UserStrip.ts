import { getModelForClass, prop } from "@typegoose/typegoose";
import type { DocumentType } from "@typegoose/typegoose";
import type { Snowflake } from "discord.js";

export class UserStripSchema {
  @prop({ type: String, required: true }) userId!: Snowflake;
  @prop({ type: [String], required: true }) roleIds!: Snowflake[];
}

export type UserStripDocument = DocumentType<UserStripSchema>;

export const UserStrip = getModelForClass(UserStripSchema);
