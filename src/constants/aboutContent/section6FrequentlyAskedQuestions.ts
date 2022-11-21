import type { AboutSection } from ".";
import { modmailMention } from ".";

const section6FrequentlyAskedQuestions: AboutSection = {
  title: "Frequently Asked Questions",
  embed: {
    fields: Object.entries<string>({
      "What does being a donator give me?":
        "Nothing special at all. You get access to one channel, and that's it.",
      "Why is there a year next to people's roles?":
        "If a user has a role with a year next to it, they gained that role during Discord's anniversary on that particular year.",
      "Are you recruiting for staff?":
        "We are not recruiting any staff members in the meantime. If you submitted an application previously, we will contact you when we need one.",
      "Will this server shut down after May 13th?":
        "No, this server and the emoji servers will remain! We host the main event annually across the duration of approximately a week, and when the main event is over, we plan for next year. We also host some smaller events in between.",
      "Is this server an official Discord server?":
        "No, we are in no way affiliated, endorsed, verified nor partnered with Discord.",
      "I have a feedback or complaint!":
        `Feel free to forward any suggestions or complaints to the team through ${modmailMention}! We want everyone to have the best experience they can, so please do not hesitate to forward any concerns.`,
      "Why can't I upload files?":
        "We've denied everyone access to upload files. All event roles from this year will have access to upload media files (images, GIFs, videos and audio files).",
    }).map(([name, value]) => ({ name, value })),
  },
};

export default { ...section6FrequentlyAskedQuestions } as AboutSection;
