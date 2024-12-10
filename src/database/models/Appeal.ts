/* eslint-disable max-classes-per-file */
import type { DocumentType } from "@typegoose/typegoose";
import type { Snowflake } from "discord.js";
import { getModelForClass, prop, PropType } from "@typegoose/typegoose";

export type AppealType = "ban" | "kick" | "mute" | "warning";
export type AppealAction = "blocked" | "invalid" | "none" | "reduction" | "removal";

class UserSchema {
  @prop({ type: String, required: true }) avatarUrl!: string;
  @prop({ type: String, required: true }) email!: string;
  @prop({ type: String, required: true }) id!: Snowflake;
  @prop({ type: String, required: true }) tag!: string;
}

class FinalResolutionSchema {
  @prop({ type: String, required: true }) action!: AppealAction;
  @prop({ type: String, required: true }) reason!: string;
  @prop({ type: String, required: true }) staffId!: Snowflake;
  @prop({ type: String, default: null }) statement!: null | string;
  @prop({ type: Date, default: Date.now }) timestamp!: Date;
}

class LogEntrySchema {
  @prop({ type: String, required: true }) message!: string;
  @prop({ type: Date, default: Date.now }) timestamp!: Date;
}

export class AppealSchema {
  @prop({ type: Number, required: true }) appealId!: number;
  @prop({ type: String, default: null }) caseId!: null | string;

  @prop({ type: Date, default: Date.now }) createdAt!: Date;
  @prop({ type: FinalResolutionSchema, default: null }) finalResolution!: FinalResolutionSchema | null;

  @prop({ type: [LogEntrySchema], default: [] }, PropType.ARRAY) logs!: LogEntrySchema[];
  @prop({ type: String, required: true }) messageId!: Snowflake;
  @prop({ type: String, default: null }) staffAssigneeId!: null | Snowflake;

  @prop({ type: String, required: true }) type!: AppealType;
  @prop({ type: UserSchema, required: true }) user!: UserSchema;

  @prop({ type: String, required: true }) userReason!: string;
  @prop({ type: String, required: true }) userStatement!: string;
}

export type AppealDocument = DocumentType<AppealSchema>;

export const Appeal = getModelForClass(AppealSchema);
