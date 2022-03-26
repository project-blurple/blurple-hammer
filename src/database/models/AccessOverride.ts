import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import type { BeAnObject } from "@typegoose/typegoose/lib/types";
import type { Snowflake } from "discord.js";
import type { Subserver } from "../../constants/subservers";

export class AccessOverride {
  @prop({ type: String, required: true }) userId!: Snowflake;
  @prop({ type: String, required: true }) subserverId!: Subserver["id"];
  @prop({ type: String, required: true }) issuedById!: Snowflake;
  @prop({ type: Date, default: Date.now }) issuedAt!: Date;
}

export type AccessOverrideDocument = DocumentType<AccessOverride, BeAnObject>;
export const AccessOverrideDatabase = getModelForClass(AccessOverride);
