/**
 * Common interface for market data providers
 * 
 * This interface enables Liskov Substitution Principle (LSP) - any provider
 * implementing this interface can be substituted for another.
 */

import { CompanyInfo, HistoricalDataPoint, Period, StockQuote, SymbolSearchResult } from '../types.js';

export interface IMarketDataProvider {
    /**
     * Provider name for identification and logging
     */
    readonly name: string;

    /**
     * Get current stock quote
     * All providers must implement this
     */
    getQuote(symbol: string): Promise<StockQuote>;

    /**
     * Get comprehensive company information
     * All providers must implement this
     */
    getCompanyInfo(symbol: string): Promise<CompanyInfo>;

    /**
     * Get historical price data
     * Optional - not all providers support this
     */
    getHistoricalData?(symbol: string, period: Period): Promise<HistoricalDataPoint[]>;

    /**
     * Search for ticker symbols by company name
     * Optional - not all providers support this
     */
    searchSymbol?(query: string): Promise<SymbolSearchResult[]>;
}

/**
 * Check if provider supports historical data
 */
export function supportsHistoricalData(provider: IMarketDataProvider): provider is IMarketDataProvider & {
    getHistoricalData: (symbol: string, period: Period) => Promise<HistoricalDataPoint[]>;
} {
    return typeof provider.getHistoricalData === 'function';
}

/**
 * Check if provider supports symbol search
 */
export function supportsSymbolSearch(provider: IMarketDataProvider): provider is IMarketDataProvider & {
    searchSymbol: (query: string) => Promise<SymbolSearchResult[]>;
} {
    return typeof provider.searchSymbol === 'function';
}

