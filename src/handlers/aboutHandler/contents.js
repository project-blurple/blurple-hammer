const { emojis } = require("../../constants");

module.exports = [
  "images/project_blurple.png",
  {
    embed: {
      fields: [
        {
          name: "What is Project Blurple?",
          value: "Project Blurple is a community-run initiative to celebrate Discord's anniversary (May 13th) every year."
        },
        {
          name: "Why the name \"Blurple\"?",
          value: "Blurple is a combination of blue and purple colors. It is the primary color used by Discord on their brand properties. Reference: [discord.com/branding](https://discord.com/branding)"
        },
        {
          name: "Links",
          value: [
            "**Website:** [projectblurple.com](https://projectblurple.com/)",
            "**Reddit:** [r/ProjectBlurple](https://reddit.com/r/ProjectBlurple)",
            "**Twitter:** [@BlurpleProject](https://twitter.com/BlurpleProject)"
          ].join("\n"),
          inline: true
        },
        {
          name: "​", // zero width space
          value: [
            "**Server Invite:** [discord.gg/qEmKyCf](https://discord.gg/qEmKyCf)",
            "**Blob Server 1:** [discord.gg/9hPpBEY](https://discord.gg/9hPpBEY)",
            "**Blob Server 2:** [discord.gg/AqggbcT](https://discord.gg/AqggbcT)"
          ].join("\n"),
          inline: true
        }
      ]
    },
    navigation: "About Project Blurple"
  },
  "images/server_rules.png",
  {
    embed: {
      title: "Project Blurple Rules",
      description: [
        "**1. Follow Discord's [Terms of Service](https://discordapp.com/terms).** You have already agreed to these terms upon making your account, so why shouldn't you still follow them?",
        "**2. Follow Discord's [Guidelines](https://discordapp.com/guidelines).** This is a short list of rules that all Discord users and servers must follow, and we generally base our moderation around these rules.",
        "**3. Spamming is not allowed.** This includes flooding chat, emoji spam, character spam, spam over time etc.",
        "**4. Advertising is not allowed.** This is mainly because we have no idea if the content you want to advertise is safe for work and also allowed by Discord's Terms and Guidelines. If you want to advertise then this is not the server for you.",
        "**5. Drama is not allowed.** We're here to celebrate, not tear the community down. If you're having an argument with someone then please move to DMs or stop completely.",
        "**6. Please speak English.** We are not able to moderate non-English chat so we no longer have an international chat like we've had previously.",
        "**7. Impersonation is not allowed.**"
      ].join("\n\n")
    },
    navigation: "Server Rules"
  },
  "images/about_moderation.png",
  {
    embed: {
      description: [
        "It is our responsibility to ensure that all content being posted in this server is appropriate for the entire community, especially when the server is open to all users. Therefore, we have to mind the presence of underage members and tackle inappropriate content with extreme sensitivity.",
        "While we believe that everyone has the right to free speech, we also have the right to implement and enforce rules for everyone's safety. If you are the kind of person to express offensive messages, sorry but this is not the right place for you.",
        "We will not deny the fact that our rule listing is not perfect, but one thing you should take note is that our rules are not, in any way, written by lawyers. If you are the kind of person to exploit and abuse every loophole you can find, there is this thing called common sense. Use it.",
        "If you want to appeal your punishment, you can do so here: [projectblurple.com/appeal](https://projectblurple.com/appeal)"
      ].join("\n\n")
    },
    navigation: "About Moderation"
  },
  "images/how_to_make_a_blurple_image.png",
  {
    embed: {
      description: [
        "**1.** We have a \"Blurplefier\" bot that can automatically transform your user profile picture to Blurple colors. Type out the command, download the image, and change your avatar on User Settings.",
        "**2.** For web-based image transformations, head to [our official website](https://projectblurple.com/paint).",
        "**3.** If you prefer to design your own logo, the color codes you need to know are as follows:",
        "",
        "**New colors:**",
        `> ${emojis.blurplenew} **Blurple** - HEX: #5865F2 or RGB: (88, 101, 242)`,
        `> ${emojis.darkblurplenew} **Dark Blurple** - HEX: #454FBF or RGB: (69, 79, 191)`,
        `> ${emojis.white} **White** - HEX: #FFFFFF or RGB: (255, 255, 255)`,
        "",
        "*Legacy colors:**",
        `> ${emojis.blurple} **Legacy Blurple** - HEX: #7289DA or RGB: (114, 137, 218)`,
        `> ${emojis.darkblurple} **Legacy Dark Blurple** - HEX: #4E5D94 or RGB: (78, 93, 148)`,
        "",
        "These are some examples of Blurple logos: https://i.imgur.com/9qSLgpH.png"
      ].join("\n")
    },
    navigation: "How to Make a Blurple Image"
  },
  "images/role_descriptions.png",
  {
    embed: {
      fields: [
        {
          name: "Staff Roles",
          value: [
            "**<@&413213839866462220>** » Responsible for the management of the community behind the scenes.",
            "**<@&470272155876065280>** » Responsible for assisting in managing the community and the staff team.",
            "**<@&569015549225598976>** » Responsible for the moderation of all channels and enforce our server rules. They are also responsible for handling all server submissions.",
            "**<@&708540954302218311>** » Responsible for either the development of our internal bots or the creation of various designs used in Project Blurple."
          ].join("\n\n")
        },
        {
          name: "Colored Roles",
          value: [
            "**<@&970547222175424593>** » Server owners that have partnered up with Project Blurple.",
            "**<@&970547278886612992>** » Users who donated an enormous value to be given to Blurple users.",
            "**<@&970547300072030259>** » Given to users who kindly donated prizes during the event.",
            "**<@&431934652153069569>** » Staff members who voluntarily resigned from the team.",
            "**<@&970547497862844446>** » Blurple server representatives who are celebrating with us and joined the server roster in blurple server list.",
            "**<@&970547507811737621>** » Blurple users who are celebrating with us by setting their profile picture to a Blurple-colored picture.",
            "**<@&970547328660439090>** » Blurple users who have collected paint and unlocked the mighty role.",
            "**<@&971633030122840064>** » Blurple users who have shown their artistic skills in the Blurple Canvas.",
            "**<@&970547349254467606>** » Blurple users who have or are currently participating in the Project Blurple Minecraft server."
          ].join("\n\n")
        },
        {
          name: "Miscellaneous Roles",
          value: [
            "**<@&831156380680323105>** » Has access to archived channels. You can get access by typing `!role archives`.",
            "**<@&886591961996349470>** » Gets notified whenever we have an event. You can get notified by typing `!role events`.",
          ].join("\n\n")
        }
      ]
    },
    navigation: "Role Descriptions"
  },
  "images/frequently_asked_questions.png",
  {
    embed: {
      fields: [
        {
          name: "What does being a donator give me?",
          value: "Nothing special at all. You get access to one channel, and that's it."
        },
        {
          name: "Why is there a year next to people's roles?",
          value: "If a user has a role with a year next to it, they gained that role during Discord's anniversary on that particular year."
        },
        {
          name: "Are you recruiting for staff?",
          value: "We are not recruiting any staff members in the meantime. If you submitted an application previously, we will contact you when we need one."
        },
        {
          name: "Will this server shut down after May 13th?",
          value: "No, this server and the emoji servers will remain! We host the main event annually across the duration of approximately a week, and when the main event is over, we plan for next year. We also host some smaller events in between."
        },
        {
          name: "Is this server an official Discord server?",
          value: "No, we are in no way affiliated, endorsed, verified nor partnered with Discord."
        },
        {
          name: "I have a feedback or complaint!",
          value: "Feel free to forward any suggestions or complaints to the Executive Team through <@536491357322346499>! We want everyone to have the best experience they can, so please do not hesitate to forward any concerns."
        },
        {
          name: "Why can't I upload files?",
          value: "We've denied everyone access to upload files. All event roles from this year will have access to upload media files (images, GIFs, videos and audio files)."
        },
        {
          name: "Can I change my profile picture now that the event is over?",
          value: "Yes. You can change your profile picture and server avatar back to the normal one."
        },
        {
          name: "Will Project Blurple rebrand to the new Blurple?",
          value: "We are still discussing the future of Project Blurple, we will send an announcement when we have a conclusion."
        }
      ]
    },
    navigation: "Frequently Asked Questions"
  }
];
