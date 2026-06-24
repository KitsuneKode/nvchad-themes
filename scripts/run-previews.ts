import { spawnSync } from "node:child_process";

const extraArgs = process.argv.slice(2);

const run = (args: string[]): void => {
  const result = spawnSync("bun", args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run(["run", "build"]);
run(["run", "scripts/generate-previews.ts", ...extraArgs]);
run(["run", "scripts/render-preview-raster.ts", ...extraArgs]);
