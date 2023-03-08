/* eslint-disable max-classes-per-file */
import type { DocumentType } from "@typegoose/typegoose";
import { PropType, getModelForClass, prop } from "@typegoose/typegoose";
import type { Snowflake } from "discord.js";
import type { ZeppelinCaseType } from "../../constants/zeppelinCases";

export class ZeppelinCaseNotesSchema {
  @prop({ type: String, required: true }) moderatorTag!: string;
  @prop({ type: String, default: null }) body!: string | null;
  @prop({ type: Date, required: true }) createdAt!: Date;
}

export class ZeppelinCaseSchema {
  @prop({ type: Number, required: true }) caseNumber!: number;
  @prop({ type: String, required: true }) userId!: Snowflake;
  @prop({ type: String, required: true }) moderatorId!: Snowflake;
  @prop({ type: String, default: null }) ppId!: Snowflake | null;
  @prop({ type: Number, required: true }) type!: ZeppelinCaseType;
  @prop({ type: Date, required: true }) createdAt!: Date;
  @prop({ type: Boolean, default: false }) hidden!: boolean;
  @prop({ type: String, required: true }) logMessageId!: Snowflake;
  @prop({ type: [ZeppelinCaseNotesSchema], default: [] }, PropType.ARRAY) notes!: ZeppelinCaseNotesSchema[];
}

export type ZeppelinCaseDocument = DocumentType<ZeppelinCaseSchema>;

export const ZeppelinCase = getModelForClass(ZeppelinCaseSchema);
