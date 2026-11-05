interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface CacheStore {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown, ttlMs: number): Promise<void>;
}

export class MemoryCacheStore implements CacheStore {
  private readonly map = new Map<string, CacheEntry<unknown>>();

  get(key: string): Promise<unknown> {
    const entry = this.map.get(key);
    if (!entry) return Promise.resolve(undefined);
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return Promise.resolve(undefined);
    }
    return Promise.resolve(entry.value);
  }

  set(key: string, value: unknown, ttlMs: number): Promise<void> {
    this.map.set(key, { value, expiresAt: Date.now() + ttlMs });
    return Promise.resolve();
  }
}

/**
 * Optional Redis cache — falls back to memory when REDIS_URL is unset.
 * TODO: wire ioredis when REDIS_URL is provided.
 */
export function createCacheStore(redisUrl?: string): CacheStore {
  if (redisUrl) {
    // Placeholder: same in-memory until Redis dependency is added.
  }
  return new MemoryCacheStore();
}

export const CACHE_TTL_MS = {
  snapshot: 10 * 60 * 1000,
  daily: 60 * 60 * 1000,
} as const;
