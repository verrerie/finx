/**
 * Tests for LearningService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LearningService } from './learning.service.js';
import type { WatchlistRepository } from '../database/repositories/watchlist.repository.js';
import type { ThesisRepository } from '../database/repositories/thesis.repository.js';
import type { HoldingRepository } from '../database/repositories/holding.repository.js';

describe('LearningService', () => {
  let service: LearningService;
  let mockWatchlistRepo: Partial<WatchlistRepository>;
  let mockThesisRepo: Partial<ThesisRepository>;
  let mockHoldingRepo: Partial<HoldingRepository>;

  beforeEach(() => {
    mockWatchlistRepo = {
      create: vi.fn(),
      findByPortfolio: vi.fn(),
      findByPortfolioIdAndSymbol: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockThesisRepo = {
      create: vi.fn(),
      findByPortfolio: vi.fn(),
      findBySymbol: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockHoldingRepo = {
      findByPortfolioId: vi.fn(),
      findByPortfolioIdAndSymbol: vi.fn(),
    };

    service = new LearningService(
      mockWatchlistRepo as WatchlistRepository,
      mockThesisRepo as ThesisRepository,
      mockHoldingRepo as HoldingRepository
    );
  });

  describe('addToWatchlist', () => {
    it('should add item to watchlist with minimal input', async () => {
      const mockItem = { id: '123', symbol: 'AAPL', portfolio_id: 'p1', priority: 'MEDIUM' };
      vi.mocked(mockWatchlistRepo.create!).mockResolvedValue(mockItem as any);

      const result = await service.addToWatchlist({
        portfolio_id: 'p1',
        symbol: 'AAPL',
      });

      expect(mockWatchlistRepo.create).toHaveBeenCalledWith({
        portfolio_id: 'p1',
        symbol: 'AAPL',
      });
      expect(result).toEqual(mockItem);
    });

    it('should add item to watchlist with custom values', async () => {
      const mockItem = { id: '123', symbol: 'AAPL', portfolio_id: 'p1', priority: 'HIGH' };
      vi.mocked(mockWatchlistRepo.create!).mockResolvedValue(mockItem as any);

      const result = await service.addToWatchlist({
        portfolio_id: 'p1',
        symbol: 'AAPL',
        notes: 'Good buy',
        target_price: 150,
        priority: 'HIGH',
      });

      expect(mockWatchlistRepo.create).toHaveBeenCalledWith({
        portfolio_id: 'p1',
        symbol: 'AAPL',
        notes: 'Good buy',
        target_price: 150,
        priority: 'HIGH',
      });
      expect(result).toEqual(mockItem);
    });
  });

  describe('getWatchlist', () => {
    it('should return watchlist items', async () => {
      const mockItems = [{ id: '1', symbol: 'AAPL' }, { id: '2', symbol: 'MSFT' }];
      vi.mocked(mockWatchlistRepo.findByPortfolio!).mockResolvedValue(mockItems as any);

      const result = await service.getWatchlist('p1');

      expect(mockWatchlistRepo.findByPortfolio).toHaveBeenCalledWith('p1');
      expect(result).toEqual(mockItems);
    });
  });

  describe('updateWatchlistItem', () => {
    it('should update a watchlist item', async () => {
      const mockItem = { id: '123', symbol: 'AAPL', notes: 'Updated' };
      vi.mocked(mockWatchlistRepo.update!).mockResolvedValue(mockItem as any);

      const result = await service.updateWatchlistItem('p1', 'AAPL', { notes: 'Updated' });

      expect(mockWatchlistRepo.update).toHaveBeenCalledWith('p1', 'AAPL', { notes: 'Updated' });
      expect(result).toEqual(mockItem);
    });
  });

  describe('removeFromWatchlist', () => {
    it('should remove item from watchlist', async () => {
      vi.mocked(mockWatchlistRepo.delete!).mockResolvedValue(true);

      const result = await service.removeFromWatchlist('p1', 'AAPL');

      expect(mockWatchlistRepo.delete).toHaveBeenCalledWith('p1', 'AAPL');
      expect(result).toBe(true);
    });
  });

  describe('createThesis', () => {
    it('should create a thesis with minimal input', async () => {
      const mockThesis = { id: '123', symbol: 'AAPL', thesis: 'Good company', status: 'ACTIVE' };
      vi.mocked(mockThesisRepo.create!).mockResolvedValue(mockThesis as any);

      const result = await service.createThesis({
        portfolio_id: 'p1',
        symbol: 'AAPL',
        thesis: 'Good company',
      });

      expect(mockThesisRepo.create).toHaveBeenCalledWith({
        portfolio_id: 'p1',
        symbol: 'AAPL',
        thesis: 'Good company',
      });
      expect(result).toEqual(mockThesis);
    });

    it('should create a thesis with custom values', async () => {
      const mockThesis = { id: '123', symbol: 'AAPL', thesis: 'Good company', status: 'ACTIVE' };
      vi.mocked(mockThesisRepo.create!).mockResolvedValue(mockThesis as any);

      const result = await service.createThesis({
        portfolio_id: 'p1',
        symbol: 'AAPL',
        thesis: 'Good company',
        bull_case: 'Strong growth',
        bear_case: 'Competition',
        target_allocation: 15,
        review_date: '2024-12-31',
      });

      expect(mockThesisRepo.create).toHaveBeenCalledWith({
        portfolio_id: 'p1',
        symbol: 'AAPL',
        thesis: 'Good company',
        bull_case: 'Strong growth',
        bear_case: 'Competition',
        target_allocation: 15,
        review_date: '2024-12-31',
      });
      expect(result).toEqual(mockThesis);
    });
  });

  describe('getTheses', () => {
    it('should return all theses', async () => {
      const mockTheses = [{ id: '1', symbol: 'AAPL' }, { id: '2', symbol: 'MSFT' }];
      vi.mocked(mockThesisRepo.findByPortfolio!).mockResolvedValue(mockTheses as any);

      const result = await service.getTheses('p1');

      expect(mockThesisRepo.findByPortfolio).toHaveBeenCalledWith('p1');
      expect(result).toEqual(mockTheses);
    });
  });

  describe('getThesis', () => {
    it('should return a thesis by symbol', async () => {
      const mockThesis = { id: '123', symbol: 'AAPL' };
      vi.mocked(mockThesisRepo.findBySymbol!).mockResolvedValue(mockThesis as any);

      const result = await service.getThesis('p1', 'AAPL');

      expect(mockThesisRepo.findBySymbol).toHaveBeenCalledWith('p1', 'AAPL');
      expect(result).toEqual(mockThesis);
    });

    it('should return null if thesis not found', async () => {
      vi.mocked(mockThesisRepo.findBySymbol!).mockResolvedValue(null);

      const result = await service.getThesis('p1', 'UNKNOWN');

      expect(result).toBeNull();
    });
  });

  describe('updateThesis', () => {
    it('should update a thesis', async () => {
      const mockThesis = { id: '123', symbol: 'AAPL', thesis: 'Updated' };
      vi.mocked(mockThesisRepo.update!).mockResolvedValue(mockThesis as any);

      const result = await service.updateThesis('p1', 'AAPL', { thesis: 'Updated' });

      expect(mockThesisRepo.update).toHaveBeenCalledWith('p1', 'AAPL', { thesis: 'Updated' });
      expect(result).toEqual(mockThesis);
    });
  });

  describe('deleteThesis', () => {
    it('should delete a thesis', async () => {
      vi.mocked(mockThesisRepo.delete!).mockResolvedValue(true);

      const result = await service.deleteThesis('p1', 'AAPL');

      expect(mockThesisRepo.delete).toHaveBeenCalledWith('p1', 'AAPL');
      expect(result).toBe(true);
    });
  });
});

