import dedent from "dedent";
import type { AboutSection } from ".";
import { modmailMention } from ".";

export default {
  title: "Server Rules",
  embed: {
    description: dedent`
      *Although we're an open community, we do have a few rules that we expect everyone to follow. If you're unsure about something, please ask a moderator through ${modmailMention}.*

      \`1.\` We expect you to follow Discord's [Terms of Service](https://discord.com/terms) and [Guidelines](https://discord.com/guidelines), any violation of these will be forwarded to Discord's Trust and Safety team.
      \`2.\` This is an English only server, this is purely because we're unable to moderate other languages.
      \`3.\` Advertising is not allowed, we are not the place for this. Some channels might except this rule.
      \`4.\` We do not tolerate any form of harassment or hate speech, this includes but is not limited to: racism, sexism, homophobia, transphobia, ableism, ageism, and any other form of discrimination.

      *Moderators can take appropriate action to you, regardless if it's a server rule or not. If you feel like your punishment was unfair, you can appeal here: [appeals.projectblurple.com](https://appeals.projectblurple.com)*
    `,
  },
} satisfies AboutSection;
