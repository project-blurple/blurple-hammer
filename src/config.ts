import type { Snowflake } from "discord.js";
import { config } from "dotenv";
config(); // load env variables from .env file

export default {
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    token: process.env.CLIENT_TOKEN,
  },
  databaseUri: process.env.DATABASE_URI,

  ownerId: process.env.OWNER_ID,
  guildId: process.env.GUILD_ID,

  colors: {
    primary: 0x5865F2,
    success: 0x58F287,
    error: 0xED4245,
    warning: 0xF7DE52,
    info: 0x216ADD,
  },

  roles: {
    ADMINISTRATORS: "",
    TEAM_LEADERS: "",
    LEADERSHIP_STAFF: "",
    MODERATION_STAFF: "",
  },

  ...process.env.WEB_PORT && {
    web: {
      port: parseInt(process.env.WEB_PORT),
      rateLimitIpWhitelist: process.env.WEB_RATE_LIMIT_IP_WHITELIST?.split(",") || [],
      ...process.env.PORTAL_PATH && process.env.PORTAL_LINK && {
        portal: {
          path: process.env.PORTAL_PATH,
          link: process.env.PORTAL_LINK,
        },
      },
      ...process.env.APPEAL_PATH && process.env.APPEAL_LINK && {
        appeal: {
          path: process.env.APPEAL_PATH,
          link: process.env.APPEAL_LINK,
        },
      },
      ...process.env.STATISTICS_PATH && process.env.STATISTICS_LINK && {
        statistics: {
          path: process.env.STATISTICS_PATH,
          link: process.env.STATISTICS_LINK,
        },
      },
    },
  },

  hastebinLink: "https://hastebin.but-it-actually.works",
} as Config;


interface Config {
  client: {
    id: Snowflake;
    secret: string;
    token: string;
  }
  databaseUri: string;
  ownerId: Snowflake;
  guildId: Snowflake;
  colors: Record<"primary" | "success" | "error" | "warning" | "info", number>;
  roles: Record<string, Snowflake>;
  web?: {
    port: number;
    rateLimitIpWhitelist: Array<string>;
    portal?: {
      path: string;
      link: string;
    }
    appeal?: {
      path: string;
      link: string;
    }
    statistics?: {
      path: string;
      link: string;
    }
  }
  hastebinLink: string;
}
