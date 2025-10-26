/**
 * Portfolio Repository - Data access layer for portfolios
 * Follows Single Responsibility Principle: Only handles portfolio data access
 */

import { query, transaction, parseDate } from '../connection.js';
import type { 
  Portfolio, 
  PortfolioSummary,
  CreatePortfolioInput 
} from '../../types.js';

/**
 * Portfolio Repository
 * Handles all database operations for portfolios
 */
export class PortfolioRepository {
  /**
   * Create a new portfolio
   */
  async create(input: CreatePortfolioInput): Promise<Portfolio> {
    const sql = `
      INSERT INTO portfolios (name, description, currency)
      VALUES (?, ?, ?)
    `;
    
    const params = [
      input.name,
      input.description || null,
      input.currency || 'USD',
    ];
    
    const result = await query(sql, params);
    const insertId = (result as any).insertId;
    
    // Fetch and return the created portfolio
    const portfolio = await this.findById(insertId);
    if (!portfolio) {
      throw new Error('Failed to create portfolio');
    }
    
    return portfolio;
  }

  /**
   * Find portfolio by ID
   */
  async findById(id: string): Promise<Portfolio | null> {
    const sql = `
      SELECT id, name, description, currency, created_at, updated_at
      FROM portfolios
      WHERE id = ?
    `;
    
    const results = await query<Portfolio>(sql, [id]);
    
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
   * Find all portfolios
   */
  async findAll(): Promise<Portfolio[]> {
    const sql = `
      SELECT id, name, description, currency, created_at, updated_at
      FROM portfolios
      ORDER BY created_at DESC
    `;
    
    const results = await query<Portfolio>(sql);
    
    return results.map(row => ({
      ...row,
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    }));
  }

  /**
   * Get portfolio summaries (using the view)
   */
  async findAllSummaries(): Promise<PortfolioSummary[]> {
    const sql = `
      SELECT 
        id, 
        name, 
        description, 
        currency, 
        holding_count, 
        total_cost,
        created_at, 
        updated_at
      FROM portfolio_summary
      ORDER BY created_at DESC
    `;
    
    const results = await query<PortfolioSummary>(sql);
    
    return results.map(row => ({
      ...row,
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    }));
  }

  /**
   * Update portfolio
   */
  async update(
    id: string, 
    updates: Partial<Pick<Portfolio, 'name' | 'description' | 'currency'>>
  ): Promise<Portfolio | null> {
    const fields: string[] = [];
    const params: any[] = [];
    
    if (updates.name !== undefined) {
      fields.push('name = ?');
      params.push(updates.name);
    }
    
    if (updates.description !== undefined) {
      fields.push('description = ?');
      params.push(updates.description);
    }
    
    if (updates.currency !== undefined) {
      fields.push('currency = ?');
      params.push(updates.currency);
    }
    
    if (fields.length === 0) {
      // No updates provided
      return this.findById(id);
    }
    
    params.push(id);
    
    const sql = `
      UPDATE portfolios
      SET ${fields.join(', ')}
      WHERE id = ?
    `;
    
    await query(sql, params);
    
    return this.findById(id);
  }

  /**
   * Delete portfolio (cascade will delete related records)
   */
  async delete(id: string): Promise<boolean> {
    const sql = `
      DELETE FROM portfolios
      WHERE id = ?
    `;
    
    const result = await query(sql, [id]);
    return (result as any).affectedRows > 0;
  }

  /**
   * Check if portfolio exists
   */
  async exists(id: string): Promise<boolean> {
    const sql = `
      SELECT 1 FROM portfolios WHERE id = ? LIMIT 1
    `;
    
    const results = await query(sql, [id]);
    return results.length > 0;
  }
}

