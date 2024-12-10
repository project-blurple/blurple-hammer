/* eslint-disable max-classes-per-file */
import type { DocumentType } from "@typegoose/typegoose";
import type { Snowflake } from "discord.js";
import { getModelForClass, prop, PropType } from "@typegoose/typegoose";
import type { ZeppelinCaseType } from "../../constants/zeppelinCases";

export class ZeppelinCaseNotesSchema {
  @prop({ type: String, default: null }) body!: null | string;
  @prop({ type: Date, required: true }) createdAt!: Date;
  @prop({ type: String, required: true }) moderatorTag!: string;
}

export class ZeppelinCaseSchema {
  @prop({ type: Number, required: true }) caseNumber!: number;
  @prop({ type: Date, required: true }) createdAt!: Date;
  @prop({ type: Boolean, default: false }) hidden!: boolean;
  @prop({ type: String, required: true }) logMessageId!: Snowflake;
  @prop({ type: String, required: true }) moderatorId!: Snowflake;
  @prop({ type: [ZeppelinCaseNotesSchema], default: [] }, PropType.ARRAY) notes!: ZeppelinCaseNotesSchema[];
  @prop({ type: String, default: null }) ppId!: null | Snowflake;
  @prop({ type: Number, required: true }) type!: ZeppelinCaseType;
  @prop({ type: String, required: true }) userId!: Snowflake;
}

export type ZeppelinCaseDocument = DocumentType<ZeppelinCaseSchema>;

export const ZeppelinCase = getModelForClass(ZeppelinCaseSchema);
