import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Cache } from '../cache.js';
import * as educational from '../educational.js';
import { IMarketDataProvider } from '../interfaces/market-data-provider.interface.js';
import { CompanyInfo, StockQuote } from '../types.js';
import { EducationalService } from './educational.service.js';

describe('EducationalService', () => {
  let service: EducationalService;
  let cache: Cache;
  let fallbackProvider: IMarketDataProvider;
  let providers: IMarketDataProvider[];

  const createMockCompanyInfo = (overrides: Partial<CompanyInfo> = {}): CompanyInfo => ({
    symbol: 'AAPL',
    name: 'Apple Inc.',
    description: 'Test company',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    marketCap: 3e12,
    lastUpdated: new Date(),
    ...overrides,
  });

  beforeEach(() => {
    cache = new Cache();
    fallbackProvider = {
      name: 'fallback',
      getQuote: vi.fn(() => Promise.resolve({
        symbol: 'AAPL',
        price: 150,
        change: 1,
        changePercent: 0.67,
        volume: 1000000,
        timestamp: new Date(),
      } as StockQuote)),
      getHistoricalData: vi.fn(() => Promise.resolve([])),
      searchSymbol: vi.fn(() => Promise.resolve([])),
      getCompanyInfo: vi.fn(() => Promise.resolve(createMockCompanyInfo())),
    };
    providers = [fallbackProvider];
    service = new EducationalService(cache, fallbackProvider, providers);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('comparePeers', () => {
    it('should auto-detect sector when not provided', async () => {
      vi.spyOn(educational, 'findSectorFromSymbol').mockReturnValue('Technology');
      vi.spyOn(educational, 'getPeersBySector').mockReturnValue(['MSFT', 'GOOGL', 'META']);
      vi.spyOn(fallbackProvider, 'getCompanyInfo').mockResolvedValue(
        createMockCompanyInfo({
          peRatio: 30,
          revenueGrowth: 0.1,
          profitMargin: 0.25,
        })
      );

      const result = await service.comparePeers('AAPL');

      expect(educational.findSectorFromSymbol).toHaveBeenCalledWith('AAPL');
      expect(result.comparison).toContain('AAPL');
      expect(result.comparison).toContain('Technology');
    });

    it('should use cached data when available', async () => {
      vi.spyOn(educational, 'getPeersBySector').mockReturnValue(['MSFT', 'GOOGL']);
      const cachedData = createMockCompanyInfo({
        peRatio: 30,
        revenueGrowth: 0.1,
        profitMargin: 0.25,
      });
      cache.set('company:AAPL', cachedData, 3600);
      cache.set('company:MSFT', cachedData, 3600);
      cache.set('company:GOOGL', cachedData, 3600);

      const result = await service.comparePeers('AAPL', 'Technology');

      expect(fallbackProvider.getCompanyInfo).not.toHaveBeenCalled();
      expect(result.comparison).toContain('AAPL');
    });

    it('should handle errors when fetching company info', async () => {
      vi.spyOn(educational, 'getPeersBySector').mockReturnValue(['MSFT', 'GOOGL']);
      vi.spyOn(fallbackProvider, 'getCompanyInfo')
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce(createMockCompanyInfo({ symbol: 'MSFT', marketCap: 2e12 }));

      const result = await service.comparePeers('AAPL', 'Technology');

      expect(result.comparison).toContain('Error');
      expect(result.comparison).toContain('AAPL');
    });

    it('should handle null data in results', async () => {
      vi.spyOn(educational, 'getPeersBySector').mockReturnValue(['MSFT']);
      vi.spyOn(fallbackProvider, 'getCompanyInfo')
        .mockResolvedValueOnce(null as unknown as CompanyInfo)
        .mockResolvedValueOnce(createMockCompanyInfo({ symbol: 'MSFT', marketCap: 2e12 }));

      const result = await service.comparePeers('AAPL', 'Technology');

      expect(result.comparison).toContain('Error');
      expect(result.comparison).toContain('AAPL');
    });
  });
});
