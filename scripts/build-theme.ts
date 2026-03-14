import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildTheme, buildZedTheme } from "../src/theme.ts";

const vscodeThemePath = resolve("themes/rxyhn-color-theme.json");
const zedThemePath = resolve("zed/nvchad-rxyhn.json");

mkdirSync(dirname(vscodeThemePath), { recursive: true });
mkdirSync(dirname(zedThemePath), { recursive: true });

const vscodeOutput = `${JSON.stringify(buildTheme(), null, 2)}\n`;
const zedOutput = `${JSON.stringify(buildZedTheme(), null, 2)}\n`;

await Bun.write(vscodeThemePath, vscodeOutput);
await Bun.write(zedThemePath, zedOutput);

console.log(`Generated ${vscodeThemePath}`);
console.log(`Generated ${zedThemePath}`);
