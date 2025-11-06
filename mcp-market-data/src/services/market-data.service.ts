/**
 * Market Data Service
 * 
 * Implements Single Responsibility Principle (SRP) by handling all market data
 * business logic in one place, separated from server/routing concerns.
 * 
 * Implements Dependency Inversion Principle (DIP) by depending on interfaces
 * rather than concrete implementations.
 */

import { Cache } from '../cache.js';
import { CACHE_TTL } from '../config.js';
import { IMarketDataProvider, supportsHistoricalData, supportsSymbolSearch } from '../interfaces/market-data-provider.interface.js';
import { RateLimiter } from '../rate-limiter.js';
import { CompanyInfo, HistoricalDataPoint, Period, StockQuote, SymbolSearchResult } from '../types.js';
import { EducationalService, ExplainFundamentalResult, ComparePeersResult } from './educational.service.js';


export interface GetQuoteResult {
    data: StockQuote;
    source: string;
    cached: boolean;
    rateLimitInfo?: string;
}

export interface GetCompanyInfoResult {
    data: CompanyInfo;
    source: string;
    cached: boolean;
    rateLimitInfo?: string;
}

export interface GetHistoricalDataResult {
    data: HistoricalDataPoint[];
    source: string;
    metadata: string;
}

export interface SearchSymbolResult {
    data: SymbolSearchResult[];
    source: string;
    metadata: string;
    rateLimitInfo?: string;
}


/**
 * Service for handling market data operations
 */
export class MarketDataService {
    private educationalService: EducationalService;

    constructor(
        private cache: Cache,
        private rateLimiter: RateLimiter,
        private primaryProvider: IMarketDataProvider | null,
        private fallbackProvider: IMarketDataProvider
    ) {
        this.educationalService = new EducationalService(this.cache, this.fallbackProvider, [this.primaryProvider, this.fallbackProvider].filter(p => p) as IMarketDataProvider[]);
    }

    /**
     * Get stock quote with caching and provider fallback
     */
    async getQuote(symbol: string): Promise<GetQuoteResult> {
        const upperSymbol = symbol.toUpperCase();
        const cacheKey = `quote:${upperSymbol}`;

        // Check cache first
        const cached = this.cache.get<StockQuote>(cacheKey);
        if (cached) {
            return {
                data: cached,
                source: 'Cache',
                cached: true,
            };
        }

        // Try primary provider first (with rate limiting)
        if (this.primaryProvider) {
            try {
                const quote = await this.rateLimiter.execute(() =>
                    this.primaryProvider!.getQuote(upperSymbol)
                );
                this.cache.set(cacheKey, quote, CACHE_TTL.QUOTE);

                const stats = this.rateLimiter.getStats();
                return {
                    data: quote,
                    source: this.primaryProvider.name,
                    cached: false,
                    rateLimitInfo: `API calls: ${stats.callsLastDay}/25 today, ${stats.callsLastMinute}/5 this minute`,
                };
            } catch (error) {
                console.error(`${this.primaryProvider.name} failed, falling back to ${this.fallbackProvider.name}:`, error);
            }
        }

        // Fallback provider
        const quote = await this.fallbackProvider.getQuote(upperSymbol);
        this.cache.set(cacheKey, quote, CACHE_TTL.QUOTE);

        return {
            data: quote,
            source: this.fallbackProvider.name,
            cached: false,
        };
    }

    /**
     * Get company information with caching and provider fallback
     */
    async getCompanyInfo(symbol: string): Promise<GetCompanyInfoResult> {
        const upperSymbol = symbol.toUpperCase();
        const cacheKey = `company:${upperSymbol}`;

        // Check cache first
        const cached = this.cache.get<CompanyInfo>(cacheKey);
        if (cached) {
            return {
                data: cached,
                source: 'Cache',
                cached: true,
            };
        }

        // Try primary provider first (with rate limiting)
        if (this.primaryProvider) {
            try {
                const info = await this.rateLimiter.execute(() =>
                    this.primaryProvider!.getCompanyInfo(upperSymbol)
                );
                this.cache.set(cacheKey, info, CACHE_TTL.COMPANY_INFO);

                const stats = this.rateLimiter.getStats();
                return {
                    data: info,
                    source: this.primaryProvider.name,
                    cached: false,
                    rateLimitInfo: `API calls: ${stats.callsLastDay}/25 today`,
                };
            } catch (error) {
                console.error(`${this.primaryProvider.name} failed, falling back to ${this.fallbackProvider.name}:`, error);
            }
        }

        // Fallback provider
        const info = await this.fallbackProvider.getCompanyInfo(upperSymbol);
        this.cache.set(cacheKey, info, CACHE_TTL.COMPANY_INFO);

        return {
            data: info,
            source: this.fallbackProvider.name,
            cached: false,
        };
    }

    /**
     * Get historical data (uses provider with best support)
     */
    async getHistoricalData(symbol: string, period: Period = '1y'): Promise<GetHistoricalDataResult> {
        const upperSymbol = symbol.toUpperCase();

        // Yahoo Finance is best for historical data
        if (supportsHistoricalData(this.fallbackProvider)) {
            const data = await this.fallbackProvider.getHistoricalData(upperSymbol, period);
            return {
                data,
                source: this.fallbackProvider.name,
                metadata: `${data.length} data points over ${period}`,
            };
        }

        throw new Error('No provider supports historical data');
    }

    /**
     * Search for symbols
     */
    async searchSymbol(query: string): Promise<SearchSymbolResult> {
        // Alpha Vantage has better symbol search
        if (this.primaryProvider && supportsSymbolSearch(this.primaryProvider)) {
            const results = await this.rateLimiter.execute(() =>
                this.primaryProvider!.searchSymbol!(query)
            );

            const stats = this.rateLimiter.getStats();
            return {
                data: results,
                source: this.primaryProvider.name,
                metadata: `Found ${results.length} matches`,
                rateLimitInfo: `API calls: ${stats.callsLastDay}/25 today`,
            };
        }

        throw new Error('Symbol search requires Alpha Vantage API key. Please set ALPHA_VANTAGE_API_KEY environment variable.\n\nTip: You can find ticker symbols at https://finance.yahoo.com');
    }

    /**
     * Get explanation for a financial metric
     */
    async explainFundamental(metric: string, symbol?: string): Promise<ExplainFundamentalResult> {
        return this.educationalService.explainFundamental(metric, symbol);
    }

    /**
     * Compare a stock against sector peers
     */
    async comparePeers(symbol: string, sector?: string, metrics?: string[]): Promise<ComparePeersResult> {
        return this.educationalService.comparePeers(symbol, sector, metrics);
    }

}
