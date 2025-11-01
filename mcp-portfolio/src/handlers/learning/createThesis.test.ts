/**
 * Tests for createThesis handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createThesis } from './createThesis.js';
import { MockLearningService, mockThesis, createMockContext } from '../../__tests__/mocks.js';

describe('createThesis Handler', () => {
  let mockService: MockLearningService;

  beforeEach(() => {
    mockService = new MockLearningService();
  });

  it('should create thesis successfully', async () => {
    mockService.createThesis.mockResolvedValue(mockThesis);
    const ctx = createMockContext({ learningService: mockService });

    const result = await createThesis(
      {
        portfolio_id: mockThesis.portfolio_id,
        symbol: mockThesis.symbol,
        thesis: mockThesis.thesis,
        bull_case: mockThesis.bull_case,
        bear_case: mockThesis.bear_case,
        target_allocation: mockThesis.target_allocation,
      },
      ctx
    );

    expect(mockService.createThesis).toHaveBeenCalledWith({
      portfolio_id: mockThesis.portfolio_id,
      symbol: mockThesis.symbol,
      thesis: mockThesis.thesis,
      bull_case: mockThesis.bull_case,
      bear_case: mockThesis.bear_case,
      target_allocation: mockThesis.target_allocation,
      review_date: undefined,
    });

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.thesis.symbol).toBe(mockThesis.symbol);
    expect(parsed.thesis.thesis).toBe(mockThesis.thesis);
    expect(parsed.message).toContain(mockThesis.symbol);
  });

  it('should create thesis with minimal arguments', async () => {
    mockService.createThesis.mockResolvedValue(mockThesis);
    const ctx = createMockContext({ learningService: mockService });

    const result = await createThesis(
      {
        portfolio_id: 'test-id',
        symbol: 'AAPL',
        thesis: 'Good company',
      },
      ctx
    );

    expect(mockService.createThesis).toHaveBeenCalledWith({
      portfolio_id: 'test-id',
      symbol: 'AAPL',
      thesis: 'Good company',
      bull_case: undefined,
      bear_case: undefined,
      target_allocation: undefined,
      review_date: undefined,
    });

    expect(result.isError).toBeUndefined();
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await createThesis({ symbol: 'AAPL', thesis: 'test' }, ctx);

    expect(mockService.createThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when symbol is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await createThesis({ portfolio_id: 'test-id', thesis: 'test' }, ctx);

    expect(mockService.createThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error when thesis is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await createThesis({ portfolio_id: 'test-id', symbol: 'AAPL' }, ctx);

    expect(mockService.createThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await createThesis(null, ctx);

    expect(mockService.createThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.createThesis.mockRejectedValue(new Error('Duplicate thesis'));
    const ctx = createMockContext({ learningService: mockService });

    await expect(
      createThesis({ portfolio_id: 'test-id', symbol: 'AAPL', thesis: 'test' }, ctx)
    ).rejects.toThrow('Duplicate thesis');
  });
});

