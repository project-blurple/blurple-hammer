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
          name: "Blurple Blob Emoji Servers",
          value: [
            "**1:** [discord.gg/9hPpBEY](https://discord.gg/9hPpBEY)",
            "**2:** [discord.gg/AqggbcT](https://discord.gg/AqggbcT)"
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
      fields: [
        {
          name: "1. Discord ToS and Guidelines",
          value: "We ask you to follow Discord's [Terms of Service](https://discordapp.com/terms) and [Guidelines](https://discordapp.com/guidelines). If you don't, we are obligated to report you to Discord's Safety Team, and your account may be terminated. These terms and guidelines did you agree on upon making your account on Discord and applies to the whole platform."
        },
        {
          name: "2. Treat everyone with respect",
          value: "We are all humans after all. Please respect everyone, in singular or plural form. Hate speech of any kind will not be tolerated, regardless of race, religion, sexuality, gender etc."
        },
        {
          name: "3. Suicide",
          value: [
            "Talking about suicide is not allowed in our public chat. If you or someone else seeks help, please refer to the following article made by the Discord team: [Mental Health on Discord](https://discord.com/safety/360044103771-Mental-health-on-Discord)"
          ].join("\n")
        },
        {
          name: "4. Common Sense",
          value: [
            "We ask you to use common sense in chat. These rules may not be as obvious as others, but that's why we list them here anyways.",
            "",
            "• Spamming is not allowed, emojis included.",
            "• Advertising is not allowed, in any form of way.",
            "• Inappropriate content such as NSFW or NSFL is not allowed.",
            "• We don't want drama in public chat, please take this to DMs or block the ones making drama.",
            "• Please speak english in public channels. If you and someone else wants to talk another language, please do this in DMs.",
            "• Impersonation is not allowed."
          ].join("\n")
        }
      ]
    },
    navigation: "Server rules"
  },
  "images/about_moderation.png",
  {
    embed: {
      description: [
        "It is our responsibility to ensure that all content being posted in this server is appropriate for the entire community, especially when the server is open to all users. Therefore, we have to mind the presence of underage members and tackle inappropriate content with extreme sensitivity.",
        "While we believe that everyone has the right to free speech, we also have the right to implement and enforce rules for everyone's safety. If you are the kind of person to express offensive messages, sorry but this is not the right place for you.",
        "We will not deny the fact that our rule listing is not perfect, but one thing you should take note is that our rules are not, in any way, written by lawyers. If you are the kind of person to exploit and abuse every loophole you can find, there is this thing called common sense. Use it."
      ].join("\n\n")
    },
    navigation: "About moderation"
  },
  "images/how_to_make_a_blurple_logo.png",
  {
    embed: {
      description: [
        "**1.** We have a \"Blurplefier\" bot that can automatically transform your user profile picture to Blurple colors. Type out the command, download the image, and change your avatar on User Settings.",
        "**2.** For web-based image transformations, head to [our official website](https://projectblurple.com/paint).",
        "**3.** If you prefer to design your own logo, the color codes you need to know are as follows:",
        "",
        `> ${emojis.blurple} **Blurple** - HEX: #7289DA or RGB: (114, 137, 218)`,
        `> ${emojis.white} **White** - HEX: #FFFFFF or RGB: (255, 255, 255)`,
        `> ${emojis.darkblurple} **Dark Blurple** - HEX: #4E5D94 or RGB: (78, 93, 148)`,
        "",
        "These are some examples of Blurple logos: https://i.imgur.com/F91nmLP.png"
      ].join("\n")
    },
    navigation: "How to make a Blurple logo/avatar"
  },
  "images/role_descriptions.png",
  {
    embed: {
      fields: [
        {
          name: "Staff roles",
          value: [
            "<@&413213839866462220> - Responsible for the management of the community behind the scenes.",
            "<@&470272155876065280> - Responsible for assisting in managing the community and the staff team.",
            "<@&569015549225598976> - Responsible for the moderation of all channels and enforce our server rules. They are also responsible for handling all server submissions.",
            "<@&708540954302218311> - Responsible for either the development of our internal bots or the creation of various designs used in Project Blurple."
          ].join("\n")
        },
        {
          name: "Colored Roles",
          value: [
            "<@&799239966399922206> - Server owners that have partnered up with Project Blurple.",
            "<@&799239965149102161> - Users who donated an enormous value to be given to Blurple users.",
            "<@&799239968190890004> - Given to users who kindly donated prizes during the event.",
            "<@&431934652153069569> - Users who were part of the early development of this server, as well as those who were previously in the staff team.",
            "<@&799240274849169428> - Blurple server owners who are celebrating with us and joined the server roster in blurple server list.",
            "<@&799240275234390048> - Blurple users who are celebrating with us by setting their profile picture to a Blurple-colored picture.",
            "<@&799240276538687509> - Blurple users who have collected paint and unlocked the mighty role.",
            "<@&799240276542619649> - Blurple users who have shown their artistic skills in the Blurple Canvas.",
            "<@&804674660792926229> - Blurple users who have or are currently participating in the Project Blurple Minecraft server."
          ].join("\n")
        },
        {
          name: "Miscellaneous Roles",
          value: [
            "<@&831156380680323105> - Has access to archived channels. You can get access by typing `!role archives`."
          ].join("\n")
        }
      ]
    },
    navigation: "Role descriptions"
  },
  "images/frequently_asked_questions.png",
  {
    embed: {
      fields: [
        {
          name: "Who started all of this?",
          value: "<@204778476102877187> created the server in mid-February 2018, and brought on a small group of people to plan for what is happening."
        },
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
          name: "Will this server shutdown after May 13th?",
          value: "No, this server and the emoji servers will remain! We host the main event annually, and when the main event is over, we plan for next year. We also host some smaller events inbetween."
        },
        {
          name: "Is this server an official Discord server?",
          value: "No, we are in no way affiliated, endorsed, verified nor partnered with Discord."
        },
        {
          name: "What do I do if I am punished by a staff member and feel it was unfair?",
          value: "We believe in fairness and therefore everyone has the right to appeal any punishment if it was deemed unjustified: [projectblurple.com/appeal](https://projectblurple.com/appeal)"
        },
        {
          name: "I have a feedback or complaint!",
          value: "Feel free to forward any suggestions or complaints to the Executive Team through <@536491357322346499>! We want everyone to have the best experience they can, so please do not hesitate to forward any concerns."
        }
      ]
    },
    navigation: "Frequently Asked Questions"
  }
];