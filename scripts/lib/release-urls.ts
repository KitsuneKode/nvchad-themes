import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const REPO_URL = "https://github.com/KitsuneKode/nvchad-themes";
export const RELEASES_LATEST = `${REPO_URL}/releases/latest`;
export const RELEASE_DOWNLOAD_BASE = `${REPO_URL}/releases/latest/download`;

export type PackageMeta = {
  name: string;
  version: string;
};

export const readPackageMeta = (rootDir = resolve(".")): PackageMeta => {
  const packageJson = JSON.parse(readFileSync(resolve(rootDir, "package.json"), "utf8")) as PackageMeta;
  return packageJson;
};

export const artifactNames = (version: string, packageName = "nvchad-themes") => ({
  vsix: `${packageName}-${version}.vsix`,
  zedExtensionZip: `${packageName}-zed-extension-${version}.zip`,
  zedUserTheme: `${packageName}-zed-user-${version}.json`,
  checksums: "checksums.sha256"
});

export const releaseDownloadUrl = (filename: string): string =>
  `${RELEASE_DOWNLOAD_BASE}/${filename}`;
