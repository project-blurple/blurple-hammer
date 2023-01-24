import type { Client, Snowflake, TextChannel } from "discord.js";
import { Appeal } from "../../database/models/Appeal";
import type { AppealType } from "../../database/models/Appeal";
import { ThreadAutoArchiveDuration } from "discord.js";
import { appealEmailConfirmationOnReceive } from "./emails";
import config from "../../config";
import generateAppealMessage from "./messageEntry";
import { inspect } from "util";
import { mainLogger } from "../../utils/logger/main";
import registerAppealButtons from "./buttons";
import { sendMail } from "../../utils/mail";

export default function handleAppeals(client: Client<true>): void {
  void Appeal.find().then(appeals => appeals.forEach(appeal => {
    registerAppealButtons(appeal, client);
  }));

  // the appeals handler doesn't really need the client, but it's here for consistency between the handlers
  void client.channels.fetch(config.channels.appeals).catch(err => {
    mainLogger.warn(`Appeals channel not found, error: ${inspect(err)}`);
  });
}

export function createNewAppeal(user: { id: Snowflake; tag: string; email: string; avatarUrl: string }, userAppeal: { type: AppealType; caseId: string | null; userStatement: string; userReason: string }, client: Client<true>): void {
  void Appeal.count().then(async count => {
    const appeal = new Appeal({ appealId: count + 1, user, ...userAppeal });

    void sendMail([user.tag, user.email], `Appeal #${appeal.appealId} has been received`, appealEmailConfirmationOnReceive(appeal));

    const appealChannel = client.channels.cache.get(config.channels.appeals) as TextChannel;
    const message = await appealChannel.send(generateAppealMessage(appeal, client));

    appeal.messageId = message.id;
    void appeal.save();

    void message.startThread({ name: `#${appeal.appealId}, ${appeal.user.tag}`, autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek });
  });
}
