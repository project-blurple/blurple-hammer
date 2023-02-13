import type { AboutSection } from ".";
import { modmailMention } from ".";

export default {
  title: "Frequently Asked Questions",
  embed: {
    fields: Object.entries<string>({
      "What does being a donator give me?":
        "Donators have their own lounge chat where they can hang out with other donators. They also get recognition for their donation.",
      "Why is there a year next to people's roles?":
        "If a user has a role with a year next to it, they gained that role during Discord's anniversary on that particular year. Some roles are also from other events, like april fools.",
      "Are you recruiting for staff?":
        "We currently do not accept applications. We will reach out if we are recruiting staff.",
      "Will this server shut down after May 13th?":
        "No, this server and the emoji servers will remain! We host the main event annually across the duration of approximately a week, and when the main event is over, we plan for next year. We also host some smaller events in between.",
      "Is this server an official Discord server?":
        "No, we are in no way affiliated, endorsed, verified nor partnered with Discord.",
      "I have a feedback or complaint!":
        `Feel free to forward any suggestions or complaints to the team through ${modmailMention}! We want everyone to have the best experience they can, so please do not hesitate to forward any concerns.`,
      "Why can't I upload files?":
        "We've denied some permissions during the off-season to prevent spam. Some roles are exempt from this.",
    }).map(([name, value]) => ({ name, value })),
  },
} satisfies AboutSection;
