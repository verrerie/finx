/**
 * Tests for PortfolioService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortfolioService } from './portfolio.service.js';
import type { PortfolioRepository } from '../database/repositories/portfolio.repository.js';
import type { HoldingRepository } from '../database/repositories/holding.repository.js';
import type { TransactionRepository } from '../database/repositories/transaction.repository.js';
import type { AssetService } from './asset.service.js';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let mockPortfolioRepo: Partial<PortfolioRepository>;
  let mockHoldingRepo: Partial<HoldingRepository>;
  let mockTransactionRepo: Partial<TransactionRepository>;
  let mockAssetService: Partial<AssetService>;

  beforeEach(() => {
    mockPortfolioRepo = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
    };

    mockHoldingRepo = {
      findDetailsByPortfolio: vi.fn(),
      findByPortfolio: vi.fn(),
      findByAsset: vi.fn(),
      updatePosition: vi.fn(),
      create: vi.fn(),
    };

    mockTransactionRepo = {
      create: vi.fn(),
      find: vi.fn(),
      findByPortfolio: vi.fn(),
      getTotalInvested: vi.fn(),
      getTotalRealized: vi.fn(),
      getTotalDividends: vi.fn(),
    };

    mockAssetService = {
      findAssetById: vi.fn(),
      findAssets: vi.fn(),
    };

    service = new PortfolioService(
      mockPortfolioRepo as PortfolioRepository,
      mockHoldingRepo as HoldingRepository,
      mockTransactionRepo as TransactionRepository,
      mockAssetService as AssetService,
    );
  });

  describe('createPortfolio', () => {
    it('should create a portfolio with minimal input', async () => {
      const mockPortfolio = { id: '123', name: 'Test', currency: 'USD' };
      vi.mocked(mockPortfolioRepo.create!).mockResolvedValue(mockPortfolio as any);

      const result = await service.createPortfolio({ name: 'Test' });

      expect(mockPortfolioRepo.create).toHaveBeenCalledWith({
        name: 'Test',
      });
      expect(result).toEqual(mockPortfolio);
    });

    it('should create a portfolio with custom values', async () => {
      const mockPortfolio = { id: '123', name: 'Test', currency: 'EUR', description: 'My portfolio' };
      vi.mocked(mockPortfolioRepo.create!).mockResolvedValue(mockPortfolio as any);

      const result = await service.createPortfolio({
        name: 'Test',
        description: 'My portfolio',
        currency: 'EUR',
      });

      expect(mockPortfolioRepo.create).toHaveBeenCalledWith({
        name: 'Test',
        description: 'My portfolio',
        currency: 'EUR',
      });
      expect(result).toEqual(mockPortfolio);
    });
  });

  describe('listPortfolios', () => {
    it('should return all portfolios', async () => {
      const mockPortfolios = [{ id: '1', name: 'P1' }, { id: '2', name: 'P2' }];
      vi.mocked(mockPortfolioRepo.findAll!).mockResolvedValue(mockPortfolios as any);

      const result = await service.listPortfolios();

      expect(mockPortfolioRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPortfolios);
    });
  });

  describe('getPortfolio', () => {
    it('should return a portfolio by id', async () => {
      const mockPortfolio = { id: '123', name: 'Test' };
      vi.mocked(mockPortfolioRepo.findById!).mockResolvedValue(mockPortfolio as any);

      const result = await service.getPortfolio('123');

      expect(mockPortfolioRepo.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockPortfolio);
    });

    it('should return null if portfolio not found', async () => {
      vi.mocked(mockPortfolioRepo.findById!).mockResolvedValue(null);

      const result = await service.getPortfolio('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('deletePortfolio', () => {
    it('should delete a portfolio', async () => {
      vi.mocked(mockPortfolioRepo.delete!).mockResolvedValue(true);

      const result = await service.deletePortfolio('123');

      expect(mockPortfolioRepo.delete).toHaveBeenCalledWith('123');
      expect(result).toBe(true);
    });
  });

  describe('getHoldings', () => {
    it('should return holdings with details', async () => {
      const mockHoldings = [
        { id: '1', symbol: 'AAPL', quantity: 10, portfolio_name: 'Test', total_cost: 1500 },
      ];
      vi.mocked(mockHoldingRepo.findDetailsByPortfolio!).mockResolvedValue(mockHoldings as any);

      const result = await service.getHoldings('123');

      expect(mockHoldingRepo.findDetailsByPortfolio).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockHoldings);
    });
  });

  describe('getTransactions', () => {
    it('should return transactions with default limit', async () => {
      const mockTransactions = [{ id: '1', symbol: 'AAPL', type: 'BUY' }];
      vi.mocked(mockTransactionRepo.find!).mockResolvedValue(mockTransactions as any);

      const result = await service.getTransactions('123');

      expect(mockTransactionRepo.find).toHaveBeenCalledWith({
        portfolio_id: '123',
        limit: undefined,
      });
      expect(result).toEqual(mockTransactions);
    });

    it('should return transactions with custom limit', async () => {
      const mockTransactions = [{ id: '1', symbol: 'AAPL', type: 'BUY' }];
      vi.mocked(mockTransactionRepo.find!).mockResolvedValue(mockTransactions as any);

      const result = await service.getTransactions('123', 10);

      expect(mockTransactionRepo.find).toHaveBeenCalledWith({
        portfolio_id: '123',
        limit: 10,
      });
      expect(result).toEqual(mockTransactions);
    });
  });
});

