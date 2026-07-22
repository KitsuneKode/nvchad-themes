import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const evergreenDocs = ["README.md", "PUBLISHING.md", "zed-extension/README.md"];
const failures: string[] = [];

for (const file of evergreenDocs) {
  const contents = readFileSync(resolve(file), "utf8");
  if (/releases\/latest\/download\/[^\n]*-\d+\.\d+\.\d+\./.test(contents)) {
    failures.push(`${file} contains a version-pinned latest-release asset URL`);
  }
}

const readme = readFileSync(resolve("README.md"), "utf8");
if (!readme.includes("Zed Extensions") || !readme.includes("NvChad Themes")) {
  failures.push("README.md must describe the published Zed Extensions install path");
}

const publishing = readFileSync(resolve("PUBLISHING.md"), "utf8");
for (const requiredText of [
  'path = "zed-extension"',
  "pnpm sort-extensions",
  "public Git submodule",
  "HTTPS",
  "checked-out submodule commit"
]) {
  if (!publishing.includes(requiredText)) {
    failures.push(`PUBLISHING.md is missing required registry guidance: ${requiredText}`);
  }
}

for (const file of ["README.md", "INSTALL.md", "PUBLISHING.md", "zed-extension/README.md"]) {
  if (!existsSync(resolve(file))) {
    failures.push(`Missing release documentation file: ${file}`);
  }
}

if (failures.length > 0) {
  console.error("Docs check failed:");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log("Docs check passed: evergreen release links and Zed publishing guidance are current.");
