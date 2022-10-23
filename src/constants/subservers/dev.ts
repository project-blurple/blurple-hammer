import { Access } from ".";
import type { Subserver } from ".";
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
      access: Access.Allowed,
      roles: [Roles.Management],
    },
    [config.roles.teamLeaders]: {
      access: Access.Allowed,
      roles: [Roles.Management],
    },
    [config.roles.leadershipStaff]: {
      access: Access.Allowed,
      roles: [Roles.Management],
    },
    [config.roles.developers]: {
      access: Access.Allowed,
      roles: [Roles.Developer],
    },
  },
};

export default devSubserver;
