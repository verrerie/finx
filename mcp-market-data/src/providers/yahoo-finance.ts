/**
 * Yahoo Finance data provider (fallback)
 */

import YahooFinance from 'yahoo-finance2';
import { IMarketDataProvider } from '../interfaces/market-data-provider.interface.js';
import { CompanyInfo, HistoricalDataPoint, Period, StockQuote } from '../types.js';

export class YahooFinanceProvider implements IMarketDataProvider {
    readonly name = 'Yahoo Finance';
    private yf: InstanceType<typeof YahooFinance>;

    constructor() {
        this.yf = new YahooFinance();
    }

    async getQuote(symbol: string): Promise<StockQuote> {
        try {
            const quote = await this.yf.quote(symbol, {}, { validateResult: false });

            if (!quote) {
                throw new Error(`No quote data available for ${symbol}`);
            }

            return {
                symbol: quote.symbol,
                price: quote.regularMarketPrice || 0,
                change: quote.regularMarketChange || 0,
                changePercent: quote.regularMarketChangePercent || 0,
                volume: quote.regularMarketVolume || 0,
                marketCap: quote.marketCap,
                peRatio: quote.trailingPE,
                weekHigh52: quote.fiftyTwoWeekHigh,
                weekLow52: quote.fiftyTwoWeekLow,
                timestamp: quote.regularMarketTime || new Date(),
            };
        } catch (error) {
            throw new Error(`Yahoo Finance quote error for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getHistoricalData(symbol: string, period: Period): Promise<HistoricalDataPoint[]> {
        try {
            const endDate = new Date();
            const startDate = this.getStartDate(period);

            const history = await this.yf.historical(symbol, {
                period1: startDate,
                period2: endDate,
            }, { validateResult: false });

            return history.map((point: any) => ({
                date: point.date.toISOString().split('T')[0],
                open: point.open,
                high: point.high,
                low: point.low,
                close: point.close,
                volume: point.volume,
            }));
        } catch (error) {
            throw new Error(`Yahoo Finance historical data error for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getCompanyInfo(symbol: string): Promise<CompanyInfo> {
        try {
            const [quote, summary] = await Promise.all([
                this.yf.quote(symbol, {}, { validateResult: false }),
                this.yf.quoteSummary(symbol, {
                    modules: ['summaryProfile', 'defaultKeyStatistics', 'financialData'],
                }, { validateResult: false }),
            ]);

            const profile = (summary as any).summaryProfile;
            const keyStats = (summary as any).defaultKeyStatistics;
            const financials = (summary as any).financialData;

            return {
                symbol: quote.symbol,
                name: quote.longName || quote.shortName || symbol,
                description: profile?.longBusinessSummary || 'No description available',
                sector: profile?.sector || 'N/A',
                industry: profile?.industry || 'N/A',
                marketCap: quote.marketCap || 0,

                // Valuation
                peRatio: quote.trailingPE,
                pbRatio: keyStats?.priceToBook,
                dividendYield: quote.dividendYield,
                eps: keyStats?.trailingEps,
                beta: keyStats?.beta,

                // Profitability
                profitMargin: financials?.profitMargins,
                operatingMargin: financials?.operatingMargins,
                returnOnEquity: financials?.returnOnEquity,
                returnOnAssets: financials?.returnOnAssets,

                // Financial health
                debtToEquity: financials?.debtToEquity,
                currentRatio: financials?.currentRatio,

                // Growth
                revenueGrowth: financials?.revenueGrowth,
                earningsGrowth: financials?.earningsGrowth,

                // Other
                revenue: financials?.totalRevenue,
                grossProfit: financials?.grossProfits,
                weekHigh52: quote.fiftyTwoWeekHigh,
                weekLow52: quote.fiftyTwoWeekLow,

                lastUpdated: new Date(),
            };
        } catch (error) {
            throw new Error(`Yahoo Finance company info error for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private getStartDate(period: Period): Date {
        const now = new Date();
        const date = new Date(now);

        switch (period) {
            case '1d':
                date.setDate(date.getDate() - 1);
                break;
            case '5d':
                date.setDate(date.getDate() - 5);
                break;
            case '1mo':
                date.setMonth(date.getMonth() - 1);
                break;
            case '3mo':
                date.setMonth(date.getMonth() - 3);
                break;
            case '6mo':
                date.setMonth(date.getMonth() - 6);
                break;
            case '1y':
                date.setFullYear(date.getFullYear() - 1);
                break;
            case '2y':
                date.setFullYear(date.getFullYear() - 2);
                break;
            case '5y':
                date.setFullYear(date.getFullYear() - 5);
                break;
            case 'max':
                date.setFullYear(date.getFullYear() - 20); // 20 years max
                break;
            default:
                date.setFullYear(date.getFullYear() - 1);
        }

        return date;
    }
}

