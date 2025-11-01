import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssetService } from './asset.service.js';
import * as connection from '../database/connection.js';

describe('AssetService', () => {
  let service: AssetService;
  let querySpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    service = new AssetService();
    querySpy = vi.spyOn(connection, 'query');
  });

  it('should create a stock asset successfully', async () => {
    querySpy.mockImplementation((sql: string, params: any[]) => {
      if (sql.includes('SELECT UUID()')) {
        return Promise.resolve([{ id: 'new-asset-id' }]);
      }
      if (sql.includes('SELECT id FROM asset_types')) {
        return Promise.resolve([{ id: 1, type_name: 'STOCK' }]);
      }
      if (sql.includes('INSERT INTO assets')) {
        return Promise.resolve({});
      }
      if (sql.includes('FROM assets a')) {
        return Promise.resolve([ // findAssetById query
          {
            id: 'new-asset-id',
            asset_type: 'STOCK',
            name: 'Apple Inc.',
            symbol: 'AAPL',
            currency: 'USD',
          },
        ]);
      }
      return Promise.resolve({});
    });

    const input = {
      asset_type: 'STOCK',
      name: 'Apple Inc.',
      symbol: 'AAPL',
      currency: 'USD',
    };

    const result = await service.createAsset(input);

    expect(querySpy).toHaveBeenCalledWith('SELECT UUID() as id');
    expect(querySpy).toHaveBeenCalledWith('SELECT id FROM asset_types WHERE type_name = ?', ['STOCK']);
    expect(querySpy).toHaveBeenCalledWith('INSERT INTO assets (id, asset_type_id, name, symbol, currency) VALUES (?, ?, ?, ?, ?)', ['new-asset-id', 1, 'Apple Inc.', 'AAPL', 'USD']);
    expect(result).toEqual({
      id: 'new-asset-id',
      asset_type: 'STOCK',
      name: 'Apple Inc.',
      symbol: 'AAPL',
      currency: 'USD',
    });
  });

  it('should create a real estate asset successfully', async () => {
    querySpy.mockImplementation((sql: string, params: any[]) => {
      if (sql.includes('SELECT UUID()')) {
        return Promise.resolve([{ id: 'new-asset-id-re' }]);
      }
      if (sql.includes('SELECT id FROM asset_types')) {
        return Promise.resolve([{ id: 2, type_name: 'REAL_ESTATE' }]);
      }
      if (sql.includes('INSERT INTO assets')) {
        return Promise.resolve({});
      }
      if (sql.includes('INSERT INTO asset_details_real_estate')) {
        return Promise.resolve({});
      }
      if (sql.includes('FROM assets a')) {
        return Promise.resolve([ // findAssetById query
          {
            id: 'new-asset-id-re',
            asset_type: 'REAL_ESTATE',
            name: 'My House',
            currency: 'USD',
            address: '123 Main St',
            property_type: 'House',
            market_value: 500000,
          },
        ]);
      }
      return Promise.resolve({});
    });

    const input = {
      asset_type: 'REAL_ESTATE',
      name: 'My House',
      currency: 'USD',
      address: '123 Main St',
      property_type: 'House',
      market_value: 500000,
    };

    const result = await service.createAsset(input);

    expect(querySpy).toHaveBeenCalledWith('SELECT UUID() as id');
    expect(querySpy).toHaveBeenCalledWith('SELECT id FROM asset_types WHERE type_name = ?', ['REAL_ESTATE']);
    expect(querySpy).toHaveBeenCalledWith('INSERT INTO assets (id, asset_type_id, name, symbol, currency) VALUES (?, ?, ?, ?, ?)', ['new-asset-id-re', 2, 'My House', undefined, 'USD']);
    expect(querySpy).toHaveBeenCalledWith('INSERT INTO asset_details_real_estate (asset_id, address, property_type, market_value) VALUES (?, ?, ?, ?)', ['new-asset-id-re', '123 Main St', 'House', 500000]);
    expect(result).toEqual({
      id: 'new-asset-id-re',
      asset_type: 'REAL_ESTATE',
      name: 'My House',
      currency: 'USD',
      address: '123 Main St',
      property_type: 'House',
      market_value: 500000,
    });
  });

  it('should create an investment account asset successfully', async () => {
    querySpy.mockImplementation((sql: string, params: any[]) => {
      if (sql.includes('SELECT UUID()')) {
        return Promise.resolve([{ id: 'new-asset-id-ia' }]);
      }
      if (sql.includes('SELECT id FROM asset_types')) {
        return Promise.resolve([{ id: 3, type_name: 'INVESTMENT_ACCOUNT' }]);
      }
      if (sql.includes('INSERT INTO assets')) {
        return Promise.resolve({});
      }
      if (sql.includes('INSERT INTO asset_details_investment_account')) {
        return Promise.resolve({});
      }
      if (sql.includes('FROM assets a')) {
        return Promise.resolve([ // findAssetById query
          {
            id: 'new-asset-id-ia',
            asset_type: 'INVESTMENT_ACCOUNT',
            name: 'My PEA',
            currency: 'EUR',
            account_type: 'PEA',
            institution: 'Bank A',
            current_value: 100000,
          },
        ]);
      }
      return Promise.resolve({});
    });

    const input = {
      asset_type: 'INVESTMENT_ACCOUNT',
      name: 'My PEA',
      currency: 'EUR',
      account_type: 'PEA',
      institution: 'Bank A',
      current_value: 100000,
    };

    const result = await service.createAsset(input);

    expect(querySpy).toHaveBeenCalledWith('SELECT UUID() as id');
    expect(querySpy).toHaveBeenCalledWith('SELECT id FROM asset_types WHERE type_name = ?', ['INVESTMENT_ACCOUNT']);
    expect(querySpy).toHaveBeenCalledWith('INSERT INTO assets (id, asset_type_id, name, symbol, currency) VALUES (?, ?, ?, ?, ?)', ['new-asset-id-ia', 3, 'My PEA', undefined, 'EUR']);
    expect(querySpy).toHaveBeenCalledWith('INSERT INTO asset_details_investment_account (asset_id, account_type, institution, current_value) VALUES (?, ?, ?, ?)', ['new-asset-id-ia', 'PEA', 'Bank A', 100000]);
    expect(result).toEqual({
      id: 'new-asset-id-ia',
      asset_type: 'INVESTMENT_ACCOUNT',
      name: 'My PEA',
      currency: 'EUR',
      account_type: 'PEA',
      institution: 'Bank A',
      current_value: 100000,
    });
  });

  it('should throw error for invalid asset type', async () => {
    querySpy.mockResolvedValueOnce([]); // asset_types query returns empty

    const input = {
      asset_type: 'UNKNOWN',
      name: 'Invalid Asset',
      currency: 'USD',
    };

    await expect(service.createAsset(input)).rejects.toThrow('Invalid asset type: UNKNOWN');
  });

  it('should find an asset by ID', async () => {
    const mockAsset = {
      id: 'asset-id-1',
      asset_type: 'STOCK',
      name: 'Apple Inc.',
      symbol: 'AAPL',
      currency: 'USD',
    };
    querySpy.mockResolvedValueOnce([mockAsset]);

    const result = await service.findAssetById('asset-id-1');

    expect(querySpy).toHaveBeenCalledWith(expect.stringContaining('FROM assets'), ['asset-id-1']);
    expect(result).toEqual(mockAsset);
  });

  it('should throw error if asset not found by ID', async () => {
    querySpy.mockResolvedValueOnce([]);

    await expect(service.findAssetById('non-existent-id')).rejects.toThrow('Asset not found: non-existent-id');
  });

  it('should find assets with filters', async () => {
    const mockAssets = [
      {
        id: 'asset-id-1',
        asset_type: 'STOCK',
        name: 'Apple Inc.',
        symbol: 'AAPL',
        currency: 'USD',
      },
      {
        id: 'asset-id-2',
        asset_type: 'REAL_ESTATE',
        name: 'My House',
        currency: 'USD',
        address: '123 Main St',
        property_type: 'House',
        market_value: 500000,
      },
    ];
    querySpy.mockResolvedValueOnce(mockAssets);

    const result = await service.findAssets({ asset_type: 'STOCK' });

    expect(querySpy).toHaveBeenCalledWith(expect.stringContaining('FROM assets'), []);
    expect(result).toEqual(mockAssets);
  });
});
