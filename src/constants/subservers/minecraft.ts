import type { Subserver } from ".";
import { SubserverAccess } from ".";
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
      access: SubserverAccess.Allowed,
      roles: [Roles.SuperAdmin],
    },
    [config.roles.teamLeaders]: {
      access: SubserverAccess.Allowed,
    },
    [config.roles.leadershipStaff]: {
      access: SubserverAccess.Allowed,
    },
    [config.roles.moderationStaff]: {
      access: SubserverAccess.Allowed,
    },
    [config.roles.minecraftTeam]: {
      access: SubserverAccess.Forced,
    },
  },
};

export default minecraftSubserver;
