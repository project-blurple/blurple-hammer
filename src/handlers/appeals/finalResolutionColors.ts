import type { AppealAction } from "../../database/models/Appeal";
import { Colors } from "discord.js";

export const finalResolutionColors: Record<AppealAction, number> = {
  blocked: Colors.DarkRed,
  invalid: Colors.Fuchsia,
  none: Colors.LightGrey,
  reduction: Colors.Orange,
  removal: Colors.Green,
};
