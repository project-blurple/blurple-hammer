import type { Subserver } from ".";
import { SubserverAccess } from ".";
import config from "../../config";

enum Roles {
  SuperAdmin = "708630517528002581",
  TeamLeaders = "559336076456755200",
  CreativeTeam = "799262919111344128",
}

const assetsSubserver: Subserver = {
  id: "540758383582511115",
  name: "Blurple Asset Resource Facility",
  acronym: "BARF",

  staffAccess: {
    [config.roles.administrators]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.SuperAdmin, Roles.TeamLeaders],
    },
    [config.roles.teamLeaders]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.TeamLeaders],
    },
    [config.roles.medias]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.CreativeTeam],
    },
  },
};

export default assetsSubserver;
