import config from "../../config";
import type { Subserver } from ".";
import { SubserverAccess } from ".";

export enum Roles {
  FullAccess = "708630517528002581",
  TeamLeaders = "559336076456755200",
  CreativeTeam = "799262919111344128",
  OverrideRole = "1072130561184911481",
}

const assetsSubserver: Subserver = {
  id: "540758383582511115",
  name: "Blurple Asset Resource Facility",
  acronym: "BARF",

  staffAccess: {
    [config.roles.administrators]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.FullAccess, Roles.TeamLeaders],
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
  userOverrideNoticeRoleId: Roles.OverrideRole,
};

export default assetsSubserver;
