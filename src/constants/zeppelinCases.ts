import { Colors } from "discord.js";

export const enum ZeppelinCaseType { Ban = 1, Unban, Note, Warn, Kick, Mute, Unmute, Deleted, Softban }

export const zeppelinCaseTypes: Record<ZeppelinCaseType, {
  name: string;
  color: number;
  hideForUser: boolean;
  appealable: boolean;
}> = {
  [ZeppelinCaseType.Ban]: {
    name: "Ban",
    color: Colors.DarkRed,
    hideForUser: false,
    appealable: true,
  },
  [ZeppelinCaseType.Unban]: {
    name: "Unban",
    color: Colors.Blue,
    hideForUser: false,
    appealable: false,
  },
  [ZeppelinCaseType.Note]: {
    name: "Note",
    color: Colors.LightGrey,
    hideForUser: true,
    appealable: false,
  },
  [ZeppelinCaseType.Warn]: {
    name: "Warn",
    color: Colors.Yellow,
    hideForUser: false,
    appealable: true,
  },
  [ZeppelinCaseType.Kick]: {
    name: "Kick",
    color: Colors.DarkOrange,
    hideForUser: false,
    appealable: true,
  },
  [ZeppelinCaseType.Mute]: {
    name: "Mute",
    color: Colors.Orange,
    hideForUser: false,
    appealable: true,
  },
  [ZeppelinCaseType.Unmute]: {
    name: "Unmute",
    color: Colors.Blue,
    hideForUser: false,
    appealable: false,
  },
  [ZeppelinCaseType.Deleted]: {
    name: "Deleted",
    color: Colors.LightGrey,
    hideForUser: true,
    appealable: false,
  },
  [ZeppelinCaseType.Softban]: {
    name: "Softban",
    color: Colors.DarkRed,
    hideForUser: false,
    appealable: true,
  },
};
