import type { Subserver } from ".";
import { SubserverAccess } from ".";
import config from "../../config";

export enum Roles {
  Administrators = "804843371037982720",
  BlurpleStaff = "1072258066575265812",
  MinecraftManagement = "804874122520952852",
  MinecraftStaff = "804874182198165515",
  OverrideRole = "1072257810693373984",
}

const minecraftSubserver: Subserver = {
  id: "804843010479095818",
  name: "Blurple Assistive Minecraft Facility",
  acronym: "BAMF",
  staffAccess: {
    [config.roles.staff.administrators]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.Administrators],
    },
    [config.roles.staff.all]: {
      access: SubserverAccess.Allowed,
      roles: [Roles.BlurpleStaff],
    },
    [config.roles.staff.teams.minecraft]: {
      access: SubserverAccess.Forced,
      roles: [Roles.MinecraftStaff],
    },
  },
  userOverrideNoticeRoleId: Roles.OverrideRole,
};

export default minecraftSubserver;
