import type { Subserver } from ".";
import { SubserverAccess } from ".";
import config from "../../config";

enum Roles {
  Administrators = "559351138034647070",
  TeamLeaders = "1072131732817596509",
  Developer = "559815628953878551",
  OverrideRole = "837388484565925931",
}

const devSubserver: Subserver = {
  id: "559341262302347314",
  name: "Blurple Application Development",
  acronym: "BAD",
  staffAccess: {
    [config.roles.administrators]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Administrators, Roles.TeamLeaders],
    },
    [config.roles.teamLeaders]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.TeamLeaders],
    },
    [config.roles.developers]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Developer],
    },
  },
  userOverrideNoticeRoleId: Roles.OverrideRole,
};

export default devSubserver;
