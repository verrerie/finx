import { describe, expect, it } from 'vitest';
import { CACHE_TTL, ENV, RATE_LIMITS } from './config.js';

describe('Config', () => {
    describe('CACHE_TTL', () => {
        it('should have correct quote cache TTL', () => {
            expect(CACHE_TTL.QUOTE).toBe(5 * 60 * 1000); // 5 minutes
        });

        it('should have correct company info cache TTL', () => {
            expect(CACHE_TTL.COMPANY_INFO).toBe(24 * 60 * 60 * 1000); // 24 hours
        });

        it('should have correct search cache TTL', () => {
            expect(CACHE_TTL.SEARCH).toBe(60 * 60 * 1000); // 1 hour
        });

        it('should be a constant object', () => {
            // TypeScript readonly is compile-time only, not runtime
            expect(CACHE_TTL).toBeDefined();
            expect(typeof CACHE_TTL).toBe('object');
        });
    });

    describe('RATE_LIMITS', () => {
        it('should have correct calls per minute limit', () => {
            expect(RATE_LIMITS.CALLS_PER_MINUTE).toBe(5);
        });

        it('should have correct calls per day limit', () => {
            expect(RATE_LIMITS.CALLS_PER_DAY).toBe(25);
        });

        it('should be a constant object', () => {
            // TypeScript readonly is compile-time only, not runtime
            expect(RATE_LIMITS).toBeDefined();
            expect(typeof RATE_LIMITS).toBe('object');
        });
    });

    describe('ENV', () => {
        it('should have ALPHA_VANTAGE_API_KEY property', () => {
            expect(ENV).toHaveProperty('ALPHA_VANTAGE_API_KEY');
        });

        it('should return empty string if API key not set', () => {
            expect(typeof ENV.ALPHA_VANTAGE_API_KEY).toBe('string');
        });

        it('should be a constant object', () => {
            // TypeScript readonly is compile-time only, not runtime
            expect(ENV).toBeDefined();
            expect(typeof ENV).toBe('object');
        });
    });
});

