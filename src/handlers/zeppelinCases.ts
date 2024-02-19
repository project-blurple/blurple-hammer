import { inspect } from "util";
import type { Client, Message, PartialMessage } from "discord.js";
import config from "../config";
import type { ZeppelinCaseType } from "../constants/zeppelinCases";
import { zeppelinCaseTypes } from "../constants/zeppelinCases";
import type { ZeppelinCaseNotesSchema } from "../database/models/ZeppelinCase";
import { ZeppelinCase } from "../database/models/ZeppelinCase";
import mainLogger from "../utils/logger/main";

export default function handleZeppelinCases(client: Client<true>): void {
  client.on("messageCreate", message => checkMessage(message));
  client.on("messageUpdate", (_, message) => checkMessage(message as never));
}

function checkMessage(partialMessage: Message | PartialMessage): void {
  return void (async () => {
    if (partialMessage.channelId !== config.channels.zeppelinCaseLog) return;
    const message = partialMessage.partial ? await partialMessage.fetch() : partialMessage;
    if (message.webhookId && message.embeds[0]) {
      const [possibleCaseEmbed] = message.embeds;
      try {
        const [matchedCaseType, matchedCaseNumber, matchedCaseHidden] = possibleCaseEmbed.title?.match(/(\w+) - Case #(\d+)( \(hidden\))?/u)?.slice(1) ?? [];
        const [matchedDateFormatted] = possibleCaseEmbed.footer?.text.match(/Case created on (.+)/u)?.slice(1) ?? [];
        const [matchedUser] = possibleCaseEmbed.fields[0]?.value?.match(/<@!(\d+)>/um)?.slice(1) ?? [];
        const [matchedModerator] = possibleCaseEmbed.fields[1]?.value?.match(/<@!(\d+)>/um)?.slice(1) ?? [];
        const [matchedPpModerator] = possibleCaseEmbed.fields[1]?.value?.match(/p\.p\. (.+)\n<@!(\d+)>/um)?.slice(2) ?? [];
        const matchedNotes = possibleCaseEmbed.fields.slice(2).filter(field => field.name.includes(" at "));

        const caseType = Number(Object.entries(zeppelinCaseTypes).find(([, { name }]) => name.toLowerCase() === matchedCaseType!.toLowerCase())![0]) as ZeppelinCaseType;
        const caseNumber = Number(matchedCaseNumber);
        const caseHidden = Boolean(matchedCaseHidden);
        const dateFormatted = new Date(matchedDateFormatted!.replace(" at ", ", "));
        const user = matchedUser!;
        const moderator = matchedModerator!;
        const actualModerator = matchedPpModerator;
        const notes = matchedNotes.map<ZeppelinCaseNotesSchema>(note => ({
          moderatorTag: note.name.split(" at ")[0]!,
          body: note.value.replace(/__\[(.+)\]__/gu, "").trim() || null,
          createdAt: new Date((/ at (.+):/u).exec(note.name)![1]!.replace(" at ", ", ")),
        }));

        const zeppelinCase = await ZeppelinCase.findOne({ caseNumber }) ?? new ZeppelinCase();

        zeppelinCase.caseNumber = caseNumber;
        zeppelinCase.userId = user;
        zeppelinCase.moderatorId = moderator;
        zeppelinCase.ppId = actualModerator ?? null;
        zeppelinCase.type = caseType;
        zeppelinCase.createdAt = dateFormatted;
        zeppelinCase.hidden = caseHidden;
        zeppelinCase.logMessageId = message.id;
        zeppelinCase.notes = notes;

        await zeppelinCase.save();
        mainLogger.debug(`Saved Zeppelin case ${caseNumber} from message ${message.url}`);
      } catch (err) {
        // not a zeppelin case
        mainLogger.debug(`Message ${message.url} is not a Zeppelin case: ${inspect(err)}`);
      }
    }
  })();
}
