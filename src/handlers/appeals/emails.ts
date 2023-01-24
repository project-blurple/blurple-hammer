import type { AppealAction, AppealDocument } from "../../database/models/Appeal";

export const appealEmailHeader = (appeal: AppealDocument): string => `Hello ${appeal.user.tag},`;
export const appealEmailFooter = [
  "If you have any questions, please contact us via BlurpleMail or send an email to promise@projectblurple.com. Please do not reply to this email as it is not monitored.",
  "Also, if you have feedback on the appeal process, please let us know!",
  "",
  "Best regards,",
  "The Project Blurple Team",
].join("\n");

export const appealEmailConfirmationOnReceive = (appeal: AppealDocument): string => [
  appealEmailHeader(appeal),
  "",
  `This is just an automated message letting you know that we have received your ${appeal.type} appeal, and a staff member will be looking at it as soon as possible.`,
  "Please note that this email does not mean your appeal has been accepted or denied, it is just a confirmation that we have received it.",
  "",
  appealEmailFooter,
].join("\n");

export const appealEmailActionTemplates: Record<AppealAction, (appeal: AppealDocument) => string> = {
  removal: appeal => [
    appealEmailHeader(appeal),
    "We have reviewed your appeal and have decided to remove your punishment.",
    appealEmailFooter,
  ].join("\n\n"),

  reduction: appeal => [
    appealEmailHeader(appeal),
    "We have reviewed your appeal and have decided to reduce your punishment.",
    appealEmailFooter,
  ].join("\n\n"),

  none: appeal => [
    appealEmailHeader(appeal),
    "We have reviewed your appeal and have decided to not take any action. Your punishment will remain in place.",
    appealEmailFooter,
  ].join("\n\n"),

  /* eslint-disable @typescript-eslint/no-unused-vars -- invalid and appeals should be empty to not send an email to the user */
  invalid: _appeal => "",
  blocked: _appeal => "",
};
