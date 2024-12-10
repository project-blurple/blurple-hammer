import type { DocumentType } from "@typegoose/typegoose";
import type { Snowflake } from "discord.js";
import { getModelForClass, prop } from "@typegoose/typegoose";

export class OAuthTokensSchema {
  @prop({ type: String, required: true }) accessToken!: string;
  @prop({ type: String, required: true }) refreshToken!: string;
  @prop({ type: String, required: true }) userId!: Snowflake;
}

export type OAuthTokensDocument = DocumentType<OAuthTokensSchema>;

export const OAuthTokens = getModelForClass(OAuthTokensSchema);
