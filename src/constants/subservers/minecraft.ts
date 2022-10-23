import { Access } from ".";
import type { Subserver } from ".";
import config from "../../config";

enum Roles {
  SuperAdmin = "804843371037982720",
  MinecraftStaff = "804874182198165515",
}

const minecraftSubserver: Subserver = {
  id: "804843010479095818",
  name: "Blurple Assistive Minecraft Facility",
  acronym: "BAMF",
  staffAccess: {
    [config.roles.administrators]: {
      access: Access.Allowed,
      roles: [Roles.SuperAdmin],
    },
    [config.roles.teamLeaders]: {
      access: Access.Allowed,
    },
    [config.roles.leadershipStaff]: {
      access: Access.Allowed,
    },
    [config.roles.moderationStaff]: {
      access: Access.Allowed,
    },
    [config.roles.minecraftTeam]: {
      access: Access.Forced,
    },
  },
};

export default minecraftSubserver;
