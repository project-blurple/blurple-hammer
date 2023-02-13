import config from "../../config";
import { Roles as MinecraftRoles } from "./minecraft";
import type { Subserver } from ".";
import { SubserverAccess } from ".";

export enum Roles {
  Administrator = "573193684296925204",
  TeamLeader = "573176976454713344",
  Leadership = "573176977045979147",
  Moderator = "573176977683644450",
  Developer = "573223306627514386",
  CreativeTeam = "573355860584038400",
  EventsTeam = "972864361293029406",
  MinecraftTeam = "701872110754070590",
  MinecraftManagement = "573177129693609984",
}

const staffSubserver: Subserver = {
  id: "573169434227900417",
  name: "Blurple Analogous Staff Environment",
  acronym: "BASE",
  staffAccess: {
    [config.roles.administrators]: {
      access: SubserverAccess.Forced,
      roles: [Roles.Administrator],
    },
    [config.roles.teamLeaders]: {
      access: SubserverAccess.Forced,
      roles: [Roles.TeamLeader],
    },
    [config.roles.leadershipStaff]: {
      access: SubserverAccess.Forced,
      roles: [Roles.Leadership],
    },
    [config.roles.moderationStaff]: {
      access: SubserverAccess.Forced,
      roles: [Roles.Moderator],
    },
    [config.roles.developers]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Developer],
    },
    [config.roles.medias]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.CreativeTeam],
    },
    [config.roles.supportStaff]: {
      access: SubserverAccess.Allowed,
      // no roles as they are either a developer or a media team member
    },
    [config.roles.eventsTeam]: {
      roles: [Roles.EventsTeam],
    },
    [config.roles.minecraftTeam]: {
      roles: [Roles.MinecraftTeam],
    },
    [MinecraftRoles.MinecraftManagement]: {
      roles: [Roles.MinecraftManagement],
    },
  },
};

export default staffSubserver;
