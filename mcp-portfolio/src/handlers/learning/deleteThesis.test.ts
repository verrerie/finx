/**
 * Tests for deleteThesis handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { deleteThesis } from './deleteThesis.js';
import { MockLearningService, createMockContext } from '../../__tests__/mocks.js';

describe('deleteThesis Handler', () => {
  let mockService: MockLearningService;

  beforeEach(() => {
    mockService = new MockLearningService();
  });

  it('should delete thesis successfully', async () => {
    mockService.deleteThesis.mockResolvedValue(true);
    const ctx = createMockContext({ learningService: mockService });

    const result = await deleteThesis(
      {
        portfolio_id: 'test-id',
        asset_id: 'a1',
      },
      ctx
    );

    expect(mockService.deleteThesis).toHaveBeenCalledWith('test-id', 'a1');
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await deleteThesis({ asset_id: 'a1' }, ctx);

    expect(mockService.deleteThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when asset_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await deleteThesis({ portfolio_id: 'test-id' }, ctx);

    expect(mockService.deleteThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await deleteThesis(null, ctx);

    expect(mockService.deleteThesis).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.deleteThesis.mockRejectedValue(new Error('Thesis not found'));
    const ctx = createMockContext({ learningService: mockService });

    await expect(
      deleteThesis({ portfolio_id: 'test-id', asset_id: 'a1' }, ctx)
    ).rejects.toThrow('Thesis not found');
  });
});

