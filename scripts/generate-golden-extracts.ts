import { generateHeroGoldens } from "./lib/golden-extract.ts";

const args = process.argv.slice(2);
const check = args.includes("--check");
const tuned = args.includes("--tuned");
const vscode = !args.includes("--zed-only");

const ok = generateHeroGoldens({ check, tuned, vscode });
if (!ok) {
  process.exit(1);
}
