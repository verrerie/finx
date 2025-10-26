/**
 * Simple in-memory cache with TTL support
 */

import { CacheEntry } from './types.js';

export class Cache {
    private store = new Map<string, CacheEntry<any>>();

    set<T>(key: string, data: T, ttlMs: number): void {
        this.store.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlMs,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.store.get(key);

        if (!entry) {
            return null;
        }

        const age = Date.now() - entry.timestamp;

        if (age > entry.ttl) {
            // Expired
            this.store.delete(key);
            return null;
        }

        return entry.data as T;
    }

    clear(): void {
        this.store.clear();
    }

    delete(key: string): void {
        this.store.delete(key);
    }

    size(): number {
        return this.store.size;
    }
}

