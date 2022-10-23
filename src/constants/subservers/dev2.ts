import { Access } from ".";
import type { Subserver } from ".";
import config from "../../config";

// todo: add roles after refining server
// enum Roles {}

const dev2Subserver: Subserver = {
  id: "803645810549981244",
  name: "Blurple Innovative Development Environmental",
  acronym: "BIDE",
  staffAccess: {
    [config.roles.administrators]: {
      access: Access.Allowed,
    },
    [config.roles.teamLeaders]: {
      access: Access.Allowed,
    },
    [config.roles.leadershipStaff]: {
      access: Access.Allowed,
    },
    [config.roles.developers]: {
      access: Access.Allowed,
    },
  },
};

export default dev2Subserver;
