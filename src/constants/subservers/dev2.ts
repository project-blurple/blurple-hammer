import type { Subserver } from ".";
import { SubserverAccess } from ".";
import config from "../../config";

// todo: add roles after refining server
// enum Roles {}

const dev2Subserver: Subserver = {
  id: "803645810549981244",
  name: "Blurple Innovative Development Environmental",
  acronym: "BIDE",
  staffAccess: {
    [config.roles.administrators]: {
      access: SubserverAccess.Allowed,
    },
    [config.roles.teamLeaders]: {
      access: SubserverAccess.Allowed,
    },
    [config.roles.leadershipStaff]: {
      access: SubserverAccess.Allowed,
    },
    [config.roles.developers]: {
      access: SubserverAccess.Allowed,
    },
  },
};

export default dev2Subserver;
