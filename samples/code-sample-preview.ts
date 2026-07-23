export type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const TTL_MS = 60_000;
const cache = new Map<string, CacheEntry<unknown>>();

/** Load a JSON config, with a short-lived in-memory cache. */
export async function loadConfig<T>(path: string): Promise<T> {
  const hit = cache.get(path) as CacheEntry<T> | undefined;
  if (hit && hit.expiresAt > Date.now()) {
    return hit.value;
  }

  const value = (await Bun.file(path).json()) as T;
  cache.set(path, { value, expiresAt: Date.now() + TTL_MS });
  return value;
}

export function fingerprint(input: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(input);
  return hasher.digest("hex").slice(0, 12);
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(2)} MB`;
}

const VERSION = /^v?(\d+)\.(\d+)\.(\d+)$/;

export function parseVersion(tag: string): [number, number, number] | null {
  const m = VERSION.exec(tag);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}
