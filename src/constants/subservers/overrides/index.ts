import type { Subserver } from "..";
import { readdirSync } from "fs";

const files = readdirSync(__dirname).filter(file => file !== "index.ts" && file !== ".gitignore");

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires -- we need this for it to be synchronous
const overrides = files.map(file => require(`./${file}`).default as Subserver).filter(Boolean);

export default overrides;
