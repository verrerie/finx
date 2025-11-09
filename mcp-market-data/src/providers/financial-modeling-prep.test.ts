import { beforeAll, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { FinancialModelingPrepProvider } from './financial-modeling-prep';
import { StatementType } from '../types.js';

vi.mock('axios');
const mockedAxios = axios as any;

describe('FinancialModelingPrepProvider', () => {
    const apiKey = 'test-api-key';
    let provider: FinancialModelingPrepProvider;

    beforeAll(() => {
        provider = new FinancialModelingPrepProvider(apiKey);
    });

    describe('constructor', () => {
        it('should create provider with API key', () => {
            const p = new FinancialModelingPrepProvider(apiKey);
            expect(p.name).toBe('Financial Modeling Prep');
        });

        it('should throw error if API key is missing', () => {
            expect(() => new FinancialModelingPrepProvider('')).toThrow('Financial Modeling Prep API key is required');
        });
    });

    describe('getQuote', () => {
        it('should fetch and transform quote data', async () => {
            const mockData = [{
                symbol: 'AAPL',
                price: 150.25,
                change: 2.5,
                changesPercentage: '1.67',
                volume: 1000000,
                marketCap: 2500000000000,
                pe: 28.5,
                yearHigh: 180.0,
                yearLow: 120.0,
                timestamp: 1234567890000,
            }];

            mockedAxios.get.mockResolvedValueOnce({ data: mockData });

            const result = await provider.getQuote('AAPL');

            expect(mockedAxios.get).toHaveBeenCalledWith(
                'https://financialmodelingprep.com/api/v3/quote/AAPL',
                { params: { apikey: apiKey } }
            );
            expect(result.symbol).toBe('AAPL');
            expect(result.price).toBe(150.25);
            expect(result.change).toBe(2.5);
            expect(result.changePercent).toBe(1.67);
            expect(result.volume).toBe(1000000);
            expect(result.marketCap).toBe(2500000000000);
            expect(result.peRatio).toBe(28.5);
            expect(result.weekHigh52).toBe(180.0);
            expect(result.weekLow52).toBe(120.0);
        });

        it('should throw error on API failure', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

            await expect(provider.getQuote('AAPL')).rejects.toThrow('Financial Modeling Prep quote error for AAPL');
        });

        it('should throw error when no data available', async () => {
            mockedAxios.get.mockResolvedValueOnce({ data: [] });

            await expect(provider.getQuote('AAPL')).rejects.toThrow('No quote data available for AAPL');
        });
    });

    describe('getCompanyInfo', () => {
        it('should fetch and transform company info', async () => {
            const mockProfile = [{
                symbol: 'AAPL',
                companyName: 'Apple Inc.',
                description: 'Technology company',
                sector: 'Technology',
                industry: 'Consumer Electronics',
                mktCap: 2500000000000,
                beta: 1.2,
                lastDiv: 0.005,
                eps: 5.5,
                range: '120.0-180.0',
            }];

            const mockMetrics = [{
                peRatioTTM: 28.5,
                pbRatioTTM: 45.2,
                dividendYieldTTM: 0.005,
                netIncomePerShareTTM: 5.5,
                netProfitMarginTTM: 0.25,
                operatingProfitMarginTTM: 0.30,
                roeTTM: 0.15,
                roaTTM: 0.10,
                debtToEquityTTM: 1.5,
                currentRatioTTM: 1.8,
                revenueGrowthTTM: 0.08,
                earningsGrowthTTM: 0.12,
                revenuePerShareTTM: 100,
                sharesOutstandingTTM: 1000000000,
                grossProfitTTM: 40000000000,
            }];

            mockedAxios.get
                .mockResolvedValueOnce({ data: mockProfile })
                .mockResolvedValueOnce({ data: mockMetrics });

            const result = await provider.getCompanyInfo('AAPL');

            expect(result.symbol).toBe('AAPL');
            expect(result.name).toBe('Apple Inc.');
            expect(result.description).toBe('Technology company');
            expect(result.sector).toBe('Technology');
            expect(result.industry).toBe('Consumer Electronics');
            expect(result.marketCap).toBe(2500000000000);
            expect(result.peRatio).toBe(28.5);
            expect(result.pbRatio).toBe(45.2);
            expect(result.dividendYield).toBe(0.005);
        });

        it('should handle partial data', async () => {
            const mockProfile = [{
                symbol: 'AAPL',
                companyName: 'Apple Inc.',
                mktCap: 2500000000000,
            }];

            mockedAxios.get
                .mockResolvedValueOnce({ data: mockProfile })
                .mockRejectedValueOnce(new Error('Not found'));

            const result = await provider.getCompanyInfo('AAPL');

            expect(result.symbol).toBe('AAPL');
            expect(result.name).toBe('Apple Inc.');
            expect(result.marketCap).toBe(2500000000000);
        });

        it('should throw error when no data available', async () => {
            mockedAxios.get.mockResolvedValueOnce({ data: [] });

            await expect(provider.getCompanyInfo('AAPL')).rejects.toThrow();
        });
    });

    describe('getFinancialStatements', () => {
        it('should fetch income statements', async () => {
            const mockData = [{
                date: '2024-01-01',
                calendarYear: '2024',
                revenue: 1000000000,
                costOfRevenue: 500000000,
                grossProfit: 500000000,
                operatingExpenses: 200000000,
                operatingIncome: 300000000,
                interestExpense: 10000000,
                incomeBeforeTax: 290000000,
                incomeTaxExpense: 50000000,
                netIncome: 240000000,
                eps: 1.5,
                weightedAverageShsOut: 160000000,
            }];

            mockedAxios.get.mockResolvedValueOnce({ data: mockData });

            const result = await provider.getFinancialStatements('AAPL', StatementType.INCOME, 'annual');

            expect(mockedAxios.get).toHaveBeenCalledWith(
                'https://financialmodelingprep.com/api/v3/income-statement/AAPL',
                expect.objectContaining({
                    params: expect.objectContaining({
                        apikey: apiKey,
                        period: 'annual',
                        limit: 120,
                    }),
                })
            );
            expect(result).toHaveLength(1);
            expect(result[0].symbol).toBe('AAPL');
            expect(result[0].period).toBe('annual');
            expect((result[0] as any).revenue).toBe(1000000000);
            expect((result[0] as any).netIncome).toBe(240000000);
        });

        it('should fetch balance sheets', async () => {
            const mockData = [{
                date: '2024-01-01',
                calendarYear: '2024',
                cashAndCashEquivalents: 100000000,
                totalCurrentAssets: 500000000,
                totalAssets: 2000000000,
                totalCurrentLiabilities: 300000000,
                totalLiabilities: 1000000000,
                totalStockholdersEquity: 1000000000,
            }];

            mockedAxios.get.mockResolvedValueOnce({ data: mockData });

            const result = await provider.getFinancialStatements('AAPL', StatementType.BALANCE, 'quarter');

            expect(result).toHaveLength(1);
            expect(result[0].symbol).toBe('AAPL');
            expect(result[0].period).toBe('quarter');
            expect((result[0] as any).totalAssets).toBe(2000000000);
        });

        it('should fetch cash flow statements', async () => {
            const mockData = [{
                date: '2024-01-01',
                calendarYear: '2024',
                netIncome: 240000000,
                depreciationAndAmortization: 50000000,
                operatingCashFlow: 290000000,
                capitalExpenditure: 100000000,
                netCashUsedForInvestingActivites: 150000000,
                dividendsPaid: 50000000,
                netCashUsedProvidedByFinancingActivities: 90000000,
                netChangeInCash: 50000000,
            }];

            mockedAxios.get.mockResolvedValueOnce({ data: mockData });

            const result = await provider.getFinancialStatements('AAPL', StatementType.CASHFLOW, 'annual');

            expect(result).toHaveLength(1);
            expect(result[0].symbol).toBe('AAPL');
            expect(result[0].period).toBe('annual');
            expect((result[0] as any).netIncome).toBe(240000000);
            expect((result[0] as any).operatingCashFlow).toBe(290000000);
        });

        it('should throw error on API failure', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

            await expect(provider.getFinancialStatements('AAPL', StatementType.INCOME)).rejects.toThrow('Financial Modeling Prep financial statements error for AAPL');
        });
    });
});

