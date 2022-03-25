import { Access, Subserver } from ".";
import Roles from "../roles";

export enum SubserverRoles {
  SUPER_ADMIN = "708630517528002581",
  TEAM_LEADERS = "559336076456755200",
  CREATIVE_TEAM = "799262919111344128",
}

const subserver: Subserver = {
  id: "540758383582511115",
  name: "Blurple Asset Resource Facility",
  acronym: "BARF",
  staffAccess: {
    [Roles.ADMINISTRATORS]: {
      presence: Access.OPTIONAL,
      roles: [
        SubserverRoles.SUPER_ADMIN,
        SubserverRoles.TEAM_LEADERS,
      ],
    },
    [Roles.TEAM_LEADERS]: {
      presence: Access.OPTIONAL,
      roles: [SubserverRoles.TEAM_LEADERS],
    },
    [Roles.MEDIA]: {
      presence: Access.OPTIONAL,
      roles: [SubserverRoles.CREATIVE_TEAM],
    },
  },
};

export default subserver;
