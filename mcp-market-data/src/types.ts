/**
 * Type definitions for Market Data MCP Server
 */

export interface StockQuote {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: number;
    peRatio?: number;
    weekHigh52?: number;
    weekLow52?: number;
    timestamp: Date;
}

export interface HistoricalDataPoint {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface SymbolSearchResult {
    symbol: string;
    name: string;
    exchange: string;
    type: string;
}

export interface CompanyInfo {
    symbol: string;
    name: string;
    description: string;
    sector: string;
    industry: string;
    marketCap: number;

    // Financial metrics
    peRatio?: number;
    pbRatio?: number;
    dividendYield?: number;
    eps?: number;
    beta?: number;

    // Profitability
    profitMargin?: number;
    operatingMargin?: number;
    returnOnEquity?: number;
    returnOnAssets?: number;

    // Financial health
    debtToEquity?: number;
    currentRatio?: number;

    // Growth
    revenueGrowth?: number;
    earningsGrowth?: number;

    // Other
    revenue?: number;
    grossProfit?: number;
    weekHigh52?: number;
    weekLow52?: number;

    lastUpdated: Date;
}

export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

export type Period = '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | 'max';

