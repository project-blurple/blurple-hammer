import type { Client } from "discord.js";
import autocompleteHandler from "./autocompletes";
import commandHandler from "./commands";
import componentHandler from "./components";
import contextMenuHandler from "./contextMenus";

export default (client: Client<true>) => {
  client.guilds.cache.forEach(guild => guild.commands.set([
    // todo
  ]));

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
