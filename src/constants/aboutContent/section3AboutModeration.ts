import type { AboutSection } from ".";
import dedent from "dedent";

const section3AboutModeration: AboutSection = {
  title: "About Moderation",
  embed: {
    // turn on word wrapping lol
    description: dedent`
      It is our responsibility to ensure that all content being posted in this server is appropriate for the entire community, especially when the server is open to all users. Therefore, we have to mind the presence of underage members and tackle inappropriate content with extreme sensitivity.

      While we believe that everyone has the right to free speech, we also have the right to implement and enforce rules for everyone's safety. If you are the kind of person to express offensive messages, sorry but this is not the right place for you.

      We will not deny the fact that our rule listing is not perfect, but one thing you should take note is that our rules are not, in any way, written by lawyers. If you are the kind of person to exploit and abuse every loophole you can find, there is this thing called common sense. Use it.

      If you want to appeal your punishment, you can do so here: [appeals.projectblurple.com](https://appeals.projectblurple.com)
    `,
  },
};

export default { ...section3AboutModeration } as AboutSection;
