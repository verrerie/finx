/**
 * Tests for analyzeWhatIf handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { analyzeWhatIf } from './analyzeWhatIf.js';
import { MockLearningService, createMockContext } from '../../__tests__/mocks.js';

describe('analyzeWhatIf Handler', () => {
  let mockService: MockLearningService;

  beforeEach(() => {
    mockService = new MockLearningService();
  });

  it('should analyze what-if BUY scenario successfully', async () => {
    const analysis = {
      current_state: { total_value: 10000, positions: [] },
      proposed_state: { total_value: 11000, positions: [] },
      impact: { value_change: 1000 },
    };
    mockService.analyzeWhatIfBuy.mockResolvedValue(analysis);
    const ctx = createMockContext({ learningService: mockService });

    const result = await analyzeWhatIf(
      {
        portfolio_id: 'test-id',
        symbol: 'AAPL',
        action: 'BUY',
        quantity: 10,
        price: 150,
        current_prices: { AAPL: 150 },
      },
      ctx
    );

    expect(mockService.analyzeWhatIfBuy).toHaveBeenCalledWith(
      'test-id',
      'AAPL',
      10,
      150,
      { AAPL: 150 }
    );

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.analysis).toEqual(analysis);
  });

  it('should analyze what-if SELL scenario successfully', async () => {
    const analysis = {
      current_state: { total_value: 10000, positions: [] },
      proposed_state: { total_value: 9500, positions: [] },
      impact: { value_change: -500 },
    };
    mockService.analyzeWhatIfSell.mockResolvedValue(analysis);
    const ctx = createMockContext({ learningService: mockService });

    const result = await analyzeWhatIf(
      {
        portfolio_id: 'test-id',
        symbol: 'AAPL',
        action: 'SELL',
        price: 150,
        current_prices: { AAPL: 150 },
      },
      ctx
    );

    expect(mockService.analyzeWhatIfSell).toHaveBeenCalledWith(
      'test-id',
      'AAPL',
      150,
      { AAPL: 150 }
    );

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.analysis).toEqual(analysis);
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await analyzeWhatIf(
      {
        symbol: 'AAPL',
        action: 'BUY',
        quantity: 10,
        price: 150,
        current_prices: {},
      },
      ctx
    );

    expect(mockService.analyzeWhatIf).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when required fields are missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await analyzeWhatIf({ portfolio_id: 'test-id' }, ctx);

    expect(mockService.analyzeWhatIf).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await analyzeWhatIf(null, ctx);

    expect(mockService.analyzeWhatIf).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error for invalid action', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await analyzeWhatIf(
      {
        portfolio_id: 'test-id',
        symbol: 'AAPL',
        action: 'INVALID',
        quantity: 10,
        price: 150,
        current_prices: {},
      },
      ctx
    );

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Invalid action');
  });

  it('should handle service errors', async () => {
    mockService.analyzeWhatIfBuy.mockRejectedValue(new Error('Analysis failed'));
    const ctx = createMockContext({ learningService: mockService });

    await expect(
      analyzeWhatIf(
        {
          portfolio_id: 'test-id',
          symbol: 'AAPL',
          action: 'BUY',
          quantity: 10,
          price: 150,
          current_prices: {},
        },
        ctx
      )
    ).rejects.toThrow('Analysis failed');
  });
});

