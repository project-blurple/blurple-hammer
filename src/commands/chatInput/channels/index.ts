import type { FirstLevelChatInputCommand } from "..";
import lock from "./lock";
import unlock from "./unlock";

export default {
  name: "channel",
  description: "Manage channels",
  subcommands: [lock, unlock],
} as FirstLevelChatInputCommand;
