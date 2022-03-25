import { Access, Subserver } from ".";
import Roles from "../roles";

export enum SubserverRoles {
  MANAGEMENT = "559351138034647070",
  DEVELOPER = "559815628953878551",
}

const subserver: Subserver = {
  id: "559341262302347314",
  name: "Blurple Application Development",
  acronym: "BAD",
  staffAccess: {
    [Roles.ADMINISTRATORS]: {
      presence: Access.OPTIONAL,
      roles: [SubserverRoles.MANAGEMENT],
    },
    [Roles.TEAM_LEADERS]: {
      presence: Access.OPTIONAL,
      roles: [SubserverRoles.MANAGEMENT],
    },
    [Roles.LEADERSHIP_STAFF]: {
      presence: Access.OPTIONAL,
      roles: [SubserverRoles.MANAGEMENT],
    },
    [Roles.DEVELOPER]: {
      presence: Access.OPTIONAL,
      roles: [SubserverRoles.DEVELOPER],
    },
  },
};

export default subserver;
