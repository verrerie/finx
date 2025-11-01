/**
 * Tests for calculatePerformance handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { calculatePerformance } from './calculatePerformance.js';
import { MockPortfolioService, mockPerformance, createMockContext } from '../../__tests__/mocks.js';

describe('calculatePerformance Handler', () => {
  let mockService: MockPortfolioService;

  beforeEach(() => {
    mockService = new MockPortfolioService();
  });

  it('should calculate performance successfully', async () => {
    mockService.calculatePerformance.mockResolvedValue(mockPerformance);
    mockService.calculatePositionPerformance.mockResolvedValue([]);
    const ctx = createMockContext({ portfolioService: mockService });

    const currentPrices = { AAPL: 170.00, MSFT: 350.00 };
    const result = await calculatePerformance(
      {
        portfolio_id: mockPerformance.portfolio_id,
        current_prices: currentPrices,
      },
      ctx
    );

    expect(mockService.calculatePerformance).toHaveBeenCalledWith(
      mockPerformance.portfolio_id,
      currentPrices
    );
    expect(mockService.calculatePositionPerformance).toHaveBeenCalledWith(
      mockPerformance.portfolio_id,
      currentPrices
    );

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.performance).toBeDefined();
    expect(parsed.positions).toBeDefined();
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await calculatePerformance({ current_prices: {} }, ctx);

    expect(mockService.calculatePerformance).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when current_prices is missing', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await calculatePerformance({ portfolio_id: 'test-id' }, ctx);

    expect(mockService.calculatePerformance).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await calculatePerformance(null, ctx);

    expect(mockService.calculatePerformance).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle empty current_prices object', async () => {
    mockService.calculatePerformance.mockResolvedValue(mockPerformance);
    mockService.calculatePositionPerformance.mockResolvedValue([]);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await calculatePerformance(
      {
        portfolio_id: 'test-id',
        current_prices: {},
      },
      ctx
    );

    expect(mockService.calculatePerformance).toHaveBeenCalledWith('test-id', {});
    expect(mockService.calculatePositionPerformance).toHaveBeenCalledWith('test-id', {});
    expect(result.isError).toBeUndefined();
  });

  it('should handle service errors', async () => {
    mockService.calculatePerformance.mockRejectedValue(new Error('Calculation error'));
    const ctx = createMockContext({ portfolioService: mockService });

    await expect(
      calculatePerformance(
        {
          portfolio_id: 'test-id',
          current_prices: { AAPL: 170 },
        },
        ctx
      )
    ).rejects.toThrow('Calculation error');
  });
});

