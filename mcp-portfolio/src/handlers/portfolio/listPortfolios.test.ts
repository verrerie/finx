/**
 * Tests for listPortfolios handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { listPortfolios } from './listPortfolios.js';
import { MockPortfolioService, mockPortfolioSummary, createMockContext } from '../../__tests__/mocks.js';

describe('listPortfolios Handler', () => {
  let mockService: MockPortfolioService;

  beforeEach(() => {
    mockService = new MockPortfolioService();
  });

  it('should list portfolios successfully', async () => {
    const summaries = [mockPortfolioSummary, { ...mockPortfolioSummary, id: 'different-id', name: 'Another Portfolio' }];
    mockService.listPortfolioSummaries.mockResolvedValue(summaries);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await listPortfolios({}, ctx);

    expect(mockService.listPortfolioSummaries).toHaveBeenCalled();
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.portfolios).toHaveLength(2);
    expect(parsed.count).toBe(2);
  });

  it('should handle empty portfolio list', async () => {
    mockService.listPortfolioSummaries.mockResolvedValue([]);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await listPortfolios({}, ctx);

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.portfolios).toEqual([]);
    expect(parsed.count).toBe(0);
  });

  it('should work with null arguments', async () => {
    mockService.listPortfolioSummaries.mockResolvedValue([mockPortfolioSummary]);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await listPortfolios(null, ctx);

    expect(mockService.listPortfolioSummaries).toHaveBeenCalled();
    expect(result.isError).toBeUndefined();
  });

  it('should work with undefined arguments', async () => {
    mockService.listPortfolioSummaries.mockResolvedValue([mockPortfolioSummary]);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await listPortfolios(undefined, ctx);

    expect(mockService.listPortfolioSummaries).toHaveBeenCalled();
    expect(result.isError).toBeUndefined();
  });

  it('should handle service errors', async () => {
    mockService.listPortfolioSummaries.mockRejectedValue(new Error('Database connection failed'));
    const ctx = createMockContext({ portfolioService: mockService });

    await expect(listPortfolios({}, ctx)).rejects.toThrow('Database connection failed');
  });
});

