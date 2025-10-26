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
import {
    findSectorFromSymbol,
    formatMetricExplanation,
    getMetricExplanation,
    getPeersBySector,
    listAvailableMetrics,
    listAvailableSectors
} from '../educational.js';
import { IMarketDataProvider, supportsHistoricalData, supportsSymbolSearch } from '../interfaces/market-data-provider.interface.js';
import { RateLimiter } from '../rate-limiter.js';
import { CompanyInfo, HistoricalDataPoint, Period, StockQuote, SymbolSearchResult } from '../types.js';

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

export interface ExplainFundamentalResult {
    explanation: string;
    contextData?: string;
}

export interface ComparePeersResult {
    comparison: string;
}

/**
 * Service for handling market data operations
 */
export class MarketDataService {
    constructor(
        private cache: Cache,
        private rateLimiter: RateLimiter,
        private primaryProvider: IMarketDataProvider | null,
        private fallbackProvider: IMarketDataProvider
    ) {}

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
        const explanation = getMetricExplanation(metric);
        
        if (!explanation) {
            const availableMetrics = listAvailableMetrics();
            throw new Error(
                `Metric "${metric}" not found.\n\nAvailable metrics:\n${availableMetrics.map(m => `- ${m}`).join('\n')}\n\nUse any of these metric names (case-insensitive, underscores/spaces/hyphens are flexible).`
            );
        }

        const formattedExplanation = formatMetricExplanation(explanation, symbol);

        // If symbol is provided, try to fetch actual data for context
        let contextData: string | undefined;
        if (symbol) {
            try {
                const upperSymbol = symbol.toUpperCase();
                const cached = this.cache.get<CompanyInfo>(`company:${upperSymbol}`);
                if (cached) {
                    contextData = `\n\n---\n## Current ${upperSymbol} Data Context\n\`\`\`json\n${JSON.stringify(cached, null, 2)}\n\`\`\`\n\nUse this data to practice interpreting the metric!`;
                }
            } catch (error) {
                // Silently fail if we can't get context data
            }
        }

        return {
            explanation: formattedExplanation,
            contextData,
        };
    }

    /**
     * Compare a stock against sector peers
     */
    async comparePeers(symbol: string, sector?: string, metrics?: string[]): Promise<ComparePeersResult> {
        const upperSymbol = symbol.toUpperCase();

        // Determine sector
        let targetSector = sector;
        if (!targetSector) {
            const detectedSector = findSectorFromSymbol(upperSymbol);
            if (!detectedSector) {
                const availableSectors = listAvailableSectors();
                throw new Error(
                    `Could not auto-detect sector for ${upperSymbol}. Please specify a sector:\n\n${availableSectors.map(s => `- ${s}`).join('\n')}`
                );
            }
            targetSector = detectedSector;
        }

        // Get peer symbols
        const peers = getPeersBySector(targetSector);
        if (!peers || peers.length === 0) {
            throw new Error(`No peer data available for sector: ${targetSector}`);
        }

        // Fetch data for target company and peers (limit to 5 peers)
        const symbolsToCompare = [upperSymbol, ...peers.filter(p => p !== upperSymbol).slice(0, 5)];

        let comparisonText = `# Peer Comparison: ${upperSymbol}\n\n`;
        comparisonText += `**Sector:** ${targetSector}\n`;
        comparisonText += `**Comparing against:** ${symbolsToCompare.slice(1).join(', ')}\n\n`;
        comparisonText += `---\n\n`;

        // Fetch company info for each symbol
        const companyDataPromises = symbolsToCompare.map(async (sym) => {
            try {
                // Check cache first
                const cached = this.cache.get<CompanyInfo>(`company:${sym}`);
                if (cached) {
                    return { symbol: sym, data: cached, source: 'cache' };
                }

                // Use fallback provider for quick comparison
                const info = await this.fallbackProvider.getCompanyInfo(sym);
                this.cache.set(`company:${sym}`, info, CACHE_TTL.COMPANY_INFO);
                return { symbol: sym, data: info, source: this.fallbackProvider.name };
            } catch (error) {
                return { symbol: sym, data: null, error: String(error) };
            }
        });

        const results = await Promise.all(companyDataPromises);

        // Build comparison table
        comparisonText += `## Key Metrics Comparison\n\n`;
        comparisonText += `| Company | Market Cap | P/E Ratio | Revenue Growth | Profit Margin |\n`;
        comparisonText += `|---------|------------|-----------|----------------|---------------|\n`;

        for (const result of results) {
            if (result.data) {
                const d: any = result.data;
                const marketCap = d.marketCap ? `$${(d.marketCap / 1e9).toFixed(1)}B` : 'N/A';
                const pe = d.trailingPE ? d.trailingPE.toFixed(1) : 'N/A';
                const revenue = d.revenueGrowth ? `${(d.revenueGrowth * 100).toFixed(1)}%` : 'N/A';
                const margin = d.profitMargin ? `${(d.profitMargin * 100).toFixed(1)}%` : 'N/A';

                const highlight = result.symbol === upperSymbol ? '**' : '';
                comparisonText += `| ${highlight}${result.symbol}${highlight} | ${marketCap} | ${pe} | ${revenue} | ${margin} |\n`;
            } else {
                comparisonText += `| ${result.symbol} | Error | Error | Error | Error |\n`;
            }
        }

        comparisonText += `\n*Target company (${upperSymbol}) shown in bold*\n\n`;

        // Add learning insights
        comparisonText += `---\n\n## 💡 Learning Points\n\n`;
        comparisonText += `1. **Compare Valuations**: How does ${upperSymbol}'s P/E compare to peers? Higher P/E suggests market expects stronger growth.\n\n`;
        comparisonText += `2. **Profitability**: Which companies have the best profit margins? This often indicates competitive advantages.\n\n`;
        comparisonText += `3. **Growth Rates**: Compare revenue growth - who's growing fastest? Is it sustainable?\n\n`;
        comparisonText += `4. **Size Matters**: Market cap tells you company size. Larger doesn't mean better - consider growth potential vs stability.\n\n`;
        comparisonText += `5. **Deep Dive**: Use \`get_company_info\` on any peer to learn more. Use \`explain_fundamental\` to understand specific metrics.\n\n`;
        comparisonText += `---\n\n`;
        comparisonText += `*Remember: Peer comparison is just one tool. Consider qualitative factors: management, competitive moats, industry trends, and your investment goals.*`;

        return {
            comparison: comparisonText,
        };
    }
}

