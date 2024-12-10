import type { Subserver } from ".";
import { SubserverAccess } from ".";
import config from "../../config";
import { Roles as MinecraftRoles } from "./minecraft";

export enum Roles {
  Administrator = "573193684296925204",
  BlurpleStaff = "1228258710233546793",
  Designer = "573355860584038400",
  Developer = "573223306627514386",
  Events = "972864361293029406",
  GiveawayManagement = "972803140296511488",
  Leadership = "573176977045979147",
  Minecraft = "701872110754070590",
  MinecraftManagement = "573177129693609984",
  Moderator = "573176977683644450",
  Modmails = "1236769849426968689",
  PartnershipManagement = "840532265167486978",
}

const staffSubserver: Subserver = {
  id: "573169434227900417",
  name: "Blurple Analogous Staff Environment",
  acronym: "BASE",
  staffAccess: {
    [config.roles.staff.administrators]: {
      access: SubserverAccess.Forced,
      roles: [Roles.Administrator],
    },
    [config.roles.staff.leadership]: {
      access: SubserverAccess.Forced,
      roles: [Roles.Leadership],
    },
    [config.roles.staff.all]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.BlurpleStaff],
    },
    [config.roles.staff.teams.moderation]: { access: SubserverAccess.Forced, roles: [Roles.Moderator] },
    [config.roles.staff.teams.developer]: { roles: [Roles.Developer] },
    [config.roles.staff.teams.designer]: { roles: [Roles.Designer] },
    [config.roles.staff.teams.events]: { roles: [Roles.Events] },
    [config.roles.staff.teams.giveaways]: { access: SubserverAccess.Forced, roles: [Roles.GiveawayManagement] },
    [config.roles.staff.teams.minecraft]: { access: SubserverAccess.Forced, roles: [Roles.Minecraft] },
    [config.roles.staff.teams.modmails]: { access: SubserverAccess.Forced, roles: [Roles.Modmails] },
    [config.roles.staff.teams.partnerships]: { access: SubserverAccess.Forced, roles: [Roles.PartnershipManagement] },
    [MinecraftRoles.MinecraftManagement]: { roles: [Roles.MinecraftManagement] },
  },
};

export default staffSubserver;
