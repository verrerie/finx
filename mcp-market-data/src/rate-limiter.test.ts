import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRateLimiter, RateLimiter, RateLimiterConfig } from './rate-limiter.js';

describe('RateLimiter', () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
        vi.clearAllTimers();
        vi.useFakeTimers();
    });

    it('should create a rate limiter with default limits', () => {
        rateLimiter = new RateLimiter();
        const stats = rateLimiter.getStats();

        // With no config, stats will be empty object
        expect(stats).toEqual({});
    });

    it('should execute function and track call', async () => {
        rateLimiter = new RateLimiter({ callsPerMinute: 5, callsPerDay: 25 });
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
        rateLimiter = new RateLimiter({ callsPerMinute: 5, callsPerDay: 25 });
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
        rateLimiter = new RateLimiter({ callsPerMinute: 5, callsPerDay: 25 });
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
        rateLimiter = new RateLimiter({ callsPerMinute: 5, callsPerDay: 25 });
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
        rateLimiter = new RateLimiter({ callsPerMinute: 5, callsPerDay: 25 });
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

    it('should wait and retry when rate limit is exceeded', async () => {
        rateLimiter = new RateLimiter({ callsPerMinute: 2, callsPerDay: 25 }); // Very low limit: 2 calls per minute
        const mockFn = vi.fn().mockResolvedValue('result');

        // Make 2 calls to fill the limit
        const promise1 = rateLimiter.execute(mockFn);
        const promise2 = rateLimiter.execute(mockFn);
        await vi.runAllTimersAsync();
        await promise1;
        await promise2;

        // Third call should wait
        const promise3 = rateLimiter.execute(mockFn);

        // Advance time by 1 second (default wait time)
        vi.advanceTimersByTime(1000);

        // Advance time by 61 seconds to clear the minute window
        vi.advanceTimersByTime(61 * 1000);

        await vi.runAllTimersAsync();
        await promise3;

        expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should calculate wait time when limit is exceeded', async () => {
        rateLimiter = new RateLimiter({ callsPerMinute: 2, callsPerDay: 25 });
        const mockFn = vi.fn().mockResolvedValue('result');

        // Make 2 calls to fill the limit
        const promise1 = rateLimiter.execute(mockFn);
        const promise2 = rateLimiter.execute(mockFn);
        await vi.runAllTimersAsync();
        await promise1;
        await promise2;

        // Third call should wait
        const promise3 = rateLimiter.execute(mockFn);

        // Advance time to clear the window
        vi.advanceTimersByTime(62 * 1000);

        await vi.runAllTimersAsync();
        await promise3;

        expect(mockFn).toHaveBeenCalledTimes(3);
    });

    describe('Config-based rate limiter', () => {
        it('should create rate limiter with config object', () => {
            const config: RateLimiterConfig = {
                callsPerMinute: 5,
                callsPerDay: 25,
            };
            rateLimiter = new RateLimiter(config);
            const stats = rateLimiter.getStats();

            expect(stats.callsLastMinute).toBe(0);
            expect(stats.callsLastDay).toBe(0);
        });

        it('should support backward compatibility with two-argument constructor', () => {
            // Test backward compatibility path using type assertion to bypass TypeScript
            // This covers the backward compatibility code in the constructor
            rateLimiter = new (RateLimiter as any)(5, 25);
            const stats = rateLimiter.getStats();

            expect(stats.callsLastMinute).toBe(0);
            expect(stats.callsLastDay).toBe(0);
        });

        it('should support per-second limits', async () => {
            const config: RateLimiterConfig = {
                callsPerSecond: 2,
            };
            rateLimiter = new RateLimiter(config);
            const mockFn = vi.fn().mockResolvedValue('result');

            // Make 2 calls to fill the limit
            const promise1 = rateLimiter.execute(mockFn);
            const promise2 = rateLimiter.execute(mockFn);
            await vi.runAllTimersAsync();
            await promise1;
            await promise2;

            const stats = rateLimiter.getStats();
            expect(stats.callsLastSecond).toBe(2);
            expect(mockFn).toHaveBeenCalledTimes(2);
        });

        it('should support per-month limits', async () => {
            const config: RateLimiterConfig = {
                callsPerMonth: 1000,
            };
            rateLimiter = new RateLimiter(config);
            const mockFn = vi.fn().mockResolvedValue('result');

            const promise = rateLimiter.execute(mockFn);
            await vi.runAllTimersAsync();
            await promise;

            const stats = rateLimiter.getStats();
            expect(stats.callsLastMonth).toBe(1);
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        it('should support multiple limit types', async () => {
            const config: RateLimiterConfig = {
                callsPerSecond: 10,
                callsPerMinute: 5,
                callsPerDay: 25,
            };
            rateLimiter = new RateLimiter(config);
            const mockFn = vi.fn().mockResolvedValue('result');

            const promise = rateLimiter.execute(mockFn);
            await vi.runAllTimersAsync();
            await promise;

            const stats = rateLimiter.getStats();
            expect(stats.callsLastSecond).toBe(1);
            expect(stats.callsLastMinute).toBe(1);
            expect(stats.callsLastDay).toBe(1);
        });

        it('should use factory function', () => {
            const config: RateLimiterConfig = {
                callsPerMinute: 5,
                callsPerDay: 25,
            };
            rateLimiter = createRateLimiter(config);
            const stats = rateLimiter.getStats();

            expect(stats.callsLastMinute).toBe(0);
            expect(stats.callsLastDay).toBe(0);
        });

        it('should block calls when per-month limit is exceeded', async () => {
            const config: RateLimiterConfig = {
                callsPerMonth: 1,
            };
            rateLimiter = new RateLimiter(config);
            const mockFn = vi.fn().mockResolvedValue('result');

            // Make first call
            const promise1 = rateLimiter.execute(mockFn);
            await vi.runAllTimersAsync();
            await promise1;

            // Second call should be blocked (will wait indefinitely, so we just verify it doesn't execute immediately)
            const promise2 = rateLimiter.execute(mockFn);
            // Don't wait for it to complete - just verify the first call executed
            expect(mockFn).toHaveBeenCalledTimes(1);

            // Cancel the second promise to avoid infinite loop
            promise2.catch(() => { });
        });
    });
});

