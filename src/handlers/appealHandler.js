const config = require("../../config.json"), { app, oauth, guilds, channels, emojis } = require("../constants"), { appeals, appealbanned, tokenToUser } = require("../database"), fs = require("fs"), { join } = require("path");

const
  formFile = fs.readFileSync(join(__dirname, "../web/appeals/form.html"), "utf8").replace(/{{PATH}}/g, config.appeal.path),
  alertFile = fs.readFileSync(join(__dirname, "../web/appeals/alert.html"), "utf8").replace(/{{PATH}}/g, config.appeal.path);

const
  caseEmojis = {
    accept: "✅",
    claim: "🎗",
    reject: "❌",
    reset: "♻",
    trash: "🗑",
    ban: "🔨"
  }, caseColors = {
    accepted: 0x2ecc71,
    rejected: 0xe74c3c,
    default: 0xf1c40f
  };

module.exports = async client => {
  const guild = client.guilds.cache.get(guilds.main), appealChannel = guild.channels.cache.get(channels.appeals);
  app.get(config.appeal.path, async (req, res) => {
    if (req.query.code) {
      const { access_token } = await oauth.tokenRequest({
        code: req.query.code,
        scope: "identify email",
        grantType: "authorization_code",
        redirectUri: config.appeal.link
      }).catch(e => { console.log(e); return {}; });
      if (!access_token) return res.status(500).send(alertFile
        .replace(/{{TITLE}}/g, "Failure")
        .replace(/{{MESSAGE}}/g, "We could not verify you. Please try again.")
      );
      const user = await oauth.getUser(access_token), avatar = getAvatar(user, client);
      if (await appealbanned.get(user.id)) return res.status(403).send(alertFile
        .replace(/{{TITLE}}/g, "Forbidden")
        .replace(/{{MESSAGE}}/g, "You have been banned from using the appeal system. Please contact BlurpleMail or promise@projectblurple.com if you feel this was an error.")
      );

      tokenToUser.set(req.query.code, user);
      return res.send(formFile
        .replace(/{{ICON}}/g, guild.iconURL({ dynamic: false, format: "png", size: 64 }))
        .replace(/{{AVATAR}}/g, avatar)
        .replace(/{{TOKEN}}/g, req.query.code)
      );
    }
    else if (req.query.token) {
      console.log(req.query);
      const user = await tokenToUser.get(req.query.token);

      const embed = {
        title: `${req.query.casetype.toUpperCase()} - #${req.query.caseid || "???"}`,
        author: {
          name: user ? `${user.username}#${user.discriminator} (${user.id})` : "Unknown User",
          icon_url: user ? getAvatar(user, client) : null
        },
        fields: [
          ...[
            req.query.caseid ? { name: "See case info", value: `\`!case ${req.query.caseid}\``, inline: true } : null,
            user && user.id ? { name: "See all cases", value: `\`!cases ${user.id}\``, inline: true } : null,
            user && user.email { name: "Email", value: user.email + "\n" + emojis.blank, inline: true } : null
          ].filter(f => f),
          {
            name: "User Statement",
            value: req.query.statement + "\n" + emojis.blank
          },
          {
            name: "Why should we appeal your punishment?",
            value: req.query.reason + "\n" + emojis.blank
          },
          {
            name: "Appeal log",
            value: "No logs yet"
          }
        ],
        color: caseColors.default
      };

      const m = await appealChannel.send({ embed });
      appeals.set(m.id, { user: user && user.id ? user.id : null, embed, content: "", log: [] });

      if (!user) res.redirect(config.appeal.link + "?failure=1");
      else {
        tokenToUser.unset(req.query.token);
        res.redirect(config.appeal.link + "?failure=0");
      }

      for (const emoji of Object.values(caseEmojis)) await m.react(emoji);
    } else if (req.query.failure == "0") {
      return res.send(alertFile
        .replace(/{{TITLE}}/g, "Success!")
        .replace(/{{MESSAGE}}/g, "We have received your appeal. If you're available on DMs thorugh the server, we will contact you via BlurpleMail. Otherwise, we will contact you via e-mail.")
      );
    } else if (req.query.failure) {
      return res.send(alertFile
        .replace(/{{TITLE}}/g, "Failure")
        .replace(/{{MESSAGE}}/g, "An unknown error occurred from our end. Please try again later. If the issue persists, contact BlurpleMail. If you're banned, contact promise@projectblurple.com from the mail you tried to appeal with, and we will sort it out with you :)")
      );
    } else return res.redirect(`${client.options.http.api}/oauth2/authorize?client_id=${client.user.id}&redirect_uri=${encodeURI(config.appeal.link)}&response_type=code&scope=identify%20email`);
  });
  app.get("/appeal.css", (_, res) => res.sendFile(join(__dirname, "../web/appeals/appeal.css")));

  client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (
      reaction.message.channel.id == channels.appeals &&
      !user.bot &&
      reaction.message.author.id == client.user.id
    ) {
      const appeal = await appeals.get(reaction.message.id);
      if (appeal) {
        let update = true;
        appeal.content = "";
        if (reaction.emoji.name == caseEmojis.accept) {
          appeal.embed.color = caseColors.accepted;
          appeal.log.push(`Accepted by ${user} (${user.id})`);
        } else if (reaction.emoji.name == caseEmojis.claim) {
          appeal.embed.color = caseColors.default;
          appeal.content = user.toString();
          appeal.log.push(`Claimed by ${user} (${user.id})`);
        } else if (reaction.emoji.name == caseEmojis.reject) {
          appeal.embed.color = caseColors.rejected;
          appeal.log.push(`Rejected by ${user} (${user.id})`);
        } else if (reaction.emoji.name == caseEmojis.reset) {
          appeal.embed.color = caseColors.default;
          appeal.log.push(`Reset by ${user} (${user.id})`);
        } else if (reaction.emoji.name == caseEmojis.trash) {
          update = false;
          reaction.message.delete();
          appeal.log.push(`Deleted by ${user} (${user.id})`);
        } else if (reaction.emoji.name == caseEmojis.ban) {
          update = false;
          reaction.message.delete();
          appeal.log.push(`Banned from appeals by ${user} (${user.id})`);
          appealbanned.set(appeal.user, true);
        }

        appeals.set(reaction.message.id, appeal);

        if (update) {
          const e = JSON.parse(JSON.stringify(appeal.embed));
          e.fields.find(f => f.name == "Appeal log").value = appeal.log.map(l => `• ${l}`).join("\n");
          reaction.message.edit(appeal.content, { embed: e });
          reaction.users.remove(user);
        }
      }
    }
  });
};

const getAvatar = (user, client) => 
  user.avatar ?
    `${client.options.http.cdn}/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=64` :
    `${client.options.http.cdn}/embed/avatars/${user.discriminator % 5}.png?size=64`; // user has no avatar