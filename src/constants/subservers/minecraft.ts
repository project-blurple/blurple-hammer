import type { Subserver } from ".";
import { SubserverAccess } from ".";
import config from "../../config";

enum Roles {
  Administrators = "804843371037982720",
  MinecraftStaff = "804874182198165515",
  BlurpleStaff = "1072258066575265812",
  OverrideRole = "1072257810693373984",
}

const minecraftSubserver: Subserver = {
  id: "804843010479095818",
  name: "Blurple Assistive Minecraft Facility",
  acronym: "BAMF",
  staffAccess: {
    [config.roles.administrators]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Administrators, Roles.BlurpleStaff],
    },
    [config.roles.teamLeaders]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.BlurpleStaff],
    },
    [config.roles.leadershipStaff]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.BlurpleStaff],
    },
    [config.roles.moderationStaff]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.BlurpleStaff],
    },
    [config.roles.supportStaff]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.BlurpleStaff],
    },
    [config.roles.minecraftTeam]: {
      access: SubserverAccess.Forced,
      roles: [Roles.MinecraftStaff],
    },
  },
  userOverrideNoticeRoleId: Roles.OverrideRole,
};

export default minecraftSubserver;
