/**
 * Holding Repository - Data access layer for holdings
 * Follows Single Responsibility Principle: Only handles holding data access
 */

import { query, parseDate } from '../connection.js';
import type { Holding, HoldingDetail } from '../../types.js';

/**
 * Holding Repository
 * Handles all database operations for holdings (positions)
 */
export class HoldingRepository {
  /**
   * Find all holdings for a portfolio
   */
  async findByPortfolio(portfolioId: string): Promise<Holding[]> {
    const sql = `
      SELECT 
        id, portfolio_id, asset_id, quantity, average_cost, 
        notes, created_at, updated_at
      FROM holdings
      WHERE portfolio_id = ?
      ORDER BY created_at DESC
    `;
    
    const results = await query<Holding>(sql, [portfolioId]);
    
    return results.map(row => ({
      ...row,
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    }));
  }

  /**
   * Find all holdings with details (using view)
   */
  async findDetailsByPortfolio(portfolioId: string): Promise<HoldingDetail[]> {
    const sql = `
      SELECT 
        id, portfolio_id, portfolio_name, asset_id, asset_name, symbol, asset_type,
        quantity, average_cost, currency, total_cost, notes, 
        created_at, updated_at
      FROM holding_details
      WHERE portfolio_id = ?
      ORDER BY created_at DESC
    `;
    
    const results = await query<HoldingDetail>(sql, [portfolioId]);
    
    return results.map(row => ({
      ...row,
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    }));
  }

  /**
   * Find holding by portfolio and asset
   */
  async findByAsset(portfolioId: string, assetId: string): Promise<Holding | null> {
    const sql = `
      SELECT 
        id, portfolio_id, asset_id, quantity, average_cost, 
        notes, created_at, updated_at
      FROM holdings
      WHERE portfolio_id = ? AND asset_id = ?
    `;
    
    const results = await query<Holding>(sql, [portfolioId, assetId]);
    
    if (results.length === 0) {
      return null;
    }
    
    const row = results[0];
    return {
      ...row,
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    };
  }

  /**
   * Find holding by ID
   */
  async findById(id: string): Promise<Holding | null> {
    const sql = `
      SELECT 
        id, portfolio_id, asset_id, quantity, average_cost, 
        notes, created_at, updated_at
      FROM holdings
      WHERE id = ?
    `;
    
    const results = await query<Holding>(sql, [id]);
    
    if (results.length === 0) {
      return null;
    }
    
    const row = results[0];
    return {
      ...row,
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    };
  }

  /**
   * Create a new holding
   */
  async create(
    portfolioId: string,
    assetId: string,
    quantity: number,
    averageCost: number,
    notes?: string
  ): Promise<Holding> {
    const sql = `
      INSERT INTO holdings (id, portfolio_id, asset_id, quantity, average_cost, notes)
      VALUES (UUID(), ?, ?, ?, ?, ?)
    `;
    
    const params = [portfolioId, assetId, quantity, averageCost, notes || null];
    
    await query(sql, params);
    
    // Fetch the created holding
    const holding = await this.findByAsset(portfolioId, assetId);
    if (!holding) {
      throw new Error('Failed to create holding');
    }
    
    return holding;
  }

  /**
   * Update holding quantity and average cost
   */
  async updatePosition(
    portfolioId: string,
    assetId: string,
    quantity: number,
    averageCost: number
  ): Promise<void> {
    const sql = `
      UPDATE holdings
      SET quantity = ?, average_cost = ?
      WHERE portfolio_id = ? AND asset_id = ?
    `;
    
    await query(sql, [quantity, averageCost, portfolioId, assetId]);
  }

  /**
   * Delete holding
   */
  async delete(portfolioId: string, assetId: string): Promise<boolean> {
    const sql = `
      DELETE FROM holdings
      WHERE portfolio_id = ? AND asset_id = ?
    `;
    
    const result = await query(sql, [portfolioId, assetId]);
    return (result as any).affectedRows > 0;
  }

  /**
   * Delete holdings with zero or negative quantity
   */
  async deleteZeroPositions(portfolioId: string): Promise<number> {
    const sql = `
      DELETE FROM holdings
      WHERE portfolio_id = ? AND quantity <= 0
    `;
    
    const result = await query(sql, [portfolioId]);
    return (result as any).affectedRows;
  }

  /**
   * Get total cost for a portfolio
   */
  async getTotalCost(portfolioId: string): Promise<number> {
    const sql = `
      SELECT SUM(quantity * average_cost) as total_cost
      FROM holdings
      WHERE portfolio_id = ?
    `;
    
    const results = await query<{ total_cost: number }>(sql, [portfolioId]);
    return results[0]?.total_cost || 0;
  }

  /**
   * Get holding count for a portfolio
   */
  async getCount(portfolioId: string): Promise<number> {
    const sql = `
      SELECT COUNT(*) as count
      FROM holdings
      WHERE portfolio_id = ?
    `;
    
    const results = await query<{ count: number }>(sql, [portfolioId]);
    return results[0]?.count || 0;
  }
}

