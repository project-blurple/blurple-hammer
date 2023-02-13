import { Colors } from "discord.js";
import type { AppealAction } from "../../database/models/Appeal";

export default {
  blocked: Colors.DarkRed,
  invalid: Colors.Fuchsia,
  none: Colors.LightGrey,
  reduction: Colors.Orange,
  removal: Colors.Green,
} satisfies Record<AppealAction, number>;
