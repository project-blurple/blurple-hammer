import type { ApplicationCommandData, ApplicationCommandPermissionData, ApplicationCommandSubCommandData, ApplicationCommandSubGroupData, Client, GuildApplicationCommandPermissionData } from "discord.js";
import { PermissionLevel, rolePermissions } from "../../constants/permissions";
import { SlashCommand, permissions } from "../../commands/slash";
import type { ContextMenuCommand } from "../../commands/menu";
import autocompleteHandler from "./autocompletes";
import commandHandler from "./commands";
import componentHandler from "./components";
import config from "../../config";
import contextMenuHandler from "./contextMenus";
import { hammerLogger } from "../../utils/logger";
import { join } from "path";
import { readdir } from "fs/promises";

export default async (client: Client<true>) => {
  hammerLogger.info("Loading interaction commands...");
  const start = Date.now();

  const [slashCommandsMain, slashCommandsAll] = await readdir(join(__dirname, "../../commands/slash")).then(async files => {
    const commandsMain: Array<ApplicationCommandData> = [];
    const commandsAll: Array<ApplicationCommandData> = [];
    for (const file of files.filter(file => !file.startsWith("_") && file !== "index.js")) {
      const path = join(__dirname, "../../commands/slash", file);
      const name = file.replace(".js", "");
      if (file.endsWith(".js")) {
        const command = (await import(path)).default as SlashCommand;
        const commandData: ApplicationCommandData = {
          type: "CHAT_INPUT",
          name,
          description: command.description,
          ...command.options && { options: command.options },
          defaultPermission: (permissions[name] || PermissionLevel.NONE) === PermissionLevel.NONE,
        };
        commandsMain.push(commandData);
        if (!command.onlyInMainServer) commandsAll.push(commandData);
      } else {
        const [subCommandsMain, subCommandsAll] = await (async function nestSubCommands(path: string) {
          const files = await readdir(path);
          const subCommandsMain: Array<ApplicationCommandSubCommandData | ApplicationCommandSubGroupData> = [];
          const subCommandsAll: Array<ApplicationCommandSubCommandData | ApplicationCommandSubGroupData> = [];
          for (const file of files.filter(file => !file.startsWith("_"))) {
            const name = file.replace(".js", "");
            if (file.endsWith(".js")) {
              const command = (await import(join(path, file))).default as SlashCommand;
              const commandData: ApplicationCommandSubCommandData = {
                type: "SUB_COMMAND",
                name,
                description: command.description,
                ...command.options && { options: command.options },
              };
              subCommandsMain.push(commandData);
              if (!command.onlyInMainServer) subCommandsAll.push(commandData);
            } else {
              const commandData: ApplicationCommandSubGroupData = {
                type: "SUB_COMMAND_GROUP",
                name,
                description: "Sub-command",
              };
              const [subSubCommandsMain, subSubCommandsAll] = await nestSubCommands(join(path, file)) as [Array<ApplicationCommandSubCommandData>, Array<ApplicationCommandSubCommandData>];
              if (subSubCommandsMain.length) subCommandsMain.push({ ...commandData, options: subSubCommandsMain });
              if (subSubCommandsAll.length) subCommandsAll.push({ ...commandData, options: subSubCommandsAll });
            }
          }
          return [subCommandsMain, subCommandsAll];
        })(path);
        const commandData: ApplicationCommandData = {
          type: "CHAT_INPUT",
          name,
          description: "Sub-command",
          defaultPermission: (permissions[name] || PermissionLevel.NONE) === PermissionLevel.NONE,
        };
        if (subCommandsMain.length) commandsMain.push({ ...commandData, options: subCommandsMain });
        if (subCommandsAll.length) commandsAll.push({ ...commandData, options: subCommandsAll });
      }
    }
    return [commandsMain, commandsAll];
  });

  const [menuCommandsMain, menuCommandsAll] = await readdir(join(__dirname, "../../commands/menu")).then(async files => {
    const commandsMain: Array<ApplicationCommandData> = [];
    const commandsAll: Array<ApplicationCommandData> = [];
    for (const file of files.filter(file => file.endsWith(".js") && !file.startsWith("_") && file !== "index.js")) {
      const command = (await import(join(__dirname, "../../commands/menu", file))).default as ContextMenuCommand;
      const name = file.replace(".js", "");
      const commandData: ApplicationCommandData = {
        type: command.type,
        name,
        description: "",
        defaultPermission: command.permissionLevelRequired === PermissionLevel.NONE,
      };
      commandsMain.push(commandData);
      if (!command.onlyInMainServer) commandsAll.push(commandData);
    }
    return [commandsMain, commandsAll];
  });

  const [commandsMain, commandsAll] = [
    [...slashCommandsMain, ...menuCommandsMain],
    [...slashCommandsAll, ...menuCommandsAll],
  ];
  await Promise.all(client.guilds.cache.map(guild => guild.commands.set(guild.id === config.guildId ? commandsMain : commandsAll).then(async commands => {
    if (guild.id === config.guildId) {
      const fullPermissions = await Promise.all(commands.map(async ({ name, id, type }) => {
        let permissionLevel = PermissionLevel.NONE;
        if (type === "CHAT_INPUT") permissionLevel = permissions[name] || PermissionLevel.NONE;
        else if (type === "MESSAGE" || type === "USER") {
          const command = (await import(join(__dirname, "../../commands/menu", `${name}`))).default as ContextMenuCommand;
          permissionLevel = command.permissionLevelRequired || PermissionLevel.NONE;
        }
        if (permissionLevel === PermissionLevel.NONE) return null;
        const permissionsData: Array<ApplicationCommandPermissionData> = [];
        if (permissionLevel === PermissionLevel.BOT_OWNER) permissionsData.push({ type: "USER", id: config.ownerId, permission: true });
        for (const [roleId, rolePermission] of Object.entries(rolePermissions)) if (rolePermission >= permissionLevel) permissionsData.push({ type: "ROLE", id: roleId, permission: true });
        return { id, permissions: permissionsData };
      })).then(permissions => permissions.filter(Boolean)) as Array<GuildApplicationCommandPermissionData>;
      await guild.commands.permissions.set({ fullPermissions });
    }
  })));

  hammerLogger.info(`Loaded commands in ${Date.now() - start}ms.`);

  client.on("interactionCreate", interaction => {
    if (interaction.isMessageComponent()) {
      if (interaction.isButton() || interaction.isSelectMenu()) return componentHandler(interaction);
    }

    if (interaction.isApplicationCommand()) {
      if (!interaction.guildId) return; // ignore DM interactions

      if (interaction.isCommand()) return commandHandler(interaction);
      if (interaction.isContextMenu()) return contextMenuHandler(interaction);
    }

    if (interaction.isAutocomplete()) return autocompleteHandler(interaction);
  });
};
