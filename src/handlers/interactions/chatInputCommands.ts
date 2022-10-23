import type { ChatInputCommand } from "../../commands/chatInput";
import type { ChatInputCommandInteraction } from "discord.js";
import config from "../../config";
import { inspect } from "util";
import { mainLogger } from "../../utils/logger/main";

export default async function chatInputCommandHandler(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
  const commandSegments = [
    interaction.commandName,
    interaction.options.getSubcommandGroup(false),
    interaction.options.getSubcommand(false),
  ].filter(Boolean) as string[];

  try {
    const { default: command } = await import(`../../commands/chatInput/${commandSegments.join("/")}`) as { default: ChatInputCommand };
    if (command.ownerOnly && interaction.user.id !== config.ownerId) return;

    return await command.execute(interaction);
  } catch (err) {
    mainLogger.info(`Failed to run interaction command /${commandSegments.join(" ")} on interaction ${interaction.id}, channel ${interaction.channelId}, guild ${interaction.guildId}, member ${interaction.user.id}: ${inspect(err)}`);
  }
}
