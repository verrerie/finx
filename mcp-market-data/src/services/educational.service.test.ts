
import { EducationalService } from './educational.service';
import { IMarketDataProvider } from '../interfaces/market-data-provider.interface';

describe('EducationalService', () => {
  let service: EducationalService;
  let providers: IMarketDataProvider[];

  beforeEach(() => {
    providers = [
      {
        getQuote: vi.fn(),
        getHistoricalData: vi.fn(),
        searchSymbol: vi.fn(),
        getCompanyInfo: vi.fn(),
        explainFundamental: vi.fn(),
      },
    ];
    service = new EducationalService(providers);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
