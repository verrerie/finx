/**
 * Tests for getThesis handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getThesis } from './getThesis.js';
import { MockLearningService, mockThesis, createMockContext } from '../../__tests__/mocks.js';

describe('getThesis Handler', () => {
  let mockService: MockLearningService;

  beforeEach(() => {
    mockService = new MockLearningService();
  });

  it('should get thesis successfully', async () => {
    mockService.getThesis.mockResolvedValue(mockThesis);
    const ctx = createMockContext({ learningService: mockService });

    const result = await getThesis(
      {
        portfolio_id: mockThesis.portfolio_id,
        asset_id: mockThesis.asset_id,
      },
      ctx
    );

    expect(mockService.getThesis).toHaveBeenCalledWith(mockThesis.portfolio_id, mockThesis.asset_id);
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.thesis.asset_id).toBe(mockThesis.asset_id);
    expect(parsed.thesis.thesis).toBe(mockThesis.thesis);
  });

  it('should return error when thesis is not found', async () => {
    mockService.getThesis.mockResolvedValue(null);
    const ctx = createMockContext({ learningService: mockService });

    const result = await getThesis(
      {
        portfolio_id: 'test-id',
        asset_id: 'a1',
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

    const result = await getThesis({ asset_id: 'a1' }, ctx);

    expect(mockService.getThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when asset_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await getThesis({ portfolio_id: 'test-id' }, ctx);

    expect(mockService.getThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await getThesis(null, ctx);

    expect(mockService.getThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.getThesis.mockRejectedValue(new Error('Database error'));
    const ctx = createMockContext({ learningService: mockService });

    await expect(
      getThesis({ portfolio_id: 'test-id', asset_id: 'a1' }, ctx)
    ).rejects.toThrow('Database error');
  });
});

