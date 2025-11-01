/**
 * Tests for LearningService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LearningService } from './learning.service.js';
import type { WatchlistRepository } from '../database/repositories/watchlist.repository.js';
import type { ThesisRepository } from '../database/repositories/thesis.repository.js';
import type { HoldingRepository } from '../database/repositories/holding.repository.js';
import type { AssetService } from './asset.service.js';

describe('LearningService', () => {
  let service: LearningService;
  let mockWatchlistRepo: Partial<WatchlistRepository>;
  let mockThesisRepo: Partial<ThesisRepository>;
  let mockHoldingRepo: Partial<HoldingRepository>;
  let mockAssetService: Partial<AssetService>;

  beforeEach(() => {
    mockWatchlistRepo = {
      create: vi.fn(),
      findByPortfolio: vi.fn(),
      findByAsset: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockThesisRepo = {
      create: vi.fn(),
      findByPortfolio: vi.fn(),
      findByAsset: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockHoldingRepo = {
      findByPortfolio: vi.fn(),
      findByAsset: vi.fn(),
    };

    mockAssetService = {
      findAssetById: vi.fn(),
      findAssets: vi.fn(),
    };

    service = new LearningService(
      mockWatchlistRepo as WatchlistRepository,
      mockThesisRepo as ThesisRepository,
      mockHoldingRepo as HoldingRepository,
      mockAssetService as AssetService,
    );
  });

  describe('addToWatchlist', () => {
    it('should add item to watchlist with minimal input', async () => {
      const mockItem = { id: '123', asset_id: 'a1', portfolio_id: 'p1', priority: 'MEDIUM' };
      vi.mocked(mockWatchlistRepo.create!).mockResolvedValue(mockItem as any);

      const result = await service.addToWatchlist({
        portfolio_id: 'p1',
        asset_id: 'a1',
      });

      expect(mockWatchlistRepo.create).toHaveBeenCalledWith({
        portfolio_id: 'p1',
        asset_id: 'a1',
      });
      expect(result).toEqual(mockItem);
    });

    it('should add item to watchlist with custom values', async () => {
      const mockItem = { id: '123', asset_id: 'a1', portfolio_id: 'p1', priority: 'HIGH' };
      vi.mocked(mockWatchlistRepo.create!).mockResolvedValue(mockItem as any);

      const result = await service.addToWatchlist({
        portfolio_id: 'p1',
        asset_id: 'a1',
        notes: 'Good buy',
        target_price: 150,
        priority: 'HIGH',
      });

      expect(mockWatchlistRepo.create).toHaveBeenCalledWith({
        portfolio_id: 'p1',
        asset_id: 'a1',
        notes: 'Good buy',
        target_price: 150,
        priority: 'HIGH',
      });
      expect(result).toEqual(mockItem);
    });
  });

  describe('getWatchlist', () => {
    it('should return watchlist items', async () => {
      const mockItems = [{ id: '1', asset_id: 'a1' }, { id: '2', asset_id: 'a2' }];
      vi.mocked(mockWatchlistRepo.findByPortfolio!).mockResolvedValue(mockItems as any);

      const result = await service.getWatchlist('p1');

      expect(mockWatchlistRepo.findByPortfolio).toHaveBeenCalledWith('p1');
      expect(result).toEqual(mockItems);
    });
  });

  describe('updateWatchlistItem', () => {
    it('should update a watchlist item', async () => {
      const mockItem = { id: '123', asset_id: 'a1', notes: 'Updated' };
      vi.mocked(mockWatchlistRepo.update!).mockResolvedValue(mockItem as any);

      const result = await service.updateWatchlistItem('p1', 'a1', { notes: 'Updated' });

      expect(mockWatchlistRepo.update).toHaveBeenCalledWith('p1', 'a1', { notes: 'Updated' });
      expect(result).toEqual(mockItem);
    });
  });

  describe('removeFromWatchlist', () => {
    it('should remove item from watchlist', async () => {
      vi.mocked(mockWatchlistRepo.delete!).mockResolvedValue(true);

      const result = await service.removeFromWatchlist('p1', 'a1');

      expect(mockWatchlistRepo.delete).toHaveBeenCalledWith('p1', 'a1');
      expect(result).toBe(true);
    });
  });

  describe('createThesis', () => {
    it('should create a thesis with minimal input', async () => {
      const mockThesis = { id: '123', asset_id: 'a1', thesis: 'Good company', status: 'ACTIVE' };
      vi.mocked(mockThesisRepo.create!).mockResolvedValue(mockThesis as any);

      const result = await service.createThesis({
        portfolio_id: 'p1',
        asset_id: 'a1',
        thesis: 'Good company',
      });

      expect(mockThesisRepo.create).toHaveBeenCalledWith({
        portfolio_id: 'p1',
        asset_id: 'a1',
        thesis: 'Good company',
      });
      expect(result).toEqual(mockThesis);
    });

    it('should create a thesis with custom values', async () => {
      const mockThesis = { id: '123', asset_id: 'a1', thesis: 'Good company', status: 'ACTIVE' };
      vi.mocked(mockThesisRepo.create!).mockResolvedValue(mockThesis as any);

      const result = await service.createThesis({
        portfolio_id: 'p1',
        asset_id: 'a1',
        thesis: 'Good company',
        bull_case: 'Strong growth',
        bear_case: 'Competition',
        target_allocation: 15,
        review_date: '2024-12-31',
      });

      expect(mockThesisRepo.create).toHaveBeenCalledWith({
        portfolio_id: 'p1',
        asset_id: 'a1',
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
      const mockTheses = [{ id: '1', asset_id: 'a1' }, { id: '2', asset_id: 'a2' }];
      vi.mocked(mockThesisRepo.findByPortfolio!).mockResolvedValue(mockTheses as any);

      const result = await service.getTheses('p1');

      expect(mockThesisRepo.findByPortfolio).toHaveBeenCalledWith('p1');
      expect(result).toEqual(mockTheses);
    });
  });

  describe('getThesis', () => {
    it('should return a thesis by asset', async () => {
      const mockThesis = { id: '123', asset_id: 'a1' };
      vi.mocked(mockThesisRepo.findByAsset!).mockResolvedValue(mockThesis as any);

      const result = await service.getThesis('p1', 'a1');

      expect(mockThesisRepo.findByAsset).toHaveBeenCalledWith('p1', 'a1');
      expect(result).toEqual(mockThesis);
    });

    it('should return null if thesis not found', async () => {
      vi.mocked(mockThesisRepo.findByAsset!).mockResolvedValue(null);

      const result = await service.getThesis('p1', 'UNKNOWN');

      expect(result).toBeNull();
    });
  });

  describe('updateThesis', () => {
    it('should update a thesis', async () => {
      const mockThesis = { id: '123', asset_id: 'a1', thesis: 'Updated' };
      vi.mocked(mockThesisRepo.update!).mockResolvedValue(mockThesis as any);

      const result = await service.updateThesis('p1', 'a1', { thesis: 'Updated' });

      expect(mockThesisRepo.update).toHaveBeenCalledWith('p1', 'a1', { thesis: 'Updated' });
      expect(result).toEqual(mockThesis);
    });
  });

  describe('deleteThesis', () => {
    it('should delete a thesis', async () => {
      vi.mocked(mockThesisRepo.delete!).mockResolvedValue(true);

      const result = await service.deleteThesis('p1', 'a1');

      expect(mockThesisRepo.delete).toHaveBeenCalledWith('p1', 'a1');
      expect(result).toBe(true);
    });
  });
});

