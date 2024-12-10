import type { Client, Snowflake, TextChannel } from "discord.js";
import { ThreadAutoArchiveDuration } from "discord.js";
import { inspect } from "util";
import type { AppealType } from "../../database/models/Appeal";
import config from "../../config";
import { Appeal } from "../../database/models/Appeal";
import mainLogger from "../../utils/logger/main";
import { sendMail } from "../../utils/mail";
import registerAppealButtons from "./buttons";
import { appealEmailConfirmationOnReceive } from "./emails";
import generateAppealMessage from "./messageEntry";

export default function handleAppeals(client: Client<true>): void {
  void Appeal.find().then(appeals => appeals.forEach(appeal => {
    registerAppealButtons(appeal, client);
  }));

  // the appeals handler doesn't really need the client, but it's here for consistency between the handlers
  void client.channels.fetch(config.channels.appeals).catch((err: unknown) => {
    mainLogger.warn(`Appeals channel not found, error: ${inspect(err)}`);
  });
}

export function createNewAppeal(user: { avatarUrl: string; email: string; id: Snowflake; tag: string }, userAppeal: { caseId: null | string; type: AppealType; userReason: string; userStatement: string }, client: Client<true>): void {
  void Appeal.countDocuments().then(async count => {
    const appeal = new Appeal({ appealId: count + 1, user, ...userAppeal });

    void sendMail([user.tag, user.email], `Appeal #${appeal.appealId} has been received`, appealEmailConfirmationOnReceive(appeal));

    const appealChannel = client.channels.cache.get(config.channels.appeals) as TextChannel;
    const message = await appealChannel.send(generateAppealMessage(appeal, client));

    appeal.messageId = message.id;
    void appeal.save();

    void message.startThread({ name: `#${appeal.appealId}, ${appeal.user.tag}`, autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek });
  });
}
