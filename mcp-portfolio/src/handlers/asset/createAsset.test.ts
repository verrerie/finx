/**
 * Tests for createAsset handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createAsset } from './createAsset.js';
import { MockAssetService, createMockContext } from '../../__tests__/mocks.js';

describe('createAsset Handler', () => {
  let mockService: MockAssetService;

  beforeEach(() => {
    mockService = new MockAssetService();
  });

  it('should create an asset successfully', async () => {
    const mockAsset = { id: 'a1', asset_type: 'STOCK', name: 'Test Stock', currency: 'USD' };
    mockService.createAsset.mockResolvedValue(mockAsset as any);
    const ctx = createMockContext({ assetService: mockService });

    const result = await createAsset(
      {
        asset_type: 'STOCK',
        name: 'Test Stock',
        currency: 'USD',
      },
      ctx
    );

    expect(mockService.createAsset).toHaveBeenCalledWith({
      asset_type: 'STOCK',
      name: 'Test Stock',
      currency: 'USD',
    });
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.asset).toEqual(mockAsset);
  });

  it('should return error when asset_type is missing', async () => {
    const ctx = createMockContext({ assetService: mockService });

    const result = await createAsset({ name: 'Test Stock' }, ctx);

    expect(mockService.createAsset).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when name is missing', async () => {
    const ctx = createMockContext({ assetService: mockService });

    const result = await createAsset({ asset_type: 'STOCK' }, ctx);

    expect(mockService.createAsset).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ assetService: mockService });

    const result = await createAsset(null, ctx);

    expect(mockService.createAsset).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.createAsset.mockRejectedValue(new Error('Invalid input'));
    const ctx = createMockContext({ assetService: mockService });

    await expect(
      createAsset({ asset_type: 'STOCK', name: 'Test Stock' }, ctx)
    ).rejects.toThrow('Invalid input');
  });
});
