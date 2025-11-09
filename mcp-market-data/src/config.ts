/**
 * Configuration constants for the Market Data MCP Server
 */

export const config = {
    // Cache TTL (Time To Live) settings
    CACHE_TTL: {
        QUOTE: 5 * 60 * 1000,      // 5 minutes
        COMPANY_INFO: 24 * 60 * 60 * 1000, // 24 hours
        SEARCH: 60 * 60 * 1000,    // 1 hour
        NEWS: 5 * 60 * 1000,       // 5 minutes
    } as const,

    // Rate limiter settings (Alpha Vantage free tier)
    RATE_LIMITS: {
        CALLS_PER_MINUTE: 5,
        CALLS_PER_DAY: 25,
    } as const,

    // Financial Modeling Prep rate limit settings (free tier: 250 calls/day)
    FMP_RATE_LIMITS: {
        CALLS_PER_DAY: 250,
    } as const,

    // FRED rate limit settings (free tier: 10 requests/second)
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

