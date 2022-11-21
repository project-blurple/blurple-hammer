import type { AboutSection } from ".";
import Emojis from "../emojis";
import dedent from "dedent";

const section4HowToMakeABlurpleImage: AboutSection = {
  title: "How to make a Blurple image",
  embed: {
    description: dedent`
      \`1.\` We have a "Blurplefier" bot that can automatically transform your user profile picture to Blurple colors. Type out the command, download the image, and change your avatar in User Settings.
      \`2.\` For web-based image transformations, head to our official website: [projectblurple.com/paint](https://projectblurple.com/paint)
      \`3.\` If you prefer to design your own logo, the color codes you need to know are as follows:
    `,
    fields: [
      {
        name: "Colors",
        value: dedent`
          > ${Emojis.Blurple} **Blurple** - HEX: #5865F2 or RGB: (88, 101, 242)
          > ${Emojis.DarkBlurple} **Dark Blurple** - HEX: #454FBF or RGB: (69, 79, 191)
          > ${Emojis.White} **White** - HEX: #FFFFFF or RGB: (255, 255, 255)
        `,
      },
      {
        name: "Legacy colors (pre-2021)",
        value: dedent`
          > ${Emojis.Blurple2021} **Legacy Blurple** - HEX: #7289DA or RGB: (114, 137, 218)
          > ${Emojis.DarkBlurple2021} **Legacy Dark Blurple** - HEX: #4E5D94 or RGB: (78, 93, 148)
        `,
      },
    ],
  },
};

export default { ...section4HowToMakeABlurpleImage } as AboutSection;
