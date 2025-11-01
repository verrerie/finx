/**
 * Tests for addToWatchlist handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { addToWatchlist } from './addToWatchlist.js';
import { MockLearningService, mockWatchlistItem, createMockContext } from '../../__tests__/mocks.js';

describe('addToWatchlist Handler', () => {
  let mockService: MockLearningService;

  beforeEach(() => {
    mockService = new MockLearningService();
  });

  it('should add a stock to watchlist successfully', async () => {
    mockService.addToWatchlist.mockResolvedValue(mockWatchlistItem);
    const ctx = createMockContext({ learningService: mockService });

    const result = await addToWatchlist(
      {
        portfolio_id: mockWatchlistItem.portfolio_id,
        symbol: mockWatchlistItem.symbol,
        notes: mockWatchlistItem.notes,
        target_price: mockWatchlistItem.target_price,
        priority: mockWatchlistItem.priority,
      },
      ctx
    );

    expect(mockService.addToWatchlist).toHaveBeenCalledWith({
      portfolio_id: mockWatchlistItem.portfolio_id,
      symbol: mockWatchlistItem.symbol,
      notes: mockWatchlistItem.notes,
      target_price: mockWatchlistItem.target_price,
      priority: mockWatchlistItem.priority,
    });

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.watchlist_item.symbol).toBe(mockWatchlistItem.symbol);
    expect(parsed.watchlist_item.portfolio_id).toBe(mockWatchlistItem.portfolio_id);
    expect(parsed.message).toContain(mockWatchlistItem.symbol);
  });

  it('should add to watchlist with minimal arguments', async () => {
    mockService.addToWatchlist.mockResolvedValue(mockWatchlistItem);
    const ctx = createMockContext({ learningService: mockService });

    const result = await addToWatchlist(
      {
        portfolio_id: 'test-id',
        symbol: 'AAPL',
      },
      ctx
    );

    expect(mockService.addToWatchlist).toHaveBeenCalledWith({
      portfolio_id: 'test-id',
      symbol: 'AAPL',
      notes: undefined,
      target_price: undefined,
      priority: undefined,
    });

    expect(result.isError).toBeUndefined();
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await addToWatchlist({ symbol: 'AAPL' }, ctx);

    expect(mockService.addToWatchlist).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when symbol is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await addToWatchlist({ portfolio_id: 'test-id' }, ctx);

    expect(mockService.addToWatchlist).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await addToWatchlist(null, ctx);

    expect(mockService.addToWatchlist).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.addToWatchlist.mockRejectedValue(new Error('Duplicate entry'));
    const ctx = createMockContext({ learningService: mockService });

    await expect(
      addToWatchlist({ portfolio_id: 'test-id', symbol: 'AAPL' }, ctx)
    ).rejects.toThrow('Duplicate entry');
  });
});

