/**
 * Alpha Vantage data provider
 */

import AlphaVantage from 'alphavantage';
import { IMarketDataProvider } from '../interfaces/market-data-provider.interface.js';
import { CompanyInfo, StockQuote, SymbolSearchResult } from '../types.js';

export class AlphaVantageProvider implements IMarketDataProvider {
    readonly name = 'Alpha Vantage';
    private client: any;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('Alpha Vantage API key is required');
        }
        this.client = AlphaVantage({ key: apiKey });
    }

    async getQuote(symbol: string): Promise<StockQuote> {
        try {
            const data = await this.client.data.quote(symbol);

            if (!data || !data['Global Quote']) {
                throw new Error(`No quote data available for ${symbol}`);
            }

            const quote = data['Global Quote'];

            return {
                symbol: quote['01. symbol'] || symbol,
                price: parseFloat(quote['05. price'] || '0'),
                change: parseFloat(quote['09. change'] || '0'),
                changePercent: parseFloat((quote['10. change percent'] || '0').replace('%', '')),
                volume: parseInt(quote['06. volume'] || '0'),
                timestamp: new Date(quote['07. latest trading day'] || Date.now()),
            };
        } catch (error) {
            throw new Error(`Alpha Vantage quote error for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getCompanyInfo(symbol: string): Promise<CompanyInfo> {
        try {
            const data = await this.client.fundamental.company_overview(symbol);

            if (!data || !data.Symbol) {
                throw new Error(`No company data available for ${symbol}`);
            }

            return {
                symbol: data.Symbol,
                name: data.Name || 'N/A',
                description: data.Description || 'No description available',
                sector: data.Sector || 'N/A',
                industry: data.Industry || 'N/A',
                marketCap: parseInt(data.MarketCapitalization || '0'),

                // Valuation
                peRatio: this.parseFloat(data.PERatio),
                pbRatio: this.parseFloat(data.PriceToBookRatio),
                dividendYield: this.parseFloat(data.DividendYield),
                eps: this.parseFloat(data.EPS),
                beta: this.parseFloat(data.Beta),

                // Profitability
                profitMargin: this.parseFloat(data.ProfitMargin),
                operatingMargin: this.parseFloat(data.OperatingMarginTTM),
                returnOnEquity: this.parseFloat(data.ReturnOnEquityTTM),
                returnOnAssets: this.parseFloat(data.ReturnOnAssetsTTM),

                // Financial health
                debtToEquity: this.parseFloat(data.DebtToEquity),
                currentRatio: this.parseFloat(data.CurrentRatio),

                // Growth
                revenueGrowth: this.parseFloat(data.QuarterlyRevenueGrowthYOY),
                earningsGrowth: this.parseFloat(data.QuarterlyEarningsGrowthYOY),

                // Other
                revenue: parseInt(data.RevenueTTM || '0'),
                grossProfit: parseInt(data.GrossProfitTTM || '0'),
                weekHigh52: this.parseFloat(data['52WeekHigh']),
                weekLow52: this.parseFloat(data['52WeekLow']),

                lastUpdated: new Date(),
            };
        } catch (error) {
            throw new Error(`Alpha Vantage company info error for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async searchSymbol(query: string): Promise<SymbolSearchResult[]> {
        try {
            const data = await this.client.data.search(query);

            if (!data || !data.bestMatches) {
                return [];
            }

            return data.bestMatches.slice(0, 10).map((match: any) => ({
                symbol: match['1. symbol'],
                name: match['2. name'],
                exchange: match['4. region'],
                type: match['3. type'],
            }));
        } catch (error) {
            throw new Error(`Alpha Vantage search error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private parseFloat(value: any): number | undefined {
        if (value === null || value === undefined || value === 'None' || value === '') {
            return undefined;
        }
        const parsed = parseFloat(value);
        return isNaN(parsed) ? undefined : parsed;
    }
}

