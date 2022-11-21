import type { Message, TextChannel } from "discord.js";
import type { AboutSection } from "../../constants/aboutContent";
import { Colors } from "discord.js";
import Emojis from "../../constants/emojis";
import type { MentionCommand } from ".";
import aboutSections from "../../constants/aboutContent";
import config from "../../config";
import generateHeader from "../../utils/header";
import { msToHumanShortTime } from "../../utils/time";
import { zeroWidthSpace } from "../../utils/text";

const command: MentionCommand = {
  testArgs(args) { return args.length === 0; },
  async execute(message, reply) {
    let botMessage: Message | null = null;

    const aboutChannel = message.client.channels.cache.get(config.channels.about) as TextChannel;
    if (aboutChannel.id !== message.channel.id) botMessage = await reply(`${Emojis.Loading} Recreating...`);

    const now = Date.now();

    const oldMessages = await aboutChannel.messages.fetch({ limit: 100 });
    if (oldMessages.every(oldMessage => oldMessage.createdTimestamp > now - 14 * 24 * 60 * 60 * 1000)) await aboutChannel.bulkDelete(oldMessages);
    else await Promise.all(oldMessages.map(oldMessage => oldMessage.delete()));

    const navigation: Record<AboutSection["title"], Message["url"]> = {};
    for (const section of aboutSections) {
      const header = await generateHeader(section.title);
      await aboutChannel.send({ files: [{ name: `${section.title.toLowerCase()}.png`, attachment: header }]});
      const navigationMessage = await aboutChannel.send({
        embeds: [
          {
            color: Colors.Blurple,
            ...section.embed,
          },
        ],
        ...section.components && { components: section.components },
      });
      await aboutChannel.send({ content: zeroWidthSpace });
      navigation[section.title] = navigationMessage.url;
    }

    await aboutChannel.send({ files: [{ name: "navigation.png", attachment: await generateHeader("Navigation") }]});
    await aboutChannel.send({
      embeds: [
        {
          color: Colors.Blurple,
          description: Object.entries(navigation)
            .map(([title, url]) => `• [${title}](${url})`)
            .join("\n"),
        },
      ],
    });

    const response = (botMessage?.edit ?? message.channel.send)(`${Emojis.Sparkle} Recreated in \`${msToHumanShortTime(Date.now() - now)}\`.`);
    if (aboutChannel.id === message.channel.id) setTimeout(() => void response.then(res => res.delete()), 10 * 1000);
    return response;
  },
};

export default { ...command } as const;
