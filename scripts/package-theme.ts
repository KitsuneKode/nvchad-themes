import {
  copyFileSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const run = (cmd: string[], cwd = resolve(".")) => {
  const result = Bun.spawnSync({
    cmd,
    cwd,
    stdout: "inherit",
    stderr: "inherit",
    env: process.env
  });

  if (result.exitCode !== 0) {
    process.exit(result.exitCode ?? 1);
  }
};

const rootDir = resolve(".");
const packageJson = JSON.parse(readFileSync(resolve(rootDir, "package.json"), "utf8")) as {
  name: string;
  version: string;
};
const vsixName = `${packageJson.name}-${packageJson.version}.vsix`;
const vsixPath = resolve(rootDir, vsixName);
const tempDir = mkdtempSync(resolve(tmpdir(), "nvchad-themes-"));
const unpackDir = resolve(tempDir, "vsix");
const extensionDir = resolve(unpackDir, "extension");

run(["bun", "run", "build"]);
run(["bunx", "@vscode/vsce", "package", "--allow-missing-repository"]);

mkdirSync(extensionDir, { recursive: true });
run(["unzip", "-oq", vsixPath, "-d", unpackDir]);

for (const entry of readdirSync(extensionDir)) {
  rmSync(resolve(extensionDir, entry), { recursive: true, force: true });
}

copyFileSync(resolve(rootDir, "package.json"), resolve(extensionDir, "package.json"));
copyFileSync(resolve(rootDir, "README.md"), resolve(extensionDir, "readme.md"));
copyFileSync(resolve(rootDir, "LICENSE"), resolve(extensionDir, "LICENSE"));
cpSync(resolve(rootDir, "themes"), resolve(extensionDir, "themes"), { recursive: true });

const rebuiltVsixPath = resolve(tempDir, vsixName);
run(["zip", "-qr", rebuiltVsixPath, "[Content_Types].xml", "extension.vsixmanifest", "extension"], unpackDir);
copyFileSync(rebuiltVsixPath, vsixPath);

rmSync(tempDir, { recursive: true, force: true });

console.log(`Packaged ${vsixPath}`);
