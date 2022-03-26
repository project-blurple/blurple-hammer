import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import type { BeAnObject } from "@typegoose/typegoose/lib/types";
import type { Snowflake } from "discord.js";

export class OAuthTokens {
  @prop({ type: String, required: true }) userId!: Snowflake;
  @prop({ type: String, required: true }) accessToken!: string;
  @prop({ type: String, required: true }) refreshToken!: string;
}

export type OAuthTokensDocument = DocumentType<OAuthTokens, BeAnObject>;
export const OAuthTokensDatabase = getModelForClass(OAuthTokens);
