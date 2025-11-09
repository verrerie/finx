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
import { config } from '../config.js';
import { IMarketDataProvider, supportsEconomicIndicators, supportsFinancialStatements, supportsHistoricalData, supportsNews, supportsSymbolSearch } from '../interfaces/market-data-provider.interface.js';
import { RateLimiter } from '../rate-limiter.js';
import { CompanyInfo, EconomicIndicator, FinancialStatement, HistoricalDataPoint, Period, StatementType, StockQuote, SymbolSearchResult } from '../types.js';
import { ComparePeersResult, EducationalService, ExplainFundamentalResult } from './educational.service.js';


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

export interface GetNewsResult {
    data: any[];
    source: string;
    metadata: string;
}

export interface GetFinancialStatementsResult {
    data: FinancialStatement[];
    source: string;
    metadata: string;
}

export interface GetEconomicIndicatorResult {
    data: EconomicIndicator;
    source: string;
    metadata: string;
}


/**
 * Service for handling market data operations
 */
export class MarketDataService {
    private educationalService: EducationalService;

    constructor(
        private cache: Cache,
        private rateLimiters: {
            primary: RateLimiter | null;
            financialModelingPrep: RateLimiter | null;
            fred: RateLimiter | null;
        },
        private primaryProvider: IMarketDataProvider | null,
        private financialModelingPrepProvider: IMarketDataProvider | null,
        private fredProvider: IMarketDataProvider | null,
        private fallbackProvider: IMarketDataProvider
    ) {
        const allProviders = [this.primaryProvider, this.financialModelingPrepProvider, this.fredProvider, this.fallbackProvider].filter(p => p) as IMarketDataProvider[];
        this.educationalService = new EducationalService(this.cache, this.fallbackProvider, allProviders);
    }

    /**
     * Generic helper method to fetch data with caching and provider fallback.
     * Eliminates code duplication between getQuote and getCompanyInfo.
     * Provider priority: Alpha Vantage → Yahoo Finance
     */
    private async fetchWithCacheAndFallback<T>(
        cacheKey: string,
        fetchFromPrimary: () => Promise<T>,
        fetchFromFallback: () => Promise<T>,
        cacheTtl: number,
        includeMinuteStats: boolean = false
    ): Promise<{ data: T; source: string; cached: boolean; rateLimitInfo?: string }> {
        // Check cache first
        const cached = this.cache.get<T>(cacheKey);
        if (cached) {
            return {
                data: cached,
                source: 'Cache',
                cached: true,
            };
        }

        // Try primary provider (Alpha Vantage) with rate limiting
        if (this.primaryProvider && this.rateLimiters.primary) {
            try {
                const data = await this.rateLimiters.primary.execute(fetchFromPrimary);
                this.cache.set(cacheKey, data, cacheTtl);

                const stats = this.rateLimiters.primary.getStats();
                const rateLimitInfo = this.formatRateLimitInfo(stats, 'primary', includeMinuteStats);

                return {
                    data,
                    source: this.primaryProvider.name,
                    cached: false,
                    rateLimitInfo,
                };
            } catch (error) {
                console.error(`${this.primaryProvider?.name || 'Primary provider'} failed, falling back to ${this.fallbackProvider.name}:`, error);
            }
        } else if (this.primaryProvider) {
            // No rate limiter, try without rate limiting (shouldn't happen in production)
            try {
                const data = await fetchFromPrimary();
                this.cache.set(cacheKey, data, cacheTtl);
                return {
                    data,
                    source: this.primaryProvider.name,
                    cached: false,
                };
            } catch (error) {
                console.error(`${this.primaryProvider?.name || 'Primary provider'} failed, falling back to ${this.fallbackProvider.name}:`, error);
            }
        }

        // Fallback provider (Yahoo Finance)
        const data = await fetchFromFallback();
        this.cache.set(cacheKey, data, cacheTtl);

        return {
            data,
            source: this.fallbackProvider.name,
            cached: false,
        };
    }

    /**
     * Get stock quote with caching and provider fallback
     */
    async getQuote(symbol: string): Promise<GetQuoteResult> {
        const upperSymbol = symbol.toUpperCase();
        const cacheKey = `quote:${upperSymbol}`;

        return this.fetchWithCacheAndFallback<StockQuote>(
            cacheKey,
            () => this.primaryProvider!.getQuote(upperSymbol),
            () => this.fallbackProvider.getQuote(upperSymbol),
            config.CACHE_TTL.QUOTE,
            true // Include minute stats for quotes
        );
    }

    /**
     * Get company information with caching and provider fallback
     */
    async getCompanyInfo(symbol: string): Promise<GetCompanyInfoResult> {
        const upperSymbol = symbol.toUpperCase();
        const cacheKey = `company:${upperSymbol}`;

        return this.fetchWithCacheAndFallback<CompanyInfo>(
            cacheKey,
            () => this.primaryProvider!.getCompanyInfo(upperSymbol),
            () => this.fallbackProvider.getCompanyInfo(upperSymbol),
            config.CACHE_TTL.COMPANY_INFO
        );
    }

    /**
     * Get historical data (uses provider with best support)
     * Priority: Yahoo Finance
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
            const executeFn = this.rateLimiters.primary
                ? () => this.rateLimiters.primary!.execute(() => this.primaryProvider!.searchSymbol!(query))
                : () => this.primaryProvider!.searchSymbol!(query);

            const results = await executeFn();

            const stats = this.rateLimiters.primary?.getStats();
            const rateLimitInfo = stats ? this.formatRateLimitInfo(stats, 'primary') : undefined;

            return {
                data: results,
                source: this.primaryProvider.name,
                metadata: `Found ${results.length} matches`,
                rateLimitInfo,
            };
        }

        throw new Error('Symbol search requires Alpha Vantage API key. Please set ALPHA_VANTAGE_API_KEY environment variable.\n\nTip: You can find ticker symbols at https://finance.yahoo.com');
    }

    async getNews(symbol?: string, topic?: string): Promise<GetNewsResult> {
        const cacheKey = `news:${symbol || ''}:${topic || ''}`;

        const cached = this.cache.get<any[]>(cacheKey);
        if (cached) {
            return {
                data: cached,
                source: 'Cache',
                metadata: `Found ${cached.length} cached articles`,
            };
        }

        // Try Alpha Vantage
        if (this.primaryProvider && supportsNews(this.primaryProvider)) {
            try {
                const executeFn = this.rateLimiters.primary
                    ? () => this.rateLimiters.primary!.execute(() => this.primaryProvider!.getNews!(symbol, topic))
                    : () => this.primaryProvider!.getNews!(symbol, topic);

                const news = await executeFn();
                this.cache.set(cacheKey, news, config.CACHE_TTL.NEWS);

                const stats = this.rateLimiters.primary?.getStats();
                const rateLimitInfo = stats ? this.formatRateLimitInfo(stats, 'primary') : undefined;
                const metadata = `Found ${news.length} articles${rateLimitInfo ? `. ${rateLimitInfo}` : ''}`;

                return {
                    data: news,
                    source: this.primaryProvider.name,
                    metadata,
                };
            } catch (error) {
                console.error(`${this.primaryProvider.name} news failed:`, error);
            }
        }

        return {
            data: [],
            source: 'N/A',
            metadata: 'No news provider available or an error occurred.',
        };
    }

    /**
     * Get financial statements (income statement, balance sheet, cash flow)
     * Uses Financial Modeling Prep as primary source
     */
    async getFinancialStatements(symbol: string, statementType: StatementType, period: 'annual' | 'quarter' = 'annual'): Promise<GetFinancialStatementsResult> {
        const upperSymbol = symbol.toUpperCase();
        const cacheKey = `financial-statements:${upperSymbol}:${statementType}:${period}`;

        // Check cache first
        const cached = this.cache.get<FinancialStatement[]>(cacheKey);
        if (cached) {
            return {
                data: cached,
                source: 'Cache',
                metadata: `Found ${cached.length} cached statements`,
            };
        }

        // Try Financial Modeling Prep first
        if (this.financialModelingPrepProvider && supportsFinancialStatements(this.financialModelingPrepProvider)) {
            try {
                const executeFn = this.rateLimiters.financialModelingPrep
                    ? () => this.rateLimiters.financialModelingPrep!.execute(() =>
                          this.financialModelingPrepProvider!.getFinancialStatements!(upperSymbol, statementType, period)
                      )
                    : () => this.financialModelingPrepProvider!.getFinancialStatements!(upperSymbol, statementType, period);

                const statements = await executeFn();
                this.cache.set(cacheKey, statements, config.CACHE_TTL_FINANCIAL_STATEMENTS);

                const stats = this.rateLimiters.financialModelingPrep?.getStats();
                const rateLimitInfo = stats ? this.formatRateLimitInfo(stats, 'financialModelingPrep') : undefined;
                const metadata = `Found ${statements.length} ${statementType} statements (${period})${rateLimitInfo ? `. ${rateLimitInfo}` : ''}`;

                return {
                    data: statements,
                    source: this.financialModelingPrepProvider.name,
                    metadata,
                };
            } catch (error) {
                console.error(`${this.financialModelingPrepProvider.name} financial statements failed, trying fallback:`, error);
            }
        }

        throw new Error(`No provider supports financial statements. Please set FMP_API_KEY environment variable.\n\nTip: Financial Modeling Prep provides comprehensive financial statements. Get your free API key at https://financialmodelingprep.com/developer/docs/`);
    }

    /**
     * Get economic indicator data from FRED
     * Uses FRED as primary source
     */
    async getEconomicIndicator(seriesId: string, startDate?: string, endDate?: string): Promise<GetEconomicIndicatorResult> {
        const cacheKey = `economic-indicator:${seriesId}:${startDate || 'all'}:${endDate || 'all'}`;

        // Check cache first
        const cached = this.cache.get<EconomicIndicator>(cacheKey);
        if (cached) {
            return {
                data: cached,
                source: 'Cache',
                metadata: `Found ${cached.data.length} cached data points`,
            };
        }

        // Try FRED provider
        if (this.fredProvider && supportsEconomicIndicators(this.fredProvider)) {
            try {
                const executeFn = this.rateLimiters.fred
                    ? () => this.rateLimiters.fred!.execute(() =>
                          this.fredProvider!.getEconomicIndicator!(seriesId, startDate, endDate)
                      )
                    : () => this.fredProvider!.getEconomicIndicator!(seriesId, startDate, endDate);

                const indicator = await executeFn();
                this.cache.set(cacheKey, indicator, config.CACHE_TTL_ECONOMIC_DATA);

                const stats = this.rateLimiters.fred?.getStats();
                const rateLimitInfo = stats ? this.formatRateLimitInfo(stats, 'fred') : undefined;
                const metadata = `Found ${indicator.data.length} data points for ${indicator.title}${rateLimitInfo ? `. ${rateLimitInfo}` : ''}`;

                return {
                    data: indicator,
                    source: this.fredProvider.name,
                    metadata,
                };
            } catch (error) {
                console.error(`${this.fredProvider.name} economic indicator failed:`, error);
            }
        }

        throw new Error(`No provider supports economic indicators. Please set FRED_API_KEY environment variable.\n\nTip: FRED provides comprehensive economic data. Get your free API key at https://fred.stlouisfed.org/docs/api/api_key.html`);
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

    /**
     * Format rate limit information for display
     * 
     * @param stats - Rate limiter statistics
     * @param providerType - Type of provider to determine which limits to display ('primary' | 'financialModelingPrep' | 'fred')
     * @param includeMinuteStats - Whether to include per-minute statistics (for primary provider)
     * @returns Formatted rate limit information string
     */
    private formatRateLimitInfo(
        stats: {
            callsLastSecond?: number;
            callsLastMinute?: number;
            callsLastDay?: number;
            callsLastMonth?: number;
        },
        providerType: 'primary' | 'financialModelingPrep' | 'fred',
        includeMinuteStats: boolean = false
    ): string {
        const parts: string[] = [];

        // Get the appropriate rate limit config based on provider type
        let rateLimitConfig: typeof config.RATE_LIMIT_CONFIGS.ALPHA_VANTAGE;
        switch (providerType) {
            case 'primary':
                rateLimitConfig = config.RATE_LIMIT_CONFIGS.ALPHA_VANTAGE;
                break;
            case 'financialModelingPrep':
                rateLimitConfig = config.RATE_LIMIT_CONFIGS.FINANCIAL_MODELING_PREP;
                break;
            case 'fred':
                rateLimitConfig = config.RATE_LIMIT_CONFIGS.FRED;
                break;
        }

        // Format per-second limit (FRED only)
        if (stats.callsLastSecond !== undefined && rateLimitConfig.callsPerSecond !== undefined) {
            parts.push(`${stats.callsLastSecond}/${rateLimitConfig.callsPerSecond} this second`);
        }

        // Format per-minute limit (Alpha Vantage only, when requested)
        if (includeMinuteStats && stats.callsLastMinute !== undefined && rateLimitConfig.callsPerMinute !== undefined) {
            parts.push(`${stats.callsLastMinute}/${rateLimitConfig.callsPerMinute} this minute`);
        }

        // Format per-day limit
        if (stats.callsLastDay !== undefined && rateLimitConfig.callsPerDay !== undefined) {
            parts.push(`${stats.callsLastDay}/${rateLimitConfig.callsPerDay} today`);
        }

        // Format per-month limit (IEX Cloud only)
        if (stats.callsLastMonth !== undefined && rateLimitConfig.callsPerMonth !== undefined) {
            parts.push(`${stats.callsLastMonth}/${rateLimitConfig.callsPerMonth} this month`);
        }

        return parts.length > 0 ? `API calls: ${parts.join(', ')}` : '';
    }

}
