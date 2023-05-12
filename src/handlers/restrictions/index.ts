import type { Client, Snowflake } from "discord.js";
import config from "../../config";
import handleNicknameRestriction from "./nickname";
import handleReactionsRestriction from "./reactions";

export default function handleRestrictions(client: Client<true>): void {
  handleNicknameRestriction(client);
  handleReactionsRestriction(client);
}

export const restrictions: Array<{
  name: string;
  description: string;
  descriptionAllowed: string;
  descriptionDisallowed: string;
  roleId: Snowflake;
}> = [
  {
    name: "embed",
    description: "Disallow the use of embeds",
    descriptionAllowed: "Can use embeds",
    descriptionDisallowed: "Cannot use embeds",
    roleId: config.roles.restrictions.nick,
  },
  {
    name: "reactions",
    description: "Disallow adding reactions",
    descriptionAllowed: "Can add reactions",
    descriptionDisallowed: "Cannot add reactions",
    roleId: config.roles.restrictions.reactions,
  },
  {
    name: "bots",
    description: "Disallow using bot commands",
    descriptionAllowed: "Can use bot commands",
    descriptionDisallowed: "Cannot use bot commands",
    roleId: config.roles.restrictions.bots,
  },
  {
    name: "vad",
    description: "Disallow voice activity detection",
    descriptionAllowed: "Can use voice activity detection",
    descriptionDisallowed: "Cannot use voice activity detection",
    roleId: config.roles.restrictions.vad,
  },
  {
    name: "nick",
    description: "Disallow nickname change",
    descriptionAllowed: "Can change nickname",
    descriptionDisallowed: "Cannot change nickname",
    roleId: config.roles.restrictions.nick,
  },
  {
    name: "soundboard",
    description: "Disallow soundboard",
    descriptionAllowed: "Can use soundboard",
    descriptionDisallowed: "Cannot use soundboard",
    roleId: config.roles.restrictions.soundboard,
  },
];
