import "dotenv/config";

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
    zeppelinCaseLog: String(process.env["CHANNEL_ZEPPELIN_CASES"]),
  },

  roles: {
    staff: {
      administrators: String(process.env["ROLE_ADMINISTRATORS"]),
      leadership: String(process.env["ROLE_LEADERSHIP"]),
      all: String(process.env["ROLE_STAFF"]),
      teams: {
        moderation: String(process.env["ROLE_TEAM_MODERATION"]),
        developer: String(process.env["ROLE_TEAM_DEVELOPER"]),
        designer: String(process.env["ROLE_TEAM_DESIGNER"]),
        events: String(process.env["ROLE_TEAM_EVENTS"]),
        giveaways: String(process.env["ROLE_TEAM_GIVEAWAYS"]),
        minecraft: String(process.env["ROLE_TEAM_MINECRAFT"]),
        modmails: String(process.env["ROLE_TEAM_MODMAILS"]),
        partnerships: String(process.env["ROLE_TEAM_PARTNERSHIPS"]),
      },
      duty: String(process.env["ROLE_STAFF_ON_DUTY"]),
    },
    restrictions: {
      embed: String(process.env["ROLE_RESTRICTION_EMBED"]),
      reactions: String(process.env["ROLE_RESTRICTION_REACTIONS"]),
      bots: String(process.env["ROLE_RESTRICTION_BOTS"]),
      vad: String(process.env["ROLE_RESTRICTION_VAD"]),
      nick: String(process.env["ROLE_RESTRICTION_NICK"]),
      soundboard: String(process.env["ROLE_RESTRICTION_SOUNDBOARD"]),
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
      canvasPing: String(process.env["ROLE_CANVAS_PING"]),
      eventsPing: String(process.env["ROLE_EVENTS_PING"]),
    },
  },

  bots: {
    modmail: String(process.env["BOT_MODMAIL"]),
    zeppelin: String(process.env["BOT_ZEPPELIN"]),
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
