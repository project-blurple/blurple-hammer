/* eslint-disable max-classes-per-file */
import { PropType, getModelForClass, prop } from "@typegoose/typegoose";
import type { DocumentType } from "@typegoose/typegoose";
import type { Snowflake } from "discord.js";

export type AppealType = "ban" | "kick" | "mute" | "warning";
export type AppealAction = "blocked" | "invalid" | "none" | "reduction" | "removal";

class UserSchema {
  @prop({ type: String, required: true }) id!: Snowflake;
  @prop({ type: String, required: true }) tag!: string;
  @prop({ type: String, required: true }) email!: string;
  @prop({ type: String, required: true }) avatarUrl!: string;
}

class FinalResolutionSchema {
  @prop({ type: String, required: true }) staffId!: Snowflake;
  @prop({ type: Date, default: Date.now }) timestamp!: Date;
  @prop({ type: String, required: true }) action!: AppealAction;
  @prop({ type: String, required: true }) reason!: string;
  @prop({ type: String, default: null }) statement!: string | null;
}

class LogEntrySchema {
  @prop({ type: Date, default: Date.now }) timestamp!: Date;
  @prop({ type: String, required: true }) message!: string;
}

export class AppealSchema {
  @prop({ type: Number, required: true }) appealId!: number;
  @prop({ type: Date, default: Date.now }) createdAt!: Date;

  @prop({ type: String, required: true }) type!: AppealType;
  @prop({ type: String, default: null }) caseId!: string | null;

  @prop({ type: UserSchema, required: true }) user!: UserSchema;
  @prop({ type: String, required: true }) userStatement!: string;
  @prop({ type: String, required: true }) userReason!: string;

  @prop({ type: String, default: null }) staffAssigneeId!: Snowflake | null;
  @prop({ type: FinalResolutionSchema, default: null }) finalResolution!: FinalResolutionSchema | null;

  @prop({ type: [LogEntrySchema], default: []}, PropType.ARRAY) logs!: LogEntrySchema[];
  @prop({ type: String, required: true }) messageId!: Snowflake;
}

export type AppealDocument = DocumentType<AppealSchema>;

export const Appeal = getModelForClass(AppealSchema);
