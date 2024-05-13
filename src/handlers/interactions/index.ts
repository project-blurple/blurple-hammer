import type { Client } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import getAllApplicationCommands from "../../commands/applicationCommands";
import config from "../../config";
import mainLogger from "../../utils/logger/main";
import autocompleteHandler from "./autocompletes";
import chatInputCommandHandler from "./chatInputCommands";
import componentHandler from "./components";
import menuCommandHandler from "./menuCommands";
import modalHandler from "./modals";

export const commandMentions: Record<string, string> = {};

export default function handleInteractions(client: Client<true>): void {
  client.on("interactionCreate", interaction => {
    if (!interaction.inCachedGuild()) return void mainLogger.warn(`Received interaction ${interaction.id} (guild ${interaction.guildId ?? "n/a"}, channel ${interaction.channelId ?? "n/a"}, user ${interaction.user.id}) from uncached guild.`);
    if (interaction.isModalSubmit()) return modalHandler(interaction);
    if (interaction.isMessageComponent()) return componentHandler(interaction);
    if (interaction.isChatInputCommand()) return chatInputCommandHandler(interaction);
    if (interaction.isContextMenuCommand()) return void menuCommandHandler(interaction);
    if (interaction.isAutocomplete()) return void autocompleteHandler(interaction);
  });

  mainLogger.info("Interaction command listener registered.");

  void client.guilds.cache.get(config.mainGuildId)!.commands.set(getAllApplicationCommands()).then(commands => {
    mainLogger.info("Application commands registered.");

    // register command mentions
    commands.forEach(command => {
      commandMentions[command.name] = `</${command.name}:${command.id}>`;
      command.options.filter(option => option.type === ApplicationCommandOptionType.SubcommandGroup || option.type === ApplicationCommandOptionType.Subcommand).forEach(subcommand => {
        commandMentions[`${command.name} ${subcommand.name}`] = `</${command.name} ${subcommand.name}:${command.id}>`;
        if (subcommand.type === ApplicationCommandOptionType.SubcommandGroup && "options" in subcommand) {
          subcommand.options.forEach(subsubcommand => {
            commandMentions[`${command.name} ${subcommand.name} ${subsubcommand.name}`] = `</${command.name} ${subcommand.name} ${subsubcommand.name}:${command.id}>`;
          });
        }
      });
    });
  });
}
