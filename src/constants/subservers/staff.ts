import { Access, Subserver } from ".";
import Roles from "../roles";

export enum SubserverRoles {
  // todo: add roles after refining server
}

const subserver: Subserver = {
  id: "573169434227900417",
  name: "Blurple Analogous Staff Environment",
  acronym: "BASE",
  staffAccess: {
    [Roles.ADMINISTRATORS]: {
      presence: Access.FORCED,
      roles: [],
    },
    [Roles.TEAM_LEADERS]: {
      presence: Access.FORCED,
      roles: [],
    },
    [Roles.LEADERSHIP_STAFF]: {
      presence: Access.FORCED,
      roles: [],
    },
    [Roles.MODERATION_STAFF]: {
      presence: Access.FORCED,
      roles: [],
    },
    [Roles.SUPPORT_STAFF]: { presence: Access.OPTIONAL },
  },
};

export default subserver;
