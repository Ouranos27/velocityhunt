import { SparkRepo } from "./scoring";

interface CacheEntry {
  data: SparkRepo[];
  timestamp: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 100; // Max number of cached queries
  private ttl = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  get(key: string): SparkRepo[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: SparkRepo[]): void {
    // Implement simple LRU: if cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const memoryCache = new MemoryCache();
