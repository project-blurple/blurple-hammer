import { config } from "dotenv";

config();

export default {
  client: {
    id: String(process.env["BOT_ID"]),
    secret: String(process.env["BOT_SECRET"]),
    token: String(process.env["BOT_TOKEN"]),
  },

  databaseUri: String(process.env["DATABASE_URI"]),

  ownerId: String(process.env["OWNER_ID"]),
  mainGuildId: String(process.env["GUILD_ID"]),
  otherGuildIds: String(process.env["OTHER_GUILD_IDS"]).split(","),

  channels: {
    about: String(process.env["CHANNEL_ABOUT"]),
    appeals: String(process.env["CHANNEL_APPEALS"]),
    publicChannels: String(process.env["CHANNELS_PUBLIC"]).split(","),
    blurplefierChannels: String(process.env["CHANNELS_BLURPLEFIER"]).split(","),
  },

  roles: {
    administrators: String(process.env["ROLE_ADMINISTRATORS"]),
    teamLeaders: String(process.env["ROLE_TEAM_LEADERS"]),
    leadershipStaff: String(process.env["ROLE_LEADERSHIP_STAFF"]),
    moderationStaff: String(process.env["ROLE_MODERATION_STAFF"]),
    developers: String(process.env["ROLE_DEVELOPERS"]),
    medias: String(process.env["ROLE_MEDIAS"]),
    supportStaff: String(process.env["ROLE_SUPPORT_STAFF"]),
    eventsTeam: String(process.env["ROLE_EVENTS_TEAM"]),
    minecraftTeam: String(process.env["ROLE_MINECRAFT_TEAM"]),
    staffOnDuty: String(process.env["ROLE_STAFF_ON_DUTY"]),
    restrictions: {
      embed: String(process.env["ROLE_RESTRICTION_EMBED"]),
      reactions: String(process.env["ROLE_RESTRICTION_REACTIONS"]),
      bots: String(process.env["ROLE_RESTRICTION_BOTS"]),
      vad: String(process.env["ROLE_RESTRICTION_VAD"]),
      nick: String(process.env["ROLE_RESTRICTION_NICK"]),
    },
    partners: String(process.env["ROLE_PARTNERS"]),
    megaDonators: String(process.env["ROLE_MEGA_DONATORS"]),
    donators: String(process.env["ROLE_DONATORS"]),
    retiredStaff: String(process.env["ROLE_RETIRED_STAFF"]),
    blurpleServerRepresentative: String(process.env["ROLE_BLURPLE_SERVER_REPRESENTATIVE"]),
    blurpleUser: String(process.env["ROLE_BLURPLE_USER"]),
    painters: String(process.env["ROLE_PAINTERS"]),
    artists: String(process.env["ROLE_ARTISTS"]),
    adventurers: String(process.env["ROLE_ADVENTURERS"]),
    miscellaneous: {
      archiveAccess: String(process.env["ROLE_ARCHIVE_ACCESS"]),
      eventsPing: String(process.env["ROLE_EVENTS_PING"]),
    },
  },

  bots: {
    modmail: String(process.env["BOT_MODMAIL"]),
  },

  appeals: process.env["APPEALS_PORT"] ?
    {
      port: Number(process.env["APPEALS_PORT"]),
      url: String(process.env["APPEALS_URL"]),
      numberOfProxies: Number(process.env["APPEALS_NUMBER_OF_PROXIES"]),
    } :
    null,

  staffPortal: process.env["STAFF_PORTAL_PORT"] ?
    {
      port: Number(process.env["STAFF_PORTAL_PORT"]),
      url: String(process.env["STAFF_PORTAL_URL"]),
      numberOfProxies: Number(process.env["STAFF_PORTAL_NUMBER_OF_PROXIES"]),
    } :
    null,

  smtpSettings: process.env["SMTP_HOST"] ?
    {
      host: String(process.env["SMTP_HOST"]),
      port: Number(process.env["SMTP_PORT"]),
      secure: String(process.env["SMTP_SECURE"]) === "true",
      username: String(process.env["SMTP_USERNAME"]),
      password: String(process.env["SMTP_PASSWORD"]),
      displayName: String(process.env["SMTP_DISPLAY_NAME"]),
      emailAddress: String(process.env["SMTP_EMAIL_ADDRESS"]),
      replyToEmailAddress: String(process.env["SMTP_REPLY_TO_EMAIL_ADDRESS"]),
    } :
    null,

  subservers: {
    noDestructiveActions: String(process.env["SUBSERVERS_NO_DESTRUCTIVE_ACTIONS"]) === "true",
  },

  staffDocumentCloningToken: String(process.env["STAFF_DOCUMENT_CLONING_TOKEN"]) || null,
} as const;
