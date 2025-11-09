import { beforeAll, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { FREDProvider } from './fred';

vi.mock('axios');
const mockedAxios = axios as any;

describe('FREDProvider', () => {
    const apiKey = 'test-api-key';
    let provider: FREDProvider;

    beforeAll(() => {
        provider = new FREDProvider(apiKey);
    });

    describe('constructor', () => {
        it('should create provider with API key', () => {
            const p = new FREDProvider(apiKey);
            expect(p.name).toBe('FRED');
        });

        it('should throw error if API key is missing', () => {
            expect(() => new FREDProvider('')).toThrow('FRED API key is required');
        });
    });

    describe('getQuote', () => {
        it('should throw error as FRED does not provide stock quotes', async () => {
            await expect(provider.getQuote('AAPL')).rejects.toThrow('FRED does not provide stock quotes');
        });
    });

    describe('getCompanyInfo', () => {
        it('should throw error as FRED does not provide company info', async () => {
            await expect(provider.getCompanyInfo('AAPL')).rejects.toThrow('FRED does not provide company information');
        });
    });

    describe('getEconomicIndicator', () => {
        it('should fetch and transform economic indicator data', async () => {
            const mockSeriesInfo = {
                seriess: [{
                    id: 'GDP',
                    title: 'Gross Domestic Product',
                    units: 'Billions of Dollars',
                    frequency: 'Quarterly',
                }],
            };

            const mockObservations = {
                observations: [
                    { date: '2024-01-01', value: '25000.0' },
                    { date: '2024-04-01', value: '25100.0' },
                    { date: '2024-07-01', value: '.' }, // Missing value should be filtered
                ],
            };

            mockedAxios.get
                .mockResolvedValueOnce({ data: mockSeriesInfo })
                .mockResolvedValueOnce({ data: mockObservations });

            const result = await provider.getEconomicIndicator('GDP');

            expect(mockedAxios.get).toHaveBeenCalledWith(
                'https://api.stlouisfed.org/fred/series',
                expect.objectContaining({
                    params: expect.objectContaining({
                        series_id: 'GDP',
                        api_key: apiKey,
                        file_type: 'json',
                    }),
                })
            );
            expect(result.seriesId).toBe('GDP');
            expect(result.title).toBe('Gross Domestic Product');
            expect(result.units).toBe('Billions of Dollars');
            expect(result.frequency).toBe('Quarterly');
            expect(result.data).toHaveLength(2); // Missing value filtered out
            expect(result.data[0].date).toBe('2024-01-01');
            expect(result.data[0].value).toBe(25000.0);
        });

        it('should handle date range parameters', async () => {
            const mockSeriesInfo = {
                seriess: [{
                    id: 'GDP',
                    title: 'Gross Domestic Product',
                    units: 'Billions of Dollars',
                    frequency: 'Quarterly',
                }],
            };

            const mockObservations = {
                observations: [
                    { date: '2024-01-01', value: '25000.0' },
                ],
            };

            mockedAxios.get
                .mockResolvedValueOnce({ data: mockSeriesInfo })
                .mockResolvedValueOnce({ data: mockObservations });

            await provider.getEconomicIndicator('GDP', '2024-01-01', '2024-12-31');

            expect(mockedAxios.get).toHaveBeenCalledWith(
                'https://api.stlouisfed.org/fred/series/observations',
                expect.objectContaining({
                    params: expect.objectContaining({
                        series_id: 'GDP',
                        api_key: apiKey,
                        start_date: '2024-01-01',
                        end_date: '2024-12-31',
                    }),
                })
            );
        });

        it('should throw error on API failure', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

            await expect(provider.getEconomicIndicator('GDP')).rejects.toThrow('FRED economic indicator error for GDP');
        });

        it('should throw error when no data available', async () => {
            mockedAxios.get
                .mockResolvedValueOnce({ data: { seriess: [] } })
                .mockResolvedValueOnce({ data: { observations: [] } });

            await expect(provider.getEconomicIndicator('GDP')).rejects.toThrow();
        });
    });
});

