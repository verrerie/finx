/**
 * Configuration constants for the Market Data MCP Server
 */

// Cache TTL (Time To Live) settings
export const CACHE_TTL = {
    QUOTE: 5 * 60 * 1000,      // 5 minutes
    COMPANY_INFO: 24 * 60 * 60 * 1000, // 24 hours
    SEARCH: 60 * 60 * 1000,    // 1 hour
} as const;

// Rate limiter settings (Alpha Vantage free tier)
export const RATE_LIMITS = {
    CALLS_PER_MINUTE: 5,
    CALLS_PER_DAY: 25,
} as const;

// Environment variables
export const ENV = {
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY || '',
} as const;

