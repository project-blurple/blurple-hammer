import type { Subserver } from ".";
import { SubserverAccess } from ".";
import config from "../../config";

export enum Roles {
  Administrators = "803646089696903209",
  TeamLeaders = "803646289014423562",
  Leadership = "803646635225645076",
  Moderation = "803646383600959489",
  Support = "803646824938340443",
  OverrideRole = "1072136613330702378",
}

const dev2Subserver: Subserver = {
  id: "803645810549981244",
  name: "Blurple Innovative Development Environmental",
  acronym: "BIDE",
  staffAccess: {
    [config.roles.administrators]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Administrators, Roles.TeamLeaders],
    },
    [config.roles.teamLeaders]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.TeamLeaders],
    },
    [config.roles.leadershipStaff]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Leadership],
    },
    [config.roles.moderationStaff]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Moderation],
    },
    [config.roles.supportStaff]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Support],
    },
  },
  userOverrideNoticeRoleId: Roles.OverrideRole,
};

export default dev2Subserver;
