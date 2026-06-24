export const CODE_SAMPLE = `// NvChad theme preview sample
import { ThemeSpec } from "./types";

/** Greets the user with syntax-rich highlighting */
export function greet(name: string, count = 1): string {
  const message = \`Hello, \${name}!\`;
  if (count > 1) {
    return Array(count).fill(message).join(" ");
  }
  return message;
}

const numbers = [1, 2.5, 0xff];
const pattern = /^[a-z]+$/;
const ok: boolean = numbers.length > 0;

class ThemeBuilder {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  build(theme: ThemeSpec): Record<string, string> {
    return { background: theme.base30.black };
  }
}

export default new ThemeBuilder("kanagawa");
`;
