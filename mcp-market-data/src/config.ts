/**
 * Configuration constants for the Market Data MCP Server
 */

import { RateLimiterConfig } from './rate-limiter.js';

export const config = {
    // Cache TTL (Time To Live) settings
    CACHE_TTL: {
        QUOTE: 5 * 60 * 1000,      // 5 minutes
        COMPANY_INFO: 24 * 60 * 60 * 1000, // 24 hours
        SEARCH: 60 * 60 * 1000,    // 1 hour
        NEWS: 5 * 60 * 1000,       // 5 minutes
    } as const,

    // Rate limiter configurations for each provider
    RATE_LIMIT_CONFIGS: {
        // Alpha Vantage free tier: 5 calls/minute, 25 calls/day
        ALPHA_VANTAGE: {
            callsPerMinute: 5,
            callsPerDay: 25,
        } as RateLimiterConfig,

        // Financial Modeling Prep free tier: 250 calls/day
        FINANCIAL_MODELING_PREP: {
            callsPerDay: 250,
        } as RateLimiterConfig,

        // FRED free tier: 10 requests/second (unlimited)
        FRED: {
            callsPerSecond: 10,
        } as RateLimiterConfig,

        // IEX Cloud free tier: 50,000 messages/month (if added in future)
        IEX_CLOUD: {
            callsPerMonth: 50000,
        } as RateLimiterConfig,
    } as const,

    // Legacy rate limiter settings (for backward compatibility)
    RATE_LIMITS: {
        CALLS_PER_MINUTE: 5,
        CALLS_PER_DAY: 25,
    } as const,

    // Legacy Financial Modeling Prep rate limit settings (for backward compatibility)
    FMP_RATE_LIMITS: {
        CALLS_PER_DAY: 250,
    } as const,

    // Legacy FRED rate limit settings (for backward compatibility)
    FRED_RATE_LIMITS: {
        CALLS_PER_SECOND: 10,
    } as const,

    // Cache TTL for financial statements
    CACHE_TTL_FINANCIAL_STATEMENTS: 24 * 60 * 60 * 1000, // 24 hours

    // Cache TTL for economic data
    CACHE_TTL_ECONOMIC_DATA: 24 * 60 * 60 * 1000, // 24 hours

    // Environment variables
    ENV: {
        ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY || '',
        FMP_API_KEY: process.env.FMP_API_KEY || '',
        FRED_API_KEY: process.env.FRED_API_KEY || '',
    } as const,
};

