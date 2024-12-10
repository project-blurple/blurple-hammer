import { readdirSync } from "fs";
import type { Subserver } from "..";

const files = readdirSync(__dirname).filter(file => file !== "index.ts" && file !== ".gitignore");

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports -- we need this for it to be synchronous
const overrides = files.map(file => require(`./${file}`).default as Subserver).filter(Boolean);

export default overrides;
