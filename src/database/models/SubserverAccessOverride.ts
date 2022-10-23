import { getModelForClass, prop } from "@typegoose/typegoose";
import type { DocumentType } from "@typegoose/typegoose";
import type { Snowflake } from "discord.js";

export class SubserverAccessOverrideSchema {
  @prop({ type: String, required: true }) userId!: Snowflake;
  @prop({ type: String, required: true }) subserverId!: Snowflake;
  @prop({ type: String, required: true }) issuerId!: Snowflake;
  @prop({ type: String, required: true }) reason!: string;
}

export type SubserverAccessOverrideDocument = DocumentType<SubserverAccessOverrideSchema>;

export const SubserverAccessOverride = getModelForClass(SubserverAccessOverrideSchema);
