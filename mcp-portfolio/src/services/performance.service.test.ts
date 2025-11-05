
import { PerformanceService } from './performance.service';
import { HoldingRepository } from '../database/repositories/holding.repository.js';
import { TransactionRepository } from '../database/repositories/transaction.repository.js';

describe('PerformanceService', () => {
  let service: PerformanceService;
  let holdingRepo: HoldingRepository;
  let transactionRepo: TransactionRepository;

  beforeEach(() => {
    holdingRepo = {
      findByPortfolio: vi.fn(),
      getTotalCost: vi.fn(),
    } as any;
    transactionRepo = {
      getTotalInvested: vi.fn(),
      getTotalRealized: vi.fn(),
      getTotalDividends: vi.fn(),
    } as any;
    service = new PerformanceService(holdingRepo, transactionRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
