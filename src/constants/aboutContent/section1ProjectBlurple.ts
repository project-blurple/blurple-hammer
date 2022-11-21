import type { AboutSection } from ".";
import dedent from "dedent";
import { zeroWidthSpace } from "../../utils/text";

const section1ProjectBlurple: AboutSection = {
  title: "Project Blurple",
  embed: {
    fields: [
      {
        name: "What is Project Blurple?",
        value: "Project Blurple is a community-run initiative to celebrate Discord's anniversary (May 13th) every year.",
      },
      {
        name: "Why the name \"Blurple\"?",
        value: "Blurple is a combination of blue and purple colors. It is the primary color used by Discord on their brand properties. Reference: [discord.com/branding](https://discord.com/branding)",
      },
      {
        name: "Links",
        value: dedent`
          **Website:** [projectblurple.com](https://projectblurple.com)
          **Reddit:** [r/ProjectBlurple](https://reddit.com/r/ProjectBlurple)
          **Twitter:** [@BlurpleProject](https://twitter.com/BlurpleProject)
          **GitHub:** [@project-blurple](https://github.com/project-blurple)
        `,
        inline: true,
      },
      {
        name: zeroWidthSpace,
        value: dedent`
          **Server Invite:** [discord.gg/qEmKyCf](https://discord.gg/qEmKyCf)
          **Blob Server 1:** [discord.gg/9hPpBEY](https://discord.gg/9hPpBEY)
          **Blob Server 2:** [discord.gg/AqggbcT](https://discord.gg/AqggbcT)
        `,
        inline: true,
      },
    ],
  },
};

export default { ...section1ProjectBlurple } as AboutSection;
