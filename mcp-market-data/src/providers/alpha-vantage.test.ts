
import { beforeAll, describe, expect, it } from 'vitest';
import { AlphaVantageProvider } from './alpha-vantage';

const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
const describeIf = apiKey ? describe : describe.skip;

describeIf('AlphaVantageProvider (Integration)', () => {
  let provider: AlphaVantageProvider;

  beforeAll(() => {
    if (apiKey) {
      provider = new AlphaVantageProvider(apiKey);
    }
  });

  describe('getNews', () => {
    it('should fetch and return news', async () => {
      const news = await provider.getNews('AAPL', 'technology');
      expect(news).toBeInstanceOf(Array);
      if (news.length > 0) {
        expect(news[0]).toHaveProperty('title');
        expect(news[0]).toHaveProperty('url');
      }
    }, 30000);
  });
});
