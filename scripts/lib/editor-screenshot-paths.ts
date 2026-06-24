import { existsSync } from "node:fs";
import { resolve } from "node:path";

export type EditorScreenshotKind = "cursor" | "zed";

const SCREENSHOT_EXTENSIONS = [".png", ".webp", ".jpg", ".jpeg"] as const;

export const editorScreenshotDir = (kind: EditorScreenshotKind): string =>
  resolve("assets", "screenshots", kind);

/** First matching manual screenshot in `assets/screenshots/{cursor|zed}/{id}.{png,webp,jpg}`. */
export const findEditorScreenshot = (
  kind: EditorScreenshotKind,
  themeId: string
): string | undefined => {
  const dir = editorScreenshotDir(kind);
  for (const ext of SCREENSHOT_EXTENSIONS) {
    const filePath = resolve(dir, `${themeId}${ext}`);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
  return undefined;
};
