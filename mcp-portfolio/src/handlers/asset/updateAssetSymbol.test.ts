/**
 * Tests for updateAssetSymbol handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { updateAssetSymbol } from './updateAssetSymbol.js';
import { MockAssetService, createMockContext } from '../../__tests__/mocks.js';

describe('updateAssetSymbol Handler', () => {
  let mockService: MockAssetService;

  beforeEach(() => {
    mockService = new MockAssetService();
  });

  it('should update an asset symbol successfully', async () => {
    const mockAsset = { id: 'a1', asset_type: 'STOCK', name: 'Test Stock', symbol: 'NEW', currency: 'USD' };
    mockService.updateAssetSymbol.mockResolvedValue(mockAsset as any);
    const ctx = createMockContext({ assetService: mockService });

    const result = await updateAssetSymbol(
      {
        asset_id: 'a1',
        new_symbol: 'NEW',
      },
      ctx
    );

    expect(mockService.updateAssetSymbol).toHaveBeenCalledWith('a1', 'NEW');
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.asset).toEqual(mockAsset);
    expect(parsed.message).toContain('Asset symbol updated to NEW');
  });

  it('should return error when asset_id is missing', async () => {
    const ctx = createMockContext({ assetService: mockService });

    const result = await updateAssetSymbol({ new_symbol: 'NEW' }, ctx);

    expect(mockService.updateAssetSymbol).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when new_symbol is missing', async () => {
    const ctx = createMockContext({ assetService: mockService });

    const result = await updateAssetSymbol({ asset_id: 'a1' }, ctx);

    expect(mockService.updateAssetSymbol).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Missing arguments');
  });

  it('should return error when args is null', async () => {
    const ctx = createMockContext({ assetService: mockService });

    const result = await updateAssetSymbol(null, ctx);

    expect(mockService.updateAssetSymbol).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it('should handle service errors', async () => {
    mockService.updateAssetSymbol.mockRejectedValue(new Error('Symbol already exists'));
    const ctx = createMockContext({ assetService: mockService });

    const result = await updateAssetSymbol({ asset_id: 'a1', new_symbol: 'EXISTING' }, ctx);

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('Symbol already exists');
  });

  it('should return error when new_symbol is already in use', async () => {
    mockService.updateAssetSymbol.mockRejectedValue(new Error("Symbol 'EXISTING' is already in use."));
    const ctx = createMockContext({ assetService: mockService });

    const result = await updateAssetSymbol({ asset_id: 'a1', new_symbol: 'EXISTING' }, ctx);

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain("Symbol 'EXISTING' is already in use.");
  });
});
