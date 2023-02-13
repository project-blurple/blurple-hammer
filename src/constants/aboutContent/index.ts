import type { APIEmbed, MessageCreateOptions } from "discord.js";
import config from "../../config";
import section1ProjectBlurple from "./section1ProjectBlurple";
import section2ServerRules from "./section2ServerRules";
import section3AboutModeration from "./section3AboutModeration";
import section4HowToMakeABlurpleImage from "./section4HowToMakeABlurpleImage";
import section5RoleDescriptions from "./section5RoleDescriptions";
import section6FrequentlyAskedQuestions from "./section6FrequentlyAskedQuestions";

export interface AboutSection {
  title: string;
  embed: APIEmbed;
  components?: MessageCreateOptions["components"] | undefined;
}

export const modmailMention = `<@${config.bots.modmail}>`;

const aboutSections: AboutSection[] = [
  section1ProjectBlurple,
  section2ServerRules,
  section3AboutModeration,
  section4HowToMakeABlurpleImage,
  section5RoleDescriptions,
  section6FrequentlyAskedQuestions,
];

export default aboutSections;
