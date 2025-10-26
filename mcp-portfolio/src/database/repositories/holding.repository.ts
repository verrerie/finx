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
        id, portfolio_id, symbol, quantity, average_cost, 
        currency, notes, created_at, updated_at
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
        id, portfolio_id, portfolio_name, symbol, quantity, 
        average_cost, currency, total_cost, notes, 
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
   * Find holding by portfolio and symbol
   */
  async findBySymbol(portfolioId: string, symbol: string): Promise<Holding | null> {
    const sql = `
      SELECT 
        id, portfolio_id, symbol, quantity, average_cost, 
        currency, notes, created_at, updated_at
      FROM holdings
      WHERE portfolio_id = ? AND symbol = ?
    `;
    
    const results = await query<Holding>(sql, [portfolioId, symbol]);
    
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
        id, portfolio_id, symbol, quantity, average_cost, 
        currency, notes, created_at, updated_at
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
    symbol: string,
    quantity: number,
    averageCost: number,
    currency: string = 'USD',
    notes?: string
  ): Promise<Holding> {
    const sql = `
      INSERT INTO holdings (portfolio_id, symbol, quantity, average_cost, currency, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [portfolioId, symbol, quantity, averageCost, currency, notes || null];
    
    const result = await query(sql, params);
    const insertId = (result as any).insertId;
    
    const holding = await this.findById(insertId);
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
    symbol: string,
    quantity: number,
    averageCost: number
  ): Promise<void> {
    const sql = `
      UPDATE holdings
      SET quantity = ?, average_cost = ?
      WHERE portfolio_id = ? AND symbol = ?
    `;
    
    await query(sql, [quantity, averageCost, portfolioId, symbol]);
  }

  /**
   * Delete holding
   */
  async delete(portfolioId: string, symbol: string): Promise<boolean> {
    const sql = `
      DELETE FROM holdings
      WHERE portfolio_id = ? AND symbol = ?
    `;
    
    const result = await query(sql, [portfolioId, symbol]);
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

