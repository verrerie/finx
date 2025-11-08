

import { YahooFinanceProvider } from './yahoo-finance';
import { describe, it, expect, beforeAll } from 'vitest';

describe('YahooFinanceProvider (Integration)', () => {
  let provider: YahooFinanceProvider;

  beforeAll(() => {
    provider = new YahooFinanceProvider();
  });

  describe('getQuote', () => {
    it('should fetch and return a quote', async () => {
      const quote = await provider.getQuote('AAPL');
      expect(quote).toHaveProperty('symbol', 'AAPL');
      expect(quote).toHaveProperty('price');
    }, 30000);
  });

  describe('getHistoricalData', () => {
    it('should fetch and return historical data', async () => {
      const historicalData = await provider.getHistoricalData('AAPL', '1d');
      expect(historicalData).toBeInstanceOf(Array);
      if (historicalData.length > 0) {
        expect(historicalData[0]).toHaveProperty('date');
        expect(historicalData[0]).toHaveProperty('close');
      }
    }, 30000);
  });

  describe('getCompanyInfo', () => {
    it('should fetch and return company info', async () => {
      const companyInfo = await provider.getCompanyInfo('AAPL');
      expect(companyInfo).toHaveProperty('symbol', 'AAPL');
      expect(companyInfo).toHaveProperty('name', 'Apple Inc.');
    }, 30000);
  });
});
