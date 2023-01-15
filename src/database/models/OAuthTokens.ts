import { getModelForClass, prop } from "@typegoose/typegoose";
import type { DocumentType } from "@typegoose/typegoose";
import type { Snowflake } from "discord.js";

export class OAuthTokensSchema {
  @prop({ type: String, required: true }) userId!: Snowflake;
  @prop({ type: String, required: true }) accessToken!: string;
  @prop({ type: String, required: true }) refreshToken!: string;
}

export type OAuthTokensDocument = DocumentType<OAuthTokensSchema>;

export const OAuthTokens = getModelForClass(OAuthTokensSchema);
