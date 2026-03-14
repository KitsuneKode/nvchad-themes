import {
  copyFileSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
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
const tempDir = mkdtempSync(resolve(tmpdir(), "rxyhn-theme-"));
const unpackDir = resolve(tempDir, "vsix");
const extensionDir = resolve(unpackDir, "extension");

run(["bun", "run", "build"]);
run(["bunx", "@vscode/vsce", "package", "--allow-missing-repository"]);

mkdirSync(extensionDir, { recursive: true });
run(["unzip", "-oq", vsixPath, "-d", unpackDir]);

copyFileSync(resolve(rootDir, "package.json"), resolve(extensionDir, "package.json"));
copyFileSync(resolve(rootDir, "README.md"), resolve(extensionDir, "readme.md"));
copyFileSync(resolve(rootDir, "LICENSE"), resolve(extensionDir, "LICENSE"));
mkdirSync(resolve(extensionDir, "themes"), { recursive: true });
cpSync(resolve(rootDir, "themes", "rxyhn-color-theme.json"), resolve(extensionDir, "themes", "rxyhn-color-theme.json"));

const rebuiltVsixPath = resolve(tempDir, vsixName);
run(["zip", "-qr", rebuiltVsixPath, "[Content_Types].xml", "extension.vsixmanifest", "extension"], unpackDir);
copyFileSync(rebuiltVsixPath, vsixPath);

rmSync(tempDir, { recursive: true, force: true });

console.log(`Packaged ${vsixPath}`);
