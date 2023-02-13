import type { ButtonComponentData, GuildMember, InteractionReplyOptions, InteractionUpdateOptions } from "discord.js";
import { ButtonStyle, ComponentType } from "discord.js";
import Emojis from "../../constants/emojis";
import { buttonComponents } from "../../handlers/interactions/components";
import { restrictions } from "../../handlers/restrictions";
import type { MenuCommand } from ".";

export default {
  name: "Manage user restrictions",
  type: "user",
  execute(interaction, target) {
    const restrictionStatusRecord: Record<string, boolean> = Object.fromEntries(restrictions.map(restriction => [restriction.name, target.roles.cache.has(restriction.roleId)]));

    restrictions.forEach(({ name, roleId }) => {
      buttonComponents.set(`${interaction.id}:toggle-${name}`, {
        allowedUsers: [interaction.user.id],
        persistent: true,
        callback(button) {
          restrictionStatusRecord[name] = !(restrictionStatusRecord[name] ?? false);

          if (restrictionStatusRecord[name]) void target.roles.add(roleId);
          else void target.roles.remove(roleId);

          void button.update(generateMessage(target, restrictionStatusRecord, interaction.id));
        },
      });
    });

    return void interaction.reply({ ...generateMessage(target, restrictionStatusRecord, interaction.id), ephemeral: true });
  },
} as MenuCommand;

function generateMessage(member: GuildMember, restrictionStatusRecord: Record<string, boolean>, uniqueIdentifier: string): InteractionReplyOptions & InteractionUpdateOptions {
  const buttons: ButtonComponentData[] = restrictions.map(({ name, descriptionAllowed, descriptionDisallowed }) => ({
    type: ComponentType.Button,
    customId: `${uniqueIdentifier}:toggle-${name}`,
    style: restrictionStatusRecord[name] ? ButtonStyle.Danger : ButtonStyle.Success,
    label: restrictionStatusRecord[name] ? descriptionDisallowed : descriptionAllowed,
  }));

  // split buttons into groups of five. copilot made this code, i have no idea how it works
  const buttonGroups = buttons.reduce<ButtonComponentData[][]>((acc, button, index) => {
    if (index % 5 === 0) acc.push([]);
    acc[acc.length - 1]!.push(button);
    return acc;
  }, []);

  return {
    content: `${Emojis.WeeWoo} Manage restrictions for user ${member.toString()}:`,
    components: buttonGroups.map(buttonGroup => ({ type: ComponentType.ActionRow, components: buttonGroup })),
  };
}
