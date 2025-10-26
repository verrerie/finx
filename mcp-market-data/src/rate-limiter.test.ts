import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RateLimiter } from './rate-limiter.js';

describe('RateLimiter', () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
        vi.clearAllTimers();
        vi.useFakeTimers();
    });

    it('should create a rate limiter with default limits', () => {
        rateLimiter = new RateLimiter();
        const stats = rateLimiter.getStats();

        expect(stats.callsLastMinute).toBe(0);
        expect(stats.callsLastDay).toBe(0);
    });

    it('should execute function and track call', async () => {
        rateLimiter = new RateLimiter(5, 25);
        const mockFn = vi.fn().mockResolvedValue('result');

        const promise = rateLimiter.execute(mockFn);
        await vi.runAllTimersAsync();
        const result = await promise;

        expect(result).toBe('result');
        expect(mockFn).toHaveBeenCalledTimes(1);

        const stats = rateLimiter.getStats();
        expect(stats.callsLastMinute).toBe(1);
        expect(stats.callsLastDay).toBe(1);
    });

    it('should allow multiple calls within limits', async () => {
        rateLimiter = new RateLimiter(5, 25);
        const mockFn = vi.fn().mockResolvedValue('result');

        const promises = [
            rateLimiter.execute(mockFn),
            rateLimiter.execute(mockFn),
            rateLimiter.execute(mockFn),
        ];

        await vi.runAllTimersAsync();
        const results = await Promise.all(promises);

        expect(results).toEqual(['result', 'result', 'result']);
        expect(mockFn).toHaveBeenCalledTimes(3);

        const stats = rateLimiter.getStats();
        expect(stats.callsLastMinute).toBe(3);
        expect(stats.callsLastDay).toBe(3);
    });

    it('should handle errors from executed function', async () => {
        rateLimiter = new RateLimiter(5, 25);
        const mockFn = vi.fn().mockRejectedValue(new Error('test error'));

        // Attach error handler immediately to prevent unhandled rejection
        const promise = rateLimiter.execute(mockFn);
        const errorPromise = promise.catch(err => err);

        // Run timers to execute the function
        await vi.runAllTimersAsync();

        // Now await the error
        const error = await errorPromise;

        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('test error');

        const stats = rateLimiter.getStats();
        expect(stats.callsLastMinute).toBe(1);
        expect(stats.callsLastDay).toBe(1);
    });

    it('should clean old timestamps in getStats', async () => {
        rateLimiter = new RateLimiter(5, 25);
        const mockFn = vi.fn().mockResolvedValue('result');

        // Make a call
        const promise = rateLimiter.execute(mockFn);
        await vi.runAllTimersAsync();
        await promise;

        // Advance time by 2 minutes
        vi.advanceTimersByTime(2 * 60 * 1000);

        const stats = rateLimiter.getStats();
        expect(stats.callsLastMinute).toBe(0); // Should be cleaned
        expect(stats.callsLastDay).toBe(1);    // Still within 24 hours
    });

    it('should clean timestamps older than 24 hours', async () => {
        rateLimiter = new RateLimiter(5, 25);
        const mockFn = vi.fn().mockResolvedValue('result');

        // Make a call
        const promise = rateLimiter.execute(mockFn);
        await vi.runAllTimersAsync();
        await promise;

        // Advance time by 25 hours
        vi.advanceTimersByTime(25 * 60 * 60 * 1000);

        const stats = rateLimiter.getStats();
        expect(stats.callsLastMinute).toBe(0);
        expect(stats.callsLastDay).toBe(0); // Should be cleaned
    });
});

