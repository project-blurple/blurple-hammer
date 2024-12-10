import type { DocumentType } from "@typegoose/typegoose";
import type { Snowflake } from "discord.js";
import { getModelForClass, prop } from "@typegoose/typegoose";

export class SubserverAccessOverrideSchema {
  @prop({ type: String, required: true }) issuerId!: Snowflake;
  @prop({ type: String, required: true }) reason!: string;
  @prop({ type: String, required: true }) subserverId!: Snowflake;
  @prop({ type: String, required: true }) userId!: Snowflake;
}

export type SubserverAccessOverrideDocument = DocumentType<SubserverAccessOverrideSchema>;

export const SubserverAccessOverride = getModelForClass(SubserverAccessOverrideSchema);
