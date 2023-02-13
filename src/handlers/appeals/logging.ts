import type { Client, TextChannel } from "discord.js";
import config from "../../config";
import type { AppealDocument } from "../../database/models/Appeal";
import generateAppealMessage from "./messageEntry";

export default function addLogToAppeal(appeal: AppealDocument, message: string, client: Client<true>, updateMessage = true): void {
  appeal.logs.push({ message, timestamp: new Date() });

  void (async () => {
    const appealChannel = client.channels.cache.get(config.channels.appeals) as TextChannel;
    const appealMessage = await appealChannel.messages.fetch(appeal.messageId).catch(() => null);

    if (updateMessage) void appealMessage?.edit(generateAppealMessage(appeal, client));
    void appealMessage?.thread?.send(`**LOG:** ${message}`);
  })();
}
