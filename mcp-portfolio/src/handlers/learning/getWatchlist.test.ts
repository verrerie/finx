/**
 * Tests for getWatchlist handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getWatchlist } from './getWatchlist.js';
import { MockLearningService, mockWatchlistItem, createMockContext } from '../../__tests__/mocks.js';

describe('getWatchlist Handler', () => {
  let mockService: MockLearningService;

  beforeEach(() => {
    mockService = new MockLearningService();
  });

  it('should get watchlist successfully', async () => {
    const watchlist = [mockWatchlistItem, { ...mockWatchlistItem, asset_id: 'a2' }];
    mockService.getWatchlist.mockResolvedValue(watchlist);
    const ctx = createMockContext({ learningService: mockService });

    const result = await getWatchlist({ portfolio_id: mockWatchlistItem.portfolio_id }, ctx);

    expect(mockService.getWatchlist).toHaveBeenCalledWith(mockWatchlistItem.portfolio_id);
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.watchlist).toHaveLength(2);
    expect(parsed.watchlist[0].asset_id).toBe(mockWatchlistItem.asset_id);
    expect(parsed.watchlist[1].asset_id).toBe('a2');
  });

  it('should return empty array when watchlist is empty', async () => {
    mockService.getWatchlist.mockResolvedValue([]);
    const ctx = createMockContext({ learningService: mockService });

    const result = await getWatchlist({ portfolio_id: 'test-id' }, ctx);

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.watchlist).toEqual([]);
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await getWatchlist({}, ctx);

    expect(mockService.getWatchlist).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await getWatchlist(null, ctx);

    expect(mockService.getWatchlist).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.getWatchlist.mockRejectedValue(new Error('Database error'));
    const ctx = createMockContext({ learningService: mockService });

    await expect(
      getWatchlist({ portfolio_id: 'test-id' }, ctx)
    ).rejects.toThrow('Database error');
  });
});

