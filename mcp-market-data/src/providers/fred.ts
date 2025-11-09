/**
 * FRED (Federal Reserve Economic Data) provider
 * 
 * Free tier: Unlimited (rate-limited to 10 requests/second)
 * API base: https://api.stlouisfed.org/fred
 * Authentication: API key in query parameter (api_key)
 * 
 * Note: FRED doesn't provide stock data, only economic indicators
 */

import axios from 'axios';
import { IMarketDataProvider } from '../interfaces/market-data-provider.interface.js';
import { CompanyInfo, EconomicIndicator, StockQuote } from '../types.js';
import { config } from '../config.js';

export class FREDProvider implements IMarketDataProvider {
    readonly name = 'FRED';
    private apiKey: string;
    private baseUrl = 'https://api.stlouisfed.org/fred';

    constructor(apiKey?: string) {
        const key = apiKey || config.ENV.FRED_API_KEY;
        if (!key) {
            throw new Error('FRED API key is required');
        }
        this.apiKey = key;
    }

    // FRED doesn't provide stock quotes - throw error
    async getQuote(symbol: string): Promise<StockQuote> {
        throw new Error('FRED does not provide stock quotes. Use getEconomicIndicator() for economic data.');
    }

    // FRED doesn't provide company info - throw error
    async getCompanyInfo(symbol: string): Promise<CompanyInfo> {
        throw new Error('FRED does not provide company information. Use getEconomicIndicator() for economic data.');
    }

    async getEconomicIndicator(seriesId: string, startDate?: string, endDate?: string): Promise<EconomicIndicator> {
        try {
            // First, get series info
            const [seriesInfo, seriesData] = await Promise.all([
                axios.get(`${this.baseUrl}/series`, {
                    params: {
                        series_id: seriesId,
                        api_key: this.apiKey,
                        file_type: 'json',
                    },
                }),
                axios.get(`${this.baseUrl}/series/observations`, {
                    params: {
                        series_id: seriesId,
                        api_key: this.apiKey,
                        file_type: 'json',
                        sort_order: 'asc',
                        start_date: startDate,
                        end_date: endDate,
                    },
                }),
            ]);

            const info = seriesInfo.data;
            const data = seriesData.data;

            if (!info || !info.seriess || info.seriess.length === 0) {
                throw new Error(`No economic indicator data available for series ID: ${seriesId}`);
            }

            const series = info.seriess[0];
            const observations = data?.observations || [];

            return {
                seriesId: series.id,
                title: series.title,
                units: series.units,
                frequency: series.frequency,
                data: observations
                    .filter((obs: any) => obs.value !== '.') // Filter out missing values
                    .map((obs: any) => ({
                        date: obs.date,
                        value: parseFloat(obs.value),
                    })),
                lastUpdated: new Date(),
            };
        } catch (error) {
            throw new Error(`FRED economic indicator error for ${seriesId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

