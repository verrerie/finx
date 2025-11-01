/**
 * Tests for updateThesis handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { updateThesis } from './updateThesis.js';
import { MockLearningService, mockThesis, createMockContext } from '../../__tests__/mocks.js';

describe('updateThesis Handler', () => {
  let mockService: MockLearningService;

  beforeEach(() => {
    mockService = new MockLearningService();
  });

  it('should update thesis successfully', async () => {
    const updated = { ...mockThesis, thesis: 'Updated thesis' };
    mockService.updateThesis.mockResolvedValue(updated);
    const ctx = createMockContext({ learningService: mockService });

    const result = await updateThesis(
      {
        portfolio_id: mockThesis.portfolio_id,
        asset_id: mockThesis.asset_id,
        thesis: 'Updated thesis',
      },
      ctx
    );

    expect(mockService.updateThesis).toHaveBeenCalledWith(
      mockThesis.portfolio_id,
      mockThesis.asset_id,
      {
        thesis: 'Updated thesis',
        bull_case: undefined,
        bear_case: undefined,
        target_allocation: undefined,
        review_date: undefined,
        status: undefined,
      }
    );

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.thesis.asset_id).toBe(mockThesis.asset_id);
    expect(parsed.thesis.thesis).toBe('Updated thesis');
  });

  it('should return error when thesis is not found', async () => {
    mockService.updateThesis.mockResolvedValue(null);
    const ctx = createMockContext({ learningService: mockService });

    const result = await updateThesis(
      {
        portfolio_id: 'test-id',
        asset_id: 'a1',
        thesis: 'test',
      },
      ctx
    );

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.thesis).toBeNull();
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await updateThesis({ asset_id: 'a1' }, ctx);

    expect(mockService.updateThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when asset_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await updateThesis({ portfolio_id: 'test-id' }, ctx);

    expect(mockService.updateThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await updateThesis(null, ctx);

    expect(mockService.updateThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.updateThesis.mockRejectedValue(new Error('Database error'));
    const ctx = createMockContext({ learningService: mockService });

    await expect(
      updateThesis({ portfolio_id: 'test-id', asset_id: 'a1', thesis: 'test' }, ctx)
    ).rejects.toThrow('Database error');
  });
});

