import dedent from "dedent";
import { zeroWidthSpace } from "../../utils/text";
import type { AboutSection } from ".";

export default {
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
          **Twitter:** [@BlurpleProject](https://twitter.com/BlurpleProject)
          **GitHub:** [@project-blurple](https://github.com/project-blurple)
        `,
        inline: true,
      },
      {
        name: zeroWidthSpace,
        value: dedent`
          **Server Invite:** https://discord.gg/blurple
          **Blob Server 1:** https://discord.gg/9hPpBEY
          **Blob Server 2:** https://discord.gg/AqggbcT
        `,
        inline: true,
      },
      {
        name: "How can I get involved during the event?",
        value: "You can read more about how you can get involved by checking out the <id:guide>!",
      },
    ],
  },
} satisfies AboutSection;
