/**
 * Tests for updateWatchlistItem handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { updateWatchlistItem } from './updateWatchlistItem.js';
import { MockLearningService, mockWatchlistItem, createMockContext } from '../../__tests__/mocks.js';

describe('updateWatchlistItem Handler', () => {
  let mockService: MockLearningService;

  beforeEach(() => {
    mockService = new MockLearningService();
  });

  it('should update watchlist item successfully', async () => {
    const updated = { ...mockWatchlistItem, notes: 'Updated notes' };
    mockService.updateWatchlistItem.mockResolvedValue(updated);
    const ctx = createMockContext({ learningService: mockService });

    const result = await updateWatchlistItem(
      {
        portfolio_id: mockWatchlistItem.portfolio_id,
        asset_id: mockWatchlistItem.asset_id,
        notes: 'Updated notes',
      },
      ctx
    );

    expect(mockService.updateWatchlistItem).toHaveBeenCalledWith(
      mockWatchlistItem.portfolio_id,
      mockWatchlistItem.asset_id,
      { notes: 'Updated notes', target_price: undefined, priority: undefined }
    );

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.watchlist_item.asset_id).toBe(mockWatchlistItem.asset_id);
    expect(parsed.watchlist_item.notes).toBe('Updated notes');
  });

  it('should return error when item is not found', async () => {
    mockService.updateWatchlistItem.mockResolvedValue(null);
    const ctx = createMockContext({ learningService: mockService });

    const result = await updateWatchlistItem(
      {
        portfolio_id: 'test-id',
        asset_id: 'a1',
        notes: 'test',
      },
      ctx
    );

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.watchlist_item).toBeNull();
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await updateWatchlistItem({ asset_id: 'a1' }, ctx);

    expect(mockService.updateWatchlistItem).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error when asset_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await updateWatchlistItem({ portfolio_id: 'test-id' }, ctx);

    expect(mockService.updateWatchlistItem).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await updateWatchlistItem(null, ctx);

    expect(mockService.updateWatchlistItem).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.updateWatchlistItem.mockRejectedValue(new Error('Database error'));
    const ctx = createMockContext({ learningService: mockService });

    await expect(
      updateWatchlistItem({ portfolio_id: 'test-id', asset_id: 'a1', notes: 'test' }, ctx)
    ).rejects.toThrow('Database error');
  });
});

