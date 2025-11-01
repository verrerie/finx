/**
 * Tests for getPortfolio handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getPortfolio } from './getPortfolio.js';
import { MockPortfolioService, mockPortfolio, createMockContext } from '../../__tests__/mocks.js';

describe('getPortfolio Handler', () => {
  let mockService: MockPortfolioService;

  beforeEach(() => {
    mockService = new MockPortfolioService();
  });

  it('should get a portfolio successfully', async () => {
    mockService.getPortfolio.mockResolvedValue(mockPortfolio);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getPortfolio({ portfolio_id: mockPortfolio.id }, ctx);

    expect(mockService.getPortfolio).toHaveBeenCalledWith(mockPortfolio.id);
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.portfolio.id).toBe(mockPortfolio.id);
    expect(parsed.portfolio.name).toBe(mockPortfolio.name);
  });

  it('should return error when portfolio is not found', async () => {
    mockService.getPortfolio.mockResolvedValue(null);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getPortfolio({ portfolio_id: 'non-existent-id' }, ctx);

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Portfolio not found');
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getPortfolio({}, ctx);

    expect(mockService.getPortfolio).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getPortfolio(null, ctx);

    expect(mockService.getPortfolio).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error when args is undefined', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getPortfolio(undefined, ctx);

    expect(mockService.getPortfolio).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.getPortfolio.mockRejectedValue(new Error('Database error'));
    const ctx = createMockContext({ portfolioService: mockService });

    await expect(
      getPortfolio({ portfolio_id: mockPortfolio.id }, ctx)
    ).rejects.toThrow('Database error');
  });
});

