/**
 * Tests for getTransactions handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getTransactions } from './getTransactions.js';
import { MockPortfolioService, mockTransaction, createMockContext } from '../../__tests__/mocks.js';

describe('getTransactions Handler', () => {
  let mockService: MockPortfolioService;

  beforeEach(() => {
    mockService = new MockPortfolioService();
  });

  it('should get transactions successfully', async () => {
    const transactions = [mockTransaction, { ...mockTransaction, id: 'different-id' }];
    mockService.getTransactions.mockResolvedValue(transactions);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getTransactions({ portfolio_id: mockTransaction.portfolio_id }, ctx);

    expect(mockService.getTransactions).toHaveBeenCalledWith(mockTransaction.portfolio_id, undefined);
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.transactions).toHaveLength(2);
    expect(parsed.transactions[0].asset_id).toBe(mockTransaction.asset_id);
  });

  it('should get transactions with limit', async () => {
    const transactions = [mockTransaction];
    mockService.getTransactions.mockResolvedValue(transactions);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getTransactions({ portfolio_id: mockTransaction.portfolio_id, limit: 10 }, ctx);

    expect(mockService.getTransactions).toHaveBeenCalledWith(mockTransaction.portfolio_id, 10);
    expect(result.isError).toBeUndefined();
  });

  it('should return empty array when no transactions exist', async () => {
    mockService.getTransactions.mockResolvedValue([]);
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getTransactions({ portfolio_id: 'some-id' }, ctx);

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.transactions).toEqual([]);
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getTransactions({}, ctx);

    expect(mockService.getTransactions).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await getTransactions(null, ctx);

    expect(mockService.getTransactions).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.getTransactions.mockRejectedValue(new Error('Database error'));
    const ctx = createMockContext({ portfolioService: mockService });

    await expect(
      getTransactions({ portfolio_id: 'test-id' }, ctx)
    ).rejects.toThrow('Database error');
  });
});

