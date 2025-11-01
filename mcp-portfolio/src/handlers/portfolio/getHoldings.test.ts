/**
 * Tests for getHoldings handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getHoldings } from './getHoldings.js';
import { MockPortfolioService, mockHolding, createMockContext } from '../../__tests__/mocks.js';

describe('getHoldings Handler', () => {
  let mockService: MockPortfolioService;

  beforeEach(() => {
    mockService = new MockPortfolioService();
  });

  it('should get holdings successfully', async () => {
    const holdings = [mockHolding, { ...mockHolding, symbol: 'MSFT' }];
    mockService.getHoldings.mockResolvedValue(holdings);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getHoldings({ portfolio_id: mockHolding.portfolio_id }, ctx);

    expect(mockService.getHoldings).toHaveBeenCalledWith(mockHolding.portfolio_id);
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.holdings).toHaveLength(2);
    expect(parsed.holdings[0].symbol).toBe('AAPL');
    expect(parsed.holdings[1].symbol).toBe('MSFT');
  });

  it('should return empty array when no holdings exist', async () => {
    mockService.getHoldings.mockResolvedValue([]);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getHoldings({ portfolio_id: 'some-id' }, ctx);

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.holdings).toEqual([]);
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getHoldings({}, ctx);

    expect(mockService.getHoldings).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getHoldings(null, ctx);

    expect(mockService.getHoldings).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.getHoldings.mockRejectedValue(new Error('Database error'));
    const ctx = createMockContext({ portfolioService: mockService });

    await expect(
      getHoldings({ portfolio_id: 'test-id' }, ctx)
    ).rejects.toThrow('Database error');
  });
});

