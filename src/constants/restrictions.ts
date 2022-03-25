import Roles from "./roles";

const restrictions: {
  [key in Roles]?: {
    name: string;
    description: string;
    allowed: string;
    disallowed: string;
  }
} = {
  [Roles.NO_VAD]: {
    name: "vad",
    description: "Disallow voice activity detection",
    allowed: "Can use voice activity detection",
    disallowed: "Cannot use voice activity detection",
  },
  [Roles.NO_EMBED]: {
    name: "embed",
    description: "Disallow the use of embeds",
    allowed: "Can use embeds",
    disallowed: "Cannot use embeds",
  },
  [Roles.NO_REACTION]: {
    name: "reactions",
    description: "Disallow adding reactions",
    allowed: "Can add reactions",
    disallowed: "Cannot add reactions",
  },
  [Roles.NO_BOT_ACCESS]: {
    name: "bots",
    description: "Disallow using bot commands",
    allowed: "Can use bot commands",
    disallowed: "Cannot use bot commands",
  },
  [Roles.NO_NICKNAME_CHANGE]: {
    name: "nick",
    description: "Disallow nickname change",
    allowed: "Can change nickname",
    disallowed: "Cannot change nickname",
  },
};

export default restrictions;
