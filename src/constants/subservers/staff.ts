import { Access } from ".";
import type { Subserver } from ".";
import config from "../../config";

enum Roles {
  Administrator = "573193684296925204",
  TeamLeader = "573176976454713344",
  Leadership = "573176977045979147",
  Moderator = "573176977683644450",
  Developer = "573223306627514386",
  CreativeTeam = "573355860584038400",
}

const staffSubserver: Subserver = {
  id: "573169434227900417",
  name: "Blurple Analogous Staff Environment",
  acronym: "BASE",
  staffAccess: {
    [config.roles.administrators]: {
      access: Access.Forced,
      roles: [Roles.Administrator],
    },
    [config.roles.teamLeaders]: {
      access: Access.Forced,
      roles: [Roles.TeamLeader],
    },
    [config.roles.leadershipStaff]: {
      access: Access.Forced,
      roles: [Roles.Leadership],
    },
    [config.roles.moderationStaff]: {
      access: Access.Forced,
      roles: [Roles.Moderator],
    },
    [config.roles.developers]: {
      access: Access.Allowed,
      roles: [Roles.Developer],
    },
    [config.roles.medias]: {
      access: Access.Allowed,
      roles: [Roles.CreativeTeam],
    },
    [config.roles.supportStaff]: {
      access: Access.Allowed,
      // no roles as they are either a developer or a media team member
    },
  },
};

export default staffSubserver;
