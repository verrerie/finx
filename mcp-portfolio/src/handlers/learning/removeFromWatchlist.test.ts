/**
 * Tests for removeFromWatchlist handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { removeFromWatchlist } from './removeFromWatchlist.js';
import { MockLearningService, createMockContext } from '../../__tests__/mocks.js';

describe('removeFromWatchlist Handler', () => {
  let mockService: MockLearningService;

  beforeEach(() => {
    mockService = new MockLearningService();
  });

  it('should remove from watchlist successfully', async () => {
    mockService.removeFromWatchlist.mockResolvedValue(true);
    const ctx = createMockContext({ learningService: mockService });

    const result = await removeFromWatchlist(
      {
        portfolio_id: 'test-id',
        asset_id: 'a1',
      },
      ctx
    );

    expect(mockService.removeFromWatchlist).toHaveBeenCalledWith('test-id', 'a1');
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await removeFromWatchlist({ asset_id: 'a1' }, ctx);

    expect(mockService.removeFromWatchlist).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when asset_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await removeFromWatchlist({ portfolio_id: 'test-id' }, ctx);

    expect(mockService.removeFromWatchlist).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await removeFromWatchlist(null, ctx);

    expect(mockService.removeFromWatchlist).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.removeFromWatchlist.mockRejectedValue(new Error('Item not found'));
    const ctx = createMockContext({ learningService: mockService });

    await expect(
      removeFromWatchlist({ portfolio_id: 'test-id', asset_id: 'a1' }, ctx)
    ).rejects.toThrow('Item not found');
  });
});

