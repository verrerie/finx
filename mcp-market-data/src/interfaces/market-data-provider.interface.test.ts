import { describe, expect, it } from 'vitest';
import { IMarketDataProvider, supportsHistoricalData, supportsSymbolSearch } from './market-data-provider.interface.js';
import { HistoricalDataPoint, Period, StockQuote, SymbolSearchResult } from '../types.js';

describe('Market Data Provider Interface', () => {
    describe('supportsHistoricalData', () => {
        it('should return true for provider with getHistoricalData method', () => {
            const provider: IMarketDataProvider = {
                name: 'Test Provider',
                getQuote: async () => ({} as StockQuote),
                getCompanyInfo: async () => ({} as any),
                getHistoricalData: async (symbol: string, period: Period) => ([] as HistoricalDataPoint[]),
            };

            expect(supportsHistoricalData(provider)).toBe(true);
        });

        it('should return false for provider without getHistoricalData method', () => {
            const provider: IMarketDataProvider = {
                name: 'Test Provider',
                getQuote: async () => ({} as StockQuote),
                getCompanyInfo: async () => ({} as any),
            };

            expect(supportsHistoricalData(provider)).toBe(false);
        });

        it('should return false if getHistoricalData is not a function', () => {
            const provider: IMarketDataProvider = {
                name: 'Test Provider',
                getQuote: async () => ({} as StockQuote),
                getCompanyInfo: async () => ({} as any),
                getHistoricalData: undefined,
            };

            expect(supportsHistoricalData(provider)).toBe(false);
        });
    });

    describe('supportsSymbolSearch', () => {
        it('should return true for provider with searchSymbol method', () => {
            const provider: IMarketDataProvider = {
                name: 'Test Provider',
                getQuote: async () => ({} as StockQuote),
                getCompanyInfo: async () => ({} as any),
                searchSymbol: async (query: string) => ([] as SymbolSearchResult[]),
            };

            expect(supportsSymbolSearch(provider)).toBe(true);
        });

        it('should return false for provider without searchSymbol method', () => {
            const provider: IMarketDataProvider = {
                name: 'Test Provider',
                getQuote: async () => ({} as StockQuote),
                getCompanyInfo: async () => ({} as any),
            };

            expect(supportsSymbolSearch(provider)).toBe(false);
        });

        it('should return false if searchSymbol is not a function', () => {
            const provider: IMarketDataProvider = {
                name: 'Test Provider',
                getQuote: async () => ({} as StockQuote),
                getCompanyInfo: async () => ({} as any),
                searchSymbol: undefined,
            };

            expect(supportsSymbolSearch(provider)).toBe(false);
        });
    });

    describe('provider with both optional methods', () => {
        it('should correctly identify provider with all capabilities', () => {
            const provider: IMarketDataProvider = {
                name: 'Full Provider',
                getQuote: async () => ({} as StockQuote),
                getCompanyInfo: async () => ({} as any),
                getHistoricalData: async (symbol: string, period: Period) => ([] as HistoricalDataPoint[]),
                searchSymbol: async (query: string) => ([] as SymbolSearchResult[]),
            };

            expect(supportsHistoricalData(provider)).toBe(true);
            expect(supportsSymbolSearch(provider)).toBe(true);
        });

        it('should correctly identify minimal provider', () => {
            const provider: IMarketDataProvider = {
                name: 'Minimal Provider',
                getQuote: async () => ({} as StockQuote),
                getCompanyInfo: async () => ({} as any),
            };

            expect(supportsHistoricalData(provider)).toBe(false);
            expect(supportsSymbolSearch(provider)).toBe(false);
        });
    });
});

