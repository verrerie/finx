import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Cache } from '../cache.js';
import { IMarketDataProvider } from '../interfaces/market-data-provider.interface.js';
import { RateLimiter } from '../rate-limiter.js';
import { CompanyInfo, StockQuote } from '../types.js';
import { MarketDataService } from './market-data.service.js';

describe('MarketDataService', () => {
    let cache: Cache;
    let rateLimiter: RateLimiter;
    let mockPrimaryProvider: IMarketDataProvider;
    let mockFallbackProvider: IMarketDataProvider;
    let service: MarketDataService;

    beforeEach(() => {
        cache = new Cache();
        rateLimiter = new RateLimiter(5, 25);

        // Mock providers
        mockPrimaryProvider = {
            name: 'Mock Primary',
            getQuote: vi.fn(),
            getCompanyInfo: vi.fn(),
            searchSymbol: vi.fn(),
        } as any;

        mockFallbackProvider = {
            name: 'Mock Fallback',
            getQuote: vi.fn(),
            getCompanyInfo: vi.fn(),
            getHistoricalData: vi.fn(),
        } as any;

        service = new MarketDataService(
            cache,
            rateLimiter,
            mockPrimaryProvider,
            mockFallbackProvider
        );
    });

    describe('getQuote', () => {
        const mockQuote: StockQuote = {
            symbol: 'AAPL',
            price: 150.0,
            change: 2.5,
            changePercent: 1.69,
            volume: 50000000,
            timestamp: new Date(),
        };

        it('should return cached quote if available', async () => {
            cache.set('quote:AAPL', mockQuote, 5 * 60 * 1000);

            const result = await service.getQuote('AAPL');

            expect(result.data).toEqual(mockQuote);
            expect(result.cached).toBe(true);
            expect(result.source).toBe('Cache');
            expect(mockPrimaryProvider.getQuote).not.toHaveBeenCalled();
        });

        it('should fetch from primary provider if not cached', async () => {
            vi.mocked(mockPrimaryProvider.getQuote).mockResolvedValue(mockQuote);

            const result = await service.getQuote('AAPL');

            expect(result.data).toEqual(mockQuote);
            expect(result.cached).toBe(false);
            expect(result.source).toBe('Mock Primary');
            expect(mockPrimaryProvider.getQuote).toHaveBeenCalledWith('AAPL');
        });

        it('should fallback to fallback provider if primary fails', async () => {
            vi.mocked(mockPrimaryProvider.getQuote).mockRejectedValue(new Error('Primary failed'));
            vi.mocked(mockFallbackProvider.getQuote).mockResolvedValue(mockQuote);

            const result = await service.getQuote('AAPL');

            expect(result.data).toEqual(mockQuote);
            expect(result.source).toBe('Mock Fallback');
            expect(mockFallbackProvider.getQuote).toHaveBeenCalledWith('AAPL');
        });

        it('should convert symbol to uppercase', async () => {
            vi.mocked(mockPrimaryProvider.getQuote).mockResolvedValue(mockQuote);

            await service.getQuote('aapl');

            expect(mockPrimaryProvider.getQuote).toHaveBeenCalledWith('AAPL');
        });

        it('should cache result after fetching', async () => {
            vi.mocked(mockPrimaryProvider.getQuote).mockResolvedValue(mockQuote);

            await service.getQuote('AAPL');

            const cached = cache.get<StockQuote>('quote:AAPL');
            expect(cached).toEqual(mockQuote);
        });
    });

    describe('getCompanyInfo', () => {
        const mockCompanyInfo: CompanyInfo = {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            description: 'Technology company',
            sector: 'Technology',
            industry: 'Consumer Electronics',
            marketCap: 2500000000000,
            lastUpdated: new Date(),
        };

        it('should return cached company info if available', async () => {
            cache.set('company:AAPL', mockCompanyInfo, 24 * 60 * 60 * 1000);

            const result = await service.getCompanyInfo('AAPL');

            expect(result.data).toEqual(mockCompanyInfo);
            expect(result.cached).toBe(true);
            expect(result.source).toBe('Cache');
        });

        it('should fetch from primary provider if not cached', async () => {
            vi.mocked(mockPrimaryProvider.getCompanyInfo).mockResolvedValue(mockCompanyInfo);

            const result = await service.getCompanyInfo('AAPL');

            expect(result.data).toEqual(mockCompanyInfo);
            expect(result.cached).toBe(false);
            expect(result.source).toBe('Mock Primary');
        });

        it('should fallback to fallback provider if primary fails', async () => {
            vi.mocked(mockPrimaryProvider.getCompanyInfo).mockRejectedValue(new Error('Failed'));
            vi.mocked(mockFallbackProvider.getCompanyInfo).mockResolvedValue(mockCompanyInfo);

            const result = await service.getCompanyInfo('AAPL');

            expect(result.data).toEqual(mockCompanyInfo);
            expect(result.source).toBe('Mock Fallback');
        });
    });

    describe('getHistoricalData', () => {
        const mockHistoricalData = [
            { date: '2024-01-01', open: 100, high: 105, low: 99, close: 103, volume: 1000000 },
            { date: '2024-01-02', open: 103, high: 108, low: 102, close: 107, volume: 1100000 },
        ];

        it('should fetch historical data from fallback provider', async () => {
            if (mockFallbackProvider.getHistoricalData) {
                vi.mocked(mockFallbackProvider.getHistoricalData).mockResolvedValue(mockHistoricalData);
            }

            const result = await service.getHistoricalData('AAPL', '1y');

            expect(result.data).toEqual(mockHistoricalData);
            expect(result.source).toBe('Mock Fallback');
            expect(result.metadata).toContain('2 data points over 1y');
        });

        it('should use default period if not specified', async () => {
            if (mockFallbackProvider.getHistoricalData) {
                vi.mocked(mockFallbackProvider.getHistoricalData).mockResolvedValue(mockHistoricalData);
            }

            await service.getHistoricalData('AAPL');

            if (mockFallbackProvider.getHistoricalData) {
                expect(mockFallbackProvider.getHistoricalData).toHaveBeenCalledWith('AAPL', '1y');
            }
        });
    });

    describe('searchSymbol', () => {
        const mockSearchResults = [
            { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', type: 'Equity' },
        ];

        it('should search using primary provider if available', async () => {
            if (mockPrimaryProvider.searchSymbol) {
                vi.mocked(mockPrimaryProvider.searchSymbol).mockResolvedValue(mockSearchResults);
            }

            const result = await service.searchSymbol('Apple');

            expect(result.data).toEqual(mockSearchResults);
            expect(result.source).toBe('Mock Primary');
            expect(result.metadata).toContain('Found 1 matches');
        });

        it('should throw error if primary provider not available', async () => {
            const serviceWithoutPrimary = new MarketDataService(
                cache,
                rateLimiter,
                null,
                mockFallbackProvider
            );

            await expect(serviceWithoutPrimary.searchSymbol('Apple')).rejects.toThrow(
                'Symbol search requires Alpha Vantage API key'
            );
        });
    });

    describe('explainFundamental', () => {
        it('should return explanation for valid metric', async () => {
            const result = await service.explainFundamental('pe_ratio');

            expect(result.explanation).toContain('P/E Ratio');
            expect(result.explanation).toContain('Definition');
            expect(result.explanation).toContain('What It Means');
        });

        it('should throw error for invalid metric', async () => {
            await expect(service.explainFundamental('invalid_metric')).rejects.toThrow(
                'Metric "invalid_metric" not found'
            );
        });

        it('should include context data if symbol provided and cached', async () => {
            const mockCompanyInfo: CompanyInfo = {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                description: 'Tech company',
                sector: 'Technology',
                industry: 'Consumer Electronics',
                marketCap: 2500000000000,
                lastUpdated: new Date(),
            };
            cache.set('company:AAPL', mockCompanyInfo, 24 * 60 * 60 * 1000);

            const result = await service.explainFundamental('pe_ratio', 'AAPL');

            expect(result.explanation).toContain('P/E Ratio');
            expect(result.contextData).toContain('Current AAPL Data Context');
            expect(result.contextData).toContain('Apple Inc.');
        });
    });

    describe('comparePeers', () => {
        it('should throw error if sector cannot be auto-detected', async () => {
            await expect(service.comparePeers('UNKNOWN')).rejects.toThrow(
                'Could not auto-detect sector'
            );
        });

        it('should throw error if no peer data available', async () => {
            await expect(service.comparePeers('AAPL', 'InvalidSector')).rejects.toThrow(
                'No peer data available for sector'
            );
        });

        it('should return comparison text for valid symbol and sector', async () => {
            const mockCompanyInfo: CompanyInfo = {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                description: 'Tech',
                sector: 'Technology',
                industry: 'Electronics',
                marketCap: 2500000000000,
                peRatio: 28,
                revenueGrowth: 0.15,
                profitMargin: 0.25,
                lastUpdated: new Date(),
            };

            vi.mocked(mockFallbackProvider.getCompanyInfo).mockResolvedValue(mockCompanyInfo);

            const result = await service.comparePeers('AAPL', 'Technology');

            expect(result.comparison).toContain('Peer Comparison: AAPL');
            expect(result.comparison).toContain('Technology');
            expect(result.comparison).toContain('Learning Points');
        });
    });

    describe('service with no primary provider', () => {
        it('should work with only fallback provider', async () => {
            const serviceWithoutPrimary = new MarketDataService(
                cache,
                rateLimiter,
                null,
                mockFallbackProvider
            );

            const mockQuote: StockQuote = {
                symbol: 'AAPL',
                price: 150.0,
                change: 2.5,
                changePercent: 1.69,
                volume: 50000000,
                timestamp: new Date(),
            };

            vi.mocked(mockFallbackProvider.getQuote).mockResolvedValue(mockQuote);

            const result = await serviceWithoutPrimary.getQuote('AAPL');

            expect(result.data).toEqual(mockQuote);
            expect(result.source).toBe('Mock Fallback');
        });
    });
});

