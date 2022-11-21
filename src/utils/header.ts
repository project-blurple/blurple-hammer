import { Colors } from "discord.js";
import TextToSVG from "text-to-svg";
import { join } from "path";
import { promisify } from "util";
import { svg2png } from "svg-png-converter";

const fontPromise = promisify(TextToSVG.load)(join(__dirname, "../../web/fonts/Ginto-Nord/Ginto-Nord-700.woff"));

const width = 1800;
const height = 300;
const widthPadding = 100;
const heightPadding = 50;
const roundedCorners = height / 2.25;

const svgTemplate = async (text: string, backgroundColor: number) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" rx="${Math.round(roundedCorners)}" fill="#${backgroundColor.toString(16)}" />
    ${await generateTextPath(text)}
  </svg>
`;

async function generateTextPath(text: string): Promise <string> {
  const font = (await fontPromise)!;

  let fontSize = height;
  let [textHeight, textWidth, textY] = [Infinity, Infinity, Infinity];
  while (textHeight > height - heightPadding || textWidth > width - widthPadding) {
    fontSize -= 1;
    const metrics = font.getMetrics(text, { fontSize });
    [textHeight, textWidth, textY] = [metrics.height, metrics.width, metrics.y];
  }

  return font.getPath(text, {
    fontSize,
    /* eslint-disable id-length */
    x: (width - textWidth) / 2,
    y: (height - textHeight) / 2 - textY,
    /* eslint-enable id-length */
    attributes: { fill: `#${Colors.White.toString(16)}` },
  });
}

export default async function generateHeader(text: string, backgroundColor: number = Colors.Blurple): Promise<Buffer> {
  return svg2png({
    input: await svgTemplate(text, backgroundColor),
    encoding: "buffer",
    format: "png",
  });
}
