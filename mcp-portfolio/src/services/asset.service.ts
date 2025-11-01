/**
 * Asset Service - Business logic for asset management
 */

import { query } from '../database/connection.js';
import type { Asset, Stock, RealEstate, InvestmentAccount, AssetType } from '../types.js';

export class AssetService {
  /**
   * Create a new asset
   */
  async createAsset(input: any): Promise<Asset> {
    const assetTypeIdResult = await query<{ id: number }>('SELECT id FROM asset_types WHERE type_name = ?', [input.asset_type]);
    if (assetTypeIdResult.length === 0) {
      throw new Error(`Invalid asset type: ${input.asset_type}`);
    }
    const assetTypeId = assetTypeIdResult[0].id;

    const uuidResult = await query('SELECT UUID() as id');
    const assetId = uuidResult[0]?.id;

    if (!assetId) {
      throw new Error('Failed to generate UUID for asset');
    }

    await query('INSERT INTO assets (id, asset_type_id, name, symbol, currency) VALUES (?, ?, ?, ?, ?)', [assetId, assetTypeId, input.name, input.symbol, input.currency]);

    switch (input.asset_type) {
      case 'STOCK':
        // No extra details for stock
        break;
      case 'REAL_ESTATE':
        await query('INSERT INTO asset_details_real_estate (asset_id, address, property_type, market_value) VALUES (?, ?, ?, ?)', [assetId, input.address, input.property_type, input.market_value]);
        break;
      case 'INVESTMENT_ACCOUNT':
        await query('INSERT INTO asset_details_investment_account (asset_id, account_type, institution, current_value) VALUES (?, ?, ?, ?)', [assetId, input.account_type, input.institution, input.current_value]);
        break;
    }

    return this.findAssetById(assetId);
  }

  /**
   * Find asset by ID
   */
  async findAssetById(id: string): Promise<Asset> {
    const assets = await this.findAssets({ id });
    if (assets.length === 0) {
      throw new Error(`Asset not found: ${id}`);
    }
    return assets[0];
  }

  /**
   * Find assets with filters
   */
  async findAssets(filters: any): Promise<Asset[]> {
    let sql = `
      SELECT
        a.id, at.type_name as asset_type, a.name, a.symbol, a.currency,
        re.address, re.property_type, re.market_value,
        ia.account_type, ia.institution, ia.current_value
      FROM assets a
      JOIN asset_types at ON a.asset_type_id = at.id
      LEFT JOIN asset_details_real_estate re ON a.id = re.asset_id
      LEFT JOIN asset_details_investment_account ia ON a.id = ia.asset_id
    `;

    const where: string[] = [];
    const params: any[] = [];

    if (filters.id) {
      where.push('a.id = ?');
      params.push(filters.id);
    }

    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }

    const results = await query(sql, params);

    return results.map((row: any) => {
      const asset: Asset = {
        id: row.id,
        asset_type: row.asset_type,
        name: row.name,
        currency: row.currency,
      };

      if (row.asset_type === 'STOCK' && row.symbol) {
        (asset as Stock).symbol = row.symbol;
      }

      if (row.asset_type === 'REAL_ESTATE') {
        (asset as RealEstate).address = row.address;
        (asset as RealEstate).property_type = row.property_type;
        (asset as RealEstate).market_value = row.market_value;
      }

      if (row.asset_type === 'INVESTMENT_ACCOUNT') {
        (asset as InvestmentAccount).account_type = row.account_type;
        (asset as InvestmentAccount).institution = row.institution;
        (asset as InvestmentAccount).current_value = row.current_value;
      }

      return asset;
    });
  }
}
