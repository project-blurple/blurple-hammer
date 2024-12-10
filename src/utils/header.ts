import { Colors } from "discord.js";
import { join } from "path";
import svg2img from "svg2img";
import TextToSVG from "text-to-svg";
import { promisify } from "util";

const fontPromise = promisify(TextToSVG.load)(join(__dirname, "../../web/fonts/Ginto-Nord-700.woff"));

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
  return new Promise(resolve => {
    void svgTemplate(text, backgroundColor).then(svg => {
      svg2img(svg, (error: Error | null, buffer: Buffer | null) => {
        if (error) throw error;
        if (buffer) resolve(buffer);
      });
    });
  });
}
