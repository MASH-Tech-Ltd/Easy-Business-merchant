/**
 * Lightweight in-memory SWR (stale-while-revalidate) cache for merchant dashboard pages.
 * Allows instant rendering on client-side navigation while silently refreshing data
 * in the background.
 */
const cacheStore = new Map<string, { data: unknown; updatedAt: number }>();

export function getClientCache<T>(key: string): T | null {
  const entry = cacheStore.get(key);
  return entry ? (entry.data as T) : null;
}

export function setClientCache<T>(key: string, data: T): T {
  if (cacheStore.size > 200) {
    const oldestKey = cacheStore.keys().next().value;
    if (oldestKey) cacheStore.delete(oldestKey);
  }
  cacheStore.set(key, { data, updatedAt: Date.now() });
  return data;
}

export function invalidateClientCache(prefix: string): void {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
}
