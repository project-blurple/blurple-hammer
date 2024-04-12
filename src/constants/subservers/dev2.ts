import config from "../../config";
import type { Subserver } from ".";
import { SubserverAccess } from ".";

export enum Roles {
  Administrators = "803646089696903209",
  Leadership = "803646635225645076",
  BlurpleStaff = "803646824938340443",
  OverrideRole = "1072136613330702378",
}

const dev2Subserver: Subserver = {
  id: "803645810549981244",
  name: "Blurple Innovative Development Environmental",
  acronym: "BIDE",
  staffAccess: {
    [config.roles.staff.administrators]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Administrators],
    },
    [config.roles.staff.leadership]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Leadership],
    },
    [config.roles.staff.all]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.BlurpleStaff],
    },
  },
  userOverrideNoticeRoleId: Roles.OverrideRole,
};

export default dev2Subserver;
