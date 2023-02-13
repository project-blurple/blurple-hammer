import config from "../config";

// eslint-disable-next-line import/prefer-default-export -- multiple exports can be defined in this file
export const allStaffRoles = [
  config.roles.administrators,
  config.roles.teamLeaders,
  config.roles.leadershipStaff,
  config.roles.moderationStaff,
  config.roles.developers,
  config.roles.medias,
  config.roles.supportStaff,
];
