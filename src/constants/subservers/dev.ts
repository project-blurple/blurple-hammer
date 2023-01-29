import type { Subserver } from ".";
import { SubserverAccess } from ".";
import config from "../../config";

enum Roles {
  Management = "559351138034647070",
  Developer = "559815628953878551",
}

const devSubserver: Subserver = {
  id: "559341262302347314",
  name: "Blurple Application Development",
  acronym: "BAD",
  staffAccess: {
    [config.roles.administrators]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Management],
    },
    [config.roles.teamLeaders]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Management],
    },
    [config.roles.leadershipStaff]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Management],
    },
    [config.roles.developers]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Developer],
    },
  },
};

export default devSubserver;
