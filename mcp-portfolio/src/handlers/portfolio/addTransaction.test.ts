/**
 * Tests for addTransaction handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { addTransaction } from './addTransaction.js';
import { MockPortfolioService, mockTransaction, mockHolding, createMockContext } from '../../__tests__/mocks.js';

describe('addTransaction Handler', () => {
  let mockService: MockPortfolioService;

  beforeEach(() => {
    mockService = new MockPortfolioService();
  });

  it('should add a transaction successfully', async () => {
    mockService.addTransaction.mockResolvedValue({ transaction: mockTransaction, holding: mockHolding });
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await addTransaction(
      {
        portfolio_id: mockTransaction.portfolio_id,
        symbol: mockTransaction.symbol,
        type: mockTransaction.type,
        quantity: mockTransaction.quantity,
        price: mockTransaction.price,
        transaction_date: '2024-01-01',
        fees: 0,
        notes: null,
      },
      ctx
    );

    expect(mockService.addTransaction).toHaveBeenCalledWith({
      portfolio_id: mockTransaction.portfolio_id,
      symbol: mockTransaction.symbol,
      type: mockTransaction.type,
      quantity: mockTransaction.quantity,
      price: mockTransaction.price,
      transaction_date: '2024-01-01',
      fees: 0,
      notes: null,
      currency: undefined,
    });

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.transaction).toBeDefined();
    expect(parsed.holding).toBeDefined();
  });

  it('should return error when required fields are missing', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await addTransaction({}, ctx);

    expect(mockService.addTransaction).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toBeDefined();
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ portfolioService: mockService });

    const result = await addTransaction(null, ctx);

    expect(mockService.addTransaction).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.addTransaction.mockRejectedValue(new Error('Invalid transaction'));
    const ctx = createMockContext({ portfolioService: mockService });

    await expect(
      addTransaction(
        {
          portfolio_id: 'test-id',
          symbol: 'AAPL',
          type: 'BUY',
          quantity: 10,
          price: 150,
          transaction_date: '2024-01-01',
        },
        ctx
      )
    ).rejects.toThrow('Invalid transaction');
  });
});

