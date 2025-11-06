
import { EducationalService } from './educational.service';
import { IMarketDataProvider } from '../interfaces/market-data-provider.interface';

describe('EducationalService', () => {
  let service: EducationalService;
  let providers: IMarketDataProvider[];

  beforeEach(() => {
    providers = [
      {
        name: 'mock',
        getQuote: vi.fn(),
        getHistoricalData: vi.fn(),
        searchSymbol: vi.fn(),
        getCompanyInfo: vi.fn(),
        explainFundamental: vi.fn(),
        comparePeers: vi.fn(),
      },
    ];
    service = new EducationalService(providers);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
