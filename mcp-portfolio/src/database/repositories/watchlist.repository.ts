/**
 * Watchlist Repository - Data access layer for watchlist items
 * Follows Single Responsibility Principle: Only handles watchlist data access
 */

import { query, parseDate } from '../connection.js';
import type { WatchlistItem, AddWatchlistInput } from '../../types.js';

/**
 * Watchlist Repository
 * Handles all database operations for watchlist items
 */
export class WatchlistRepository {
  /**
   * Add item to watchlist
   */
  async create(input: AddWatchlistInput): Promise<WatchlistItem> {
    const sql = `
      INSERT INTO watchlists (id, portfolio_id, symbol, notes, target_price, priority)
      VALUES (UUID(), ?, ?, ?, ?, ?)
    `;
    
    const params = [
      input.portfolio_id,
      input.symbol,
      input.notes || null,
      input.target_price || null,
      input.priority || 'MEDIUM',
    ];
    
    await query(sql, params);
    
    // Fetch the created item
    const item = await this.findBySymbol(input.portfolio_id, input.symbol);
    if (!item) {
      throw new Error('Failed to create watchlist item');
    }
    
    return item;
  }

  /**
   * Find all watchlist items for a portfolio
   */
  async findByPortfolio(portfolioId: string): Promise<WatchlistItem[]> {
    const sql = `
      SELECT id, portfolio_id, symbol, notes, target_price, priority,
        created_at, updated_at
      FROM watchlists
      WHERE portfolio_id = ?
      ORDER BY priority DESC, created_at DESC
    `;
    
    const results = await query<WatchlistItem>(sql, [portfolioId]);
    
    return results.map(row => ({
      ...row,
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    }));
  }

  /**
   * Find watchlist item by symbol
   */
  async findBySymbol(portfolioId: string, symbol: string): Promise<WatchlistItem | null> {
    const sql = `
      SELECT id, portfolio_id, symbol, notes, target_price, priority,
        created_at, updated_at
      FROM watchlists
      WHERE portfolio_id = ? AND symbol = ?
    `;
    
    const results = await query<WatchlistItem>(sql, [portfolioId, symbol]);
    
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
   * Update watchlist item
   */
  async update(
    portfolioId: string,
    symbol: string,
    updates: Partial<Pick<WatchlistItem, 'notes' | 'target_price' | 'priority'>>
  ): Promise<WatchlistItem | null> {
    const fields: string[] = [];
    const params: any[] = [];
    
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      params.push(updates.notes);
    }
    
    if (updates.target_price !== undefined) {
      fields.push('target_price = ?');
      params.push(updates.target_price);
    }
    
    if (updates.priority !== undefined) {
      fields.push('priority = ?');
      params.push(updates.priority);
    }
    
    if (fields.length === 0) {
      return this.findBySymbol(portfolioId, symbol);
    }
    
    params.push(portfolioId, symbol);
    
    const sql = `
      UPDATE watchlists
      SET ${fields.join(', ')}
      WHERE portfolio_id = ? AND symbol = ?
    `;
    
    await query(sql, params);
    
    return this.findBySymbol(portfolioId, symbol);
  }

  /**
   * Remove item from watchlist
   */
  async delete(portfolioId: string, symbol: string): Promise<boolean> {
    const sql = `
      DELETE FROM watchlists
      WHERE portfolio_id = ? AND symbol = ?
    `;
    
    const result = await query(sql, [portfolioId, symbol]);
    return (result as any).affectedRows > 0;
  }

  /**
   * Get watchlist count for a portfolio
   */
  async getCount(portfolioId: string): Promise<number> {
    const sql = `
      SELECT COUNT(*) as count
      FROM watchlists
      WHERE portfolio_id = ?
    `;
    
    const results = await query<{ count: number }>(sql, [portfolioId]);
    return results[0]?.count || 0;
  }

  /**
   * Get watchlist items by priority
   */
  async findByPriority(
    portfolioId: string,
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
  ): Promise<WatchlistItem[]> {
    const sql = `
      SELECT id, portfolio_id, symbol, notes, target_price, priority,
        created_at, updated_at
      FROM watchlists
      WHERE portfolio_id = ? AND priority = ?
      ORDER BY created_at DESC
    `;
    
    const results = await query<WatchlistItem>(sql, [portfolioId, priority]);
    
    return results.map(row => ({
      ...row,
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    }));
  }
}

