import type { Subserver } from ".";
import { SubserverAccess } from ".";
import config from "../../config";

export enum Roles {
  Administrator = "708630517528002581",
  Designer = "799262919111344128",
  Leadership = "559336076456755200",
  OverrideRole = "1072130561184911481",
}

const assetsSubserver: Subserver = {
  id: "540758383582511115",
  name: "Blurple Asset Resource Facility",
  acronym: "BARF",

  staffAccess: {
    [config.roles.staff.administrators]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Administrator],
    },
    [config.roles.staff.leadership]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Leadership],
    },
    [config.roles.staff.teams.designer]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Designer],
    },
  },
  userOverrideNoticeRoleId: Roles.OverrideRole,
};

export default assetsSubserver;
