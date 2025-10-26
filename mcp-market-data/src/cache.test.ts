import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Cache } from './cache.js';

describe('Cache', () => {
    let cache: Cache;

    beforeEach(() => {
        cache = new Cache();
        vi.useFakeTimers();
    });

    it('should store and retrieve values', () => {
        cache.set('test-key', { data: 'test-value' }, 1000);
        const result = cache.get('test-key');
        expect(result).toEqual({ data: 'test-value' });
    });

    it('should return null for non-existent keys', () => {
        const result = cache.get('non-existent');
        expect(result).toBeNull();
    });

    it('should expire values after TTL', () => {
        cache.set('test-key', { data: 'test-value' }, 1000);

        // Advance time by 500ms - should still be cached
        vi.advanceTimersByTime(500);
        expect(cache.get('test-key')).toEqual({ data: 'test-value' });

        // Advance time by another 600ms - should be expired
        vi.advanceTimersByTime(600);
        expect(cache.get('test-key')).toBeNull();
    });

    it('should update existing values', () => {
        cache.set('test-key', { data: 'old-value' }, 1000);
        cache.set('test-key', { data: 'new-value' }, 1000);
        expect(cache.get('test-key')).toEqual({ data: 'new-value' });
    });

    it('should handle multiple keys independently', () => {
        cache.set('key1', { data: 'value1' }, 1000);
        cache.set('key2', { data: 'value2' }, 2000);

        vi.advanceTimersByTime(1500);

        expect(cache.get('key1')).toBeNull();
        expect(cache.get('key2')).toEqual({ data: 'value2' });
    });

    it('should clear cache', () => {
        cache.set('key1', { data: 'value1' }, 1000);
        cache.set('key2', { data: 'value2' }, 1000);

        cache.clear();

        expect(cache.get('key1')).toBeNull();
        expect(cache.get('key2')).toBeNull();
    });
});

