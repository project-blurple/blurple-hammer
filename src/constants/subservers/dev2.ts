import { Access, Subserver } from ".";
import Roles from "../roles";

export enum SubserverRoles {
  // todo: add roles after refining server
}

const subserver: Subserver = {
  id: "803645810549981244",
  name: "Blurple Innovative Development Environmental",
  acronym: "BIDE",
  staffAccess: {
    [Roles.ADMINISTRATORS]: {
      presence: Access.OPTIONAL,
    },
    [Roles.TEAM_LEADERS]: {
      presence: Access.OPTIONAL,
    },
    [Roles.LEADERSHIP_STAFF]: {
      presence: Access.OPTIONAL,
    },
    [Roles.DEVELOPER]: {
      presence: Access.OPTIONAL,
    },
  },
};

export default subserver;
