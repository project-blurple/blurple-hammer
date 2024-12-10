import type { Subserver } from ".";
import { SubserverAccess } from ".";
import config from "../../config";

export enum Roles {
  Administrators = "559351138034647070",
  Developer = "559815628953878551",
  Leadership = "1072131732817596509",
  OverrideRole = "837388484565925931",
}

const devSubserver: Subserver = {
  id: "559341262302347314",
  name: "Blurple Application Development",
  acronym: "BAD",
  staffAccess: {
    [config.roles.staff.administrators]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Administrators],
    },
    [config.roles.staff.leadership]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Leadership],
    },
    [config.roles.staff.teams.developer]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Developer],
    },
  },
  userOverrideNoticeRoleId: Roles.OverrideRole,
};

export default devSubserver;
