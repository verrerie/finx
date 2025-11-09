/**
 * Common interface for market data providers
 * 
 * This interface enables Liskov Substitution Principle (LSP) - any provider
 * implementing this interface can be substituted for another.
 */

import { CompanyInfo, EconomicIndicator, FinancialStatement, HistoricalDataPoint, Period, StatementType, StockQuote, SymbolSearchResult } from '../types.js';
import { ExplainFundamentalResult, ComparePeersResult } from '../services/educational.service.js';

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

    /**
     * Get an educational explanation of a financial metric
     * Optional - not all providers support this
     */
    explainFundamental?(metric: string, symbol?: string): Promise<ExplainFundamentalResult>;

    /**
     * Compare a stock against sector peers
     * Optional - not all providers support this
     */
    comparePeers?(symbol: string, sector?: string, metrics?: string[]): Promise<ComparePeersResult>;

    /**
     * Get financial news
     * Optional - not all providers support this
     */
    getNews?(symbol?: string, topic?: string): Promise<any[]>;

    /**
     * Get financial statements (income statement, balance sheet, cash flow)
     * Optional - not all providers support this
     */
    getFinancialStatements?(symbol: string, statementType: StatementType, period?: 'annual' | 'quarter'): Promise<FinancialStatement[]>;

    /**
     * Get economic indicator data from FRED
     * Optional - not all providers support this
     */
    getEconomicIndicator?(seriesId: string, startDate?: string, endDate?: string): Promise<EconomicIndicator>;
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

/**
 * Check if provider supports news
 */
export function supportsNews(provider: IMarketDataProvider): provider is IMarketDataProvider & {
    getNews: (symbol?: string, topic?: string) => Promise<any[]>;
} {
    return typeof provider.getNews === 'function';
}

/**
 * Check if provider supports financial statements
 */
export function supportsFinancialStatements(provider: IMarketDataProvider): provider is IMarketDataProvider & {
    getFinancialStatements: (symbol: string, statementType: StatementType, period?: 'annual' | 'quarter') => Promise<FinancialStatement[]>;
} {
    return typeof provider.getFinancialStatements === 'function';
}

/**
 * Check if provider supports economic indicators
 */
export function supportsEconomicIndicators(provider: IMarketDataProvider): provider is IMarketDataProvider & {
    getEconomicIndicator: (seriesId: string, startDate?: string, endDate?: string) => Promise<EconomicIndicator>;
} {
    return typeof provider.getEconomicIndicator === 'function';
}

