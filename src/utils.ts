import type { ThemeSpec } from "./types.ts";

export const alpha = (hex: string, opacity: number): string => {
  const normalized = hex.length === 9 ? hex.slice(0, 7) : hex;
  const clamped = Math.max(0, Math.min(1, opacity));
  const channel = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, "0");

  return `${normalized}${channel}`;
};

export const mixColors = (base: string, blend: string, ratio: number): string => {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16)
  ];
  const b = parse(base.length === 9 ? base.slice(0, 7) : base);
  const m = parse(blend.length === 9 ? blend.slice(0, 7) : blend);
  const r = b.map((c, i) => Math.round(c + (m[i]! - c) * ratio));
  return `#${r.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
};

export const overlay = (theme: ThemeSpec, color: string, opacity: number): string => {
  const base = theme.type === "light" ? theme.base30.white : theme.base30.black;
  return alpha(mixColors(base, color, opacity), 1);
};

export const lineHighlight = (theme: ThemeSpec): string => {
  const tint = theme.type === "light" ? theme.base30.black : theme.base30.white;
  return alpha(tint, theme.type === "light" ? 0.04 : 0.03);
};

export const lineHighlightBorder = (theme: ThemeSpec): string => {
  const tint = theme.type === "light" ? theme.base30.black : theme.base30.white;
  return alpha(tint, theme.type === "light" ? 0.06 : 0.05);
};

export const contrastForeground = (theme: ThemeSpec, onAccent = false): string => {
  if (onAccent) {
    return theme.type === "light" ? theme.base30.white : theme.base30.black;
  }
  return theme.base30.white;
};

export const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");

export const plistIndent = (level: number): string => "  ".repeat(level);

export const renderPlistValue = (
  value: string | number | boolean | Record<string, unknown> | Array<unknown>,
  level: number
): string => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${plistIndent(level)}<array/>`;
    }

    return [
      `${plistIndent(level)}<array>`,
      ...value.map((entry) =>
        renderPlistValue(entry as string | number | boolean | Record<string, unknown> | Array<unknown>, level + 1)
      ),
      `${plistIndent(level)}</array>`
    ].join("\n");
  }

  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value);

    if (entries.length === 0) {
      return `${plistIndent(level)}<dict/>`;
    }

    const lines = [`${plistIndent(level)}<dict>`];

    for (const [key, entry] of entries) {
      lines.push(`${plistIndent(level + 1)}<key>${escapeXml(key)}</key>`);
      lines.push(
        renderPlistValue(entry as string | number | boolean | Record<string, unknown> | Array<unknown>, level + 1)
      );
    }

    lines.push(`${plistIndent(level)}</dict>`);
    return lines.join("\n");
  }

  if (typeof value === "boolean") {
    return `${plistIndent(level)}<${value ? "true" : "false"}/>`;
  }

  if (typeof value === "number") {
    return `${plistIndent(level)}<integer>${value}</integer>`;
  }

  return `${plistIndent(level)}<string>${escapeXml(value)}</string>`;
};

export const snakeToCamel = (key: string): string =>
  key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());

export const formatThemeName = (id: string): string =>
  id
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const isHexColor = (value: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(value);
