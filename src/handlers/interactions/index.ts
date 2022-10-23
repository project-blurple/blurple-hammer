import type { ApplicationCommandData, ApplicationCommandSubCommandData, ApplicationCommandSubGroupData, Client } from "discord.js";
import { ApplicationCommandOptionType, ApplicationCommandType, InteractionType } from "discord.js";
import type { ChatInputCommand } from "../../commands/chatInput";
import type { ContextMenuCommand } from "../../commands/menu";
import autocompleteHandler from "./autocompletes";
import chatInputCommandHandler from "./chatInputCommands";
import componentHandler from "./components";
import config from "../../config";
import contextMenuCommandHandler from "./contextMenuCommands";
import { inspect } from "util";
import { join } from "path";
import { mainLogger } from "../../utils/logger/main";
import modalHandler from "./modals";
import { readdir } from "fs/promises";

export default function handleInteractions(client: Client<true>): void {
  client.on("interactionCreate", async interaction => {
    if (!interaction.inGuild()) return void mainLogger.info(`Interaction ${interaction.id} is not in a guild`);
    if (!interaction.inCachedGuild()) return void mainLogger.info(`Interaction ${interaction.id} is not in a cached guild (guild ID ${interaction.guildId})`);

    if (interaction.type === InteractionType.ModalSubmit) return modalHandler(interaction);

    if (interaction.type === InteractionType.MessageComponent) {
      if (interaction.isButton() || interaction.isSelectMenu()) componentHandler(interaction);
      return;
    }

    if (interaction.type === InteractionType.ApplicationCommand) {
      if (interaction.isChatInputCommand()) void chatInputCommandHandler(interaction);
      if (interaction.isContextMenuCommand()) void contextMenuCommandHandler(interaction);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- we should still type check this although it's not necessary
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) return autocompleteHandler(interaction);
  });

  mainLogger.info("Interaction command listener registered.");
  registerCommands(client);
}

export const commandMentions: Record<string, string> = {};

function registerCommands(client: Client<true>): void {
  void Promise.all([
    nestCommands("../../commands/chatInput", "CHAT_INPUT"),
    nestCommands("../../commands/menu", "MENU"),
  ])
    .then(([chatInputCommands, contextMenuCommands]) => client.guilds.cache.get(config.guildId)!.commands.set([...chatInputCommands, ...contextMenuCommands]))
    .then(commands => {
      // add command mentions
      commands.forEach(command => {
        commandMentions[command.name] = `</${command.name}:${command.id}>`;
        command.options.filter(option => option.type === ApplicationCommandOptionType.SubcommandGroup || option.type === ApplicationCommandOptionType.Subcommand).forEach(subcommand => {
          commandMentions[`${command.name} ${subcommand.name}`] = `</${command.name} ${subcommand.name}:${command.id}>`;
          if (subcommand.type === ApplicationCommandOptionType.SubcommandGroup) {
            ("options" in subcommand ? subcommand.options : []).forEach(subsubcommand => {
              commandMentions[`${command.name} ${subcommand.name} ${subsubcommand.name}`] = `</${command.name} ${subcommand.name} ${subsubcommand.name}:${command.id}>`;
            });
          }
        });
      });
      void mainLogger.info("Interaction commands have been set.");
    })
    .catch(err => void mainLogger.error(`Error while setting interaction commands: ${inspect(err)}`));
}

async function nestCommands(relativePath: string, type: "CHAT_INPUT" | "MENU"): Promise<ApplicationCommandData[]> {
  const files = await readdir(join(__dirname, relativePath));
  const arr: ApplicationCommandData[] = [];
  for (const fileName of files.filter(file => !file.startsWith("_") && file !== "index.js")) {
    if (type === "MENU") {
      const { default: command } = await import(`${relativePath}/${fileName}`) as { default: ContextMenuCommand };
      arr.push({
        name: fileName.split(".")[0]!,
        type: {
          MESSAGE: ApplicationCommandType.Message,
          USER: ApplicationCommandType.User,
        }[command.type],
        description: "",
      });
    }

    if (type === "CHAT_INPUT") {
      if (fileName.includes(".")) {
        const { default: command } = await import(`${relativePath}/${fileName}`) as { default: ChatInputCommand };
        const name = fileName.split(".")[0]!;
        arr.push({
          name,
          type: ApplicationCommandType.ChatInput,
          description: command.description,
          ...command.options && { options: command.options },
        });
      } else {
        const subCommands = await (async function nestSubCommands(relativeSubPath: string) {
          const subFiles = await readdir(join(__dirname, relativeSubPath));
          const subArr: Array<ApplicationCommandSubCommandData | ApplicationCommandSubGroupData> = [];
          for (const subFileName of subFiles.filter(file => !file.startsWith("_"))) {
            if (subFileName.includes(".")) {
              const { default: command } = await import(`${relativeSubPath}/${subFileName}`) as { default: ChatInputCommand };
              subArr.push({
                type: ApplicationCommandOptionType.Subcommand,
                name: subFileName.split(".")[0]!,
                description: command.description,
                options: command.options ?? [],
              });
            } else {
              const subSubCommands = await nestSubCommands(join(relativeSubPath, subFileName));
              if (subSubCommands.length) {
                subArr.push({
                  type: ApplicationCommandOptionType.SubcommandGroup,
                  name: subFileName,
                  description: "Sub-command",
                  options: subSubCommands as never,
                });
              }
            }
          }
          return subArr;
        })(`${relativePath}/${fileName}`);
        if (subCommands.length) {
          arr.push({
            name: fileName,
            type: ApplicationCommandType.ChatInput,
            description: "Sub-command",
            options: subCommands,
          });
        }
      }
    }
  }

  return arr;
}
