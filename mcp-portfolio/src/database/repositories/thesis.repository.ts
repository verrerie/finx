/**
 * Investment Thesis Repository - Data access layer for investment theses
 * Follows Single Responsibility Principle: Only handles thesis data access
 */

import { query, formatDate, parseDate } from '../connection.js';
import type { InvestmentThesis, CreateThesisInput } from '../../types.js';

/**
 * Investment Thesis Repository
 * Handles all database operations for investment theses
 */
export class ThesisRepository {
  /**
   * Create a new investment thesis
   */
  async create(input: CreateThesisInput): Promise<InvestmentThesis> {
    const sql = `
      INSERT INTO investment_theses (
        id, portfolio_id, asset_id, thesis, bull_case, bear_case,
        target_allocation, review_date, status
      )
      VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `;
    
    const params = [
      input.portfolio_id,
      input.asset_id,
      input.thesis,
      input.bull_case || null,
      input.bear_case || null,
      input.target_allocation || null,
      input.review_date ? formatDate(input.review_date) : null,
    ];
    
    await query(sql, params);
    
    // Fetch the created thesis
    const thesis = await this.findByAsset(input.portfolio_id, input.asset_id);
    if (!thesis) {
      throw new Error('Failed to create investment thesis');
    }
    
    return thesis;
  }

  /**
   * Find thesis by portfolio and asset
   */
  async findByAsset(portfolioId: string, assetId: string): Promise<InvestmentThesis | null> {
    const sql = `
      SELECT id, portfolio_id, asset_id, thesis, bull_case, bear_case,
        target_allocation, review_date, status, created_at, updated_at
      FROM investment_theses
      WHERE portfolio_id = ? AND asset_id = ?
    `;
    
    const results = await query<InvestmentThesis>(sql, [portfolioId, assetId]);
    
    if (results.length === 0) {
      return null;
    }
    
    const row = results[0];
    return {
      ...row,
      review_date: parseDate(row.review_date),
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    };
  }

  /**
   * Find all theses for a portfolio
   */
  async findByPortfolio(portfolioId: string): Promise<InvestmentThesis[]> {
    const sql = `
      SELECT id, portfolio_id, asset_id, thesis, bull_case, bear_case,
        target_allocation, review_date, status, created_at, updated_at
      FROM investment_theses
      WHERE portfolio_id = ?
      ORDER BY status, created_at DESC
    `;
    
    const results = await query<InvestmentThesis>(sql, [portfolioId]);
    
    return results.map(row => ({
      ...row,
      review_date: parseDate(row.review_date),
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    }));
  }

  /**
   * Find theses by status
   */
  async findByStatus(
    portfolioId: string,
    status: 'ACTIVE' | 'MONITORING' | 'EXITED' | 'INVALIDATED'
  ): Promise<InvestmentThesis[]> {
    const sql = `
      SELECT id, portfolio_id, asset_id, thesis, bull_case, bear_case,
        target_allocation, review_date, status, created_at, updated_at
      FROM investment_theses
      WHERE portfolio_id = ? AND status = ?
      ORDER BY created_at DESC
    `;
    
    const results = await query<InvestmentThesis>(sql, [portfolioId, status]);
    
    return results.map(row => ({
      ...row,
      review_date: parseDate(row.review_date),
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    }));
  }

  /**
   * Update thesis
   */
  async update(
    portfolioId: string,
    assetId: string,
    updates: Partial<Omit<InvestmentThesis, 'id' | 'portfolio_id' | 'asset_id' | 'created_at' | 'updated_at'>>
  ): Promise<InvestmentThesis | null> {
    const fields: string[] = [];
    const params: any[] = [];
    
    if (updates.thesis !== undefined) {
      fields.push('thesis = ?');
      params.push(updates.thesis);
    }
    
    if (updates.bull_case !== undefined) {
      fields.push('bull_case = ?');
      params.push(updates.bull_case);
    }
    
    if (updates.bear_case !== undefined) {
      fields.push('bear_case = ?');
      params.push(updates.bear_case);
    }
    
    if (updates.target_allocation !== undefined) {
      fields.push('target_allocation = ?');
      params.push(updates.target_allocation);
    }
    
    if (updates.review_date !== undefined) {
      fields.push('review_date = ?');
      params.push(updates.review_date ? formatDate(updates.review_date) : null);
    }
    
    if (updates.status !== undefined) {
      fields.push('status = ?');
      params.push(updates.status);
    }
    
    if (fields.length === 0) {
      return this.findByAsset(portfolioId, assetId);
    }
    
    params.push(portfolioId, assetId);
    
    const sql = `
      UPDATE investment_theses
      SET ${fields.join(', ')}
      WHERE portfolio_id = ? AND asset_id = ?
    `;
    
    await query(sql, params);
    
    return this.findByAsset(portfolioId, assetId);
  }

  /**
   * Delete thesis
   */
  async delete(portfolioId: string, assetId: string): Promise<boolean> {
    const sql = `
      DELETE FROM investment_theses
      WHERE portfolio_id = ? AND asset_id = ?
    `;
    
    const result = await query(sql, [portfolioId, assetId]);
    return (result as any).affectedRows > 0;
  }

  /**
   * Get theses needing review (review_date in the past)
   */
  async findNeedingReview(portfolioId: string): Promise<InvestmentThesis[]> {
    const sql = `
      SELECT id, portfolio_id, asset_id, thesis, bull_case, bear_case,
        target_allocation, review_date, status, created_at, updated_at
      FROM investment_theses
      WHERE portfolio_id = ? 
        AND review_date IS NOT NULL 
        AND review_date <= CURDATE()
        AND status IN ('ACTIVE', 'MONITORING')
      ORDER BY review_date ASC
    `;
    
    const results = await query<InvestmentThesis>(sql, [portfolioId]);
    
    return results.map(row => ({
      ...row,
      review_date: parseDate(row.review_date),
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    }));
  }
}

