/**
 * Tests for getTheses handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getTheses } from './getTheses.js';
import { MockLearningService, mockThesis, createMockContext } from '../../__tests__/mocks.js';

describe('getTheses Handler', () => {
  let mockService: MockLearningService;

  beforeEach(() => {
    mockService = new MockLearningService();
  });

  it('should get theses successfully', async () => {
    const theses = [mockThesis, { ...mockThesis, asset_id: 'a2' }];
    mockService.getTheses.mockResolvedValue(theses);
    const ctx = createMockContext({ learningService: mockService });

    const result = await getTheses({ portfolio_id: mockThesis.portfolio_id }, ctx);

    expect(mockService.getTheses).toHaveBeenCalledWith(mockThesis.portfolio_id);
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.theses).toHaveLength(2);
    expect(parsed.theses[0].asset_id).toBe(mockThesis.asset_id);
    expect(parsed.theses[1].asset_id).toBe('a2');
  });

  it('should return empty array when no theses exist', async () => {
    mockService.getTheses.mockResolvedValue([]);
    const ctx = createMockContext({ learningService: mockService });

    const result = await getTheses({ portfolio_id: 'test-id' }, ctx);

    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.theses).toEqual([]);
  });

  it('should return error when portfolio_id is missing', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await getTheses({}, ctx);

    expect(mockService.getTheses).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ learningService: mockService });

    const result = await getTheses(null, ctx);

    expect(mockService.getTheses).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.getTheses.mockRejectedValue(new Error('Database error'));
    const ctx = createMockContext({ learningService: mockService });

    await expect(
      getTheses({ portfolio_id: 'test-id' }, ctx)
    ).rejects.toThrow('Database error');
  });
});

