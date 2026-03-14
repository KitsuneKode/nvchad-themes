import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildTheme, buildZedTheme, themeCatalog } from "../src/theme.ts";

for (const theme of themeCatalog) {
  const vscodeThemePath = resolve("themes", `${theme.id}-color-theme.json`);
  const zedThemePath = resolve("zed", `${theme.id}-theme.json`);

  mkdirSync(dirname(vscodeThemePath), { recursive: true });
  mkdirSync(dirname(zedThemePath), { recursive: true });

  const vscodeOutput = `${JSON.stringify(buildTheme(theme), null, 2)}\n`;
  const zedOutput = `${JSON.stringify(buildZedTheme(theme), null, 2)}\n`;

  await Bun.write(vscodeThemePath, vscodeOutput);
  await Bun.write(zedThemePath, zedOutput);

  console.log(`Generated ${vscodeThemePath}`);
  console.log(`Generated ${zedThemePath}`);
}

const packagePath = resolve("package.json");
const packageJson = JSON.parse(readFileSync(packagePath, "utf8")) as Record<string, unknown>;
const contributes = (packageJson.contributes ?? {}) as Record<string, unknown>;

contributes.themes = themeCatalog.map((theme) => ({
  label: theme.displayName,
  uiTheme: "vs-dark",
  path: `./themes/${theme.id}-color-theme.json`
}));

packageJson.contributes = contributes;

writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
console.log(`Synced ${packagePath}`);
