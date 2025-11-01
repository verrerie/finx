/**
 * Tests for deletePortfolio handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { deletePortfolio } from './deletePortfolio.js';
import { MockPortfolioService, createMockContext } from '../../__tests__/mocks.js';

describe('deletePortfolio Handler', () => {
  let mockService: MockPortfolioService;

  beforeEach(() => {
    mockService = new MockPortfolioService();
  });

  it('should delete a portfolio successfully', async () => {
    mockService.deletePortfolio.mockResolvedValue(true);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await deletePortfolio({ portfolio_id: 'test-id' }, ctx);

    expect(mockService.deletePortfolio).toHaveBeenCalledWith('test-id');
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.message).toContain('deleted successfully');
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await deletePortfolio({}, ctx);

    expect(mockService.deletePortfolio).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await deletePortfolio(null, ctx);

    expect(mockService.deletePortfolio).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error when args is undefined', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await deletePortfolio(undefined, ctx);

    expect(mockService.deletePortfolio).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.deletePortfolio.mockRejectedValue(new Error('Portfolio not found'));
    const ctx = createMockContext({ portfolioService: mockService });

    await expect(
      deletePortfolio({ portfolio_id: 'non-existent-id' }, ctx)
    ).rejects.toThrow('Portfolio not found');
  });
});

