import { Access, Subserver } from ".";
import Roles from "../roles";

export enum SubserverRoles {
  SUPER_ADMIN = "804843371037982720",
  // todo: add roles after refining server
}

const subserver: Subserver = {
  id: "559341262302347314",
  name: "Blurple Application Development",
  acronym: "BAD",
  staffAccess: {
    [Roles.ADMINISTRATORS]: {
      presence: Access.OPTIONAL,
      roles: [SubserverRoles.SUPER_ADMIN],
    },
    [Roles.TEAM_LEADERS]: { presence: Access.OPTIONAL },
    [Roles.LEADERSHIP_STAFF]: { presence: Access.OPTIONAL },
    [Roles.MODERATION_STAFF]: { presence: Access.OPTIONAL },
    [Roles.MINECRAFT_TEAM]: {
      presence: Access.FORCED,
      roles: [],
    },
    // user: Noah
    "733415049950920815": { roles: [SubserverRoles.SUPER_ADMIN]},
  },
};

export default subserver;
