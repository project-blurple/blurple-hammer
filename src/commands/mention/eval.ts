import { randomBytes } from "crypto";
import { inspect } from "util";
import { isPromise } from "util/types";
import Type from "@sapphire/type";
import dedent from "dedent";
import type{ MessageReplyOptions } from "discord.js";
import { ButtonStyle, ComponentType, blockQuote, codeBlock, inlineCode } from "discord.js";
import config from "../../config";
import { buttonComponents } from "../../handlers/interactions/components";
import type{ MentionCommand } from ".";


export default {
  names: ["eval", "evaluate", "run"],
  ownerOnly: true,
  testArgs(args) { return args.length > 0; },
  // eslint-disable-next-line id-length, @typescript-eslint/no-unused-expressions, @typescript-eslint/brace-style -- the dollar sign is the message, we need this for context in the eval function, @typescript-eslint/brace-style
  execute($, reply, args) { $;
    try {
      // eslint-disable-next-line no-eval, @typescript-eslint/no-unsafe-assignment
      const evaluated = eval(args.join(" "));
      if (isPromise(evaluated)) {
        const now = new Date();
        const message = reply({
          ...generateResponse(evaluated),
          content: "💨 Running...",
        });
        return evaluated
          .then(async result => {
            const ms = new Date().getTime() - now.getTime();
            void (await message).edit(generateFinalResponse(result, ms));
          })
          .catch(async err => {
            const ms = new Date().getTime() - now.getTime();
            void (await message).edit(generateFinalResponse(err, ms, false));
          });
      }
      return reply(generateFinalResponse(evaluated));
    } catch (err) {
      return reply(generateFinalResponse(err, -1, false));
    }
  },
} as MentionCommand;

function generateFinalResponse(result: unknown, ms = -1, success = true, fileUpload = false): MessageReplyOptions {
  const identifier = randomBytes(16).toString("hex");
  buttonComponents.set(`${identifier}:upload-to-file`, {
    allowedUsers: [config.ownerId],
    callback(button) {
      void button.update(generateFinalResponse(result, ms, success, true));
    },
  });

  return {
    components: [],
    embeds: [],
    ...generateResponse(result, ms, success, !fileUpload),
    ...fileUpload ?
      {
        files: [
          {
            name: "output.ts",
            attachment: Buffer.from(dedent`
              // type: ${new Type(result).toString()}
              // time: ${ms === -1 ? "n/a" : `${ms}ms`}
              // success: ${success ? "yes" : "no"}\n
            ` + inspect(result, { depth: Infinity, maxArrayLength: Infinity, maxStringLength: Infinity })),
          },
        ],
      } :
      {
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: "Upload to file",
                style: ButtonStyle.Primary,
                customId: `${identifier}:upload-to-file`,
              },
            ],
          },
        ],
      },
  };
}

function generateResponse(result: unknown, ms = -1, success = true, includeResult = true, depth = 10, maxArrayLength = 100): MessageReplyOptions {
  if (depth <= 0) return { content: "⚠️ Output is too big to display" };
  const output = inspect(result, { colors: true, depth, maxArrayLength });
  const type = new Type(result).toString();
  const content = `${success ? "✅ Evaluated successfully" : "❌ Javascript failed"}. ${ms === -1 ? "" : `(${inlineCode(`${ms}ms`)})`}\n${includeResult ? blockQuote(codeBlock("ts", ms === -1 ? type : `Promise<${type}>`) + codeBlock("ansi", success ? output : output.split("\n")[0]!)) : ""}`;

  // 1024 is not the actual limit but any bigger than 1k is really not ideal either way
  if (content.length > 1024) {
    if (!maxArrayLength) return generateResponse(result, ms, success, includeResult, depth - 1, maxArrayLength);
    return generateResponse(result, ms, success, includeResult, depth, maxArrayLength - 1);
  }

  return { content };
}
