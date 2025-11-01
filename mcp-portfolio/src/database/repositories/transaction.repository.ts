/**
 * Transaction Repository - Data access layer for transactions
 * Follows Single Responsibility Principle: Only handles transaction data access
 */

import type { AddTransactionInput, Transaction, TransactionFilters } from '../../types.js';
import { formatDate, parseDate, query } from '../connection.js';

/**
 * Transaction Repository
 * Handles all database operations for transactions
 */
export class TransactionRepository {
  /**
   * Create a new transaction
   */
  async create(input: AddTransactionInput): Promise<Transaction> {
    const sql = `
      INSERT INTO transactions (
        id, portfolio_id, asset_id, type, quantity, price, fees, 
        currency, transaction_date, notes
      )
      VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      input.portfolio_id,
      input.asset_id,
      input.type,
      input.quantity,
      input.price,
      input.fees || 0,
      input.currency || 'USD',
      formatDate(input.transaction_date),
      input.notes || null,
    ];
    
    await query(sql, params);
    
    // Find the just-created transaction (most recent for this portfolio and asset)
    const findSql = `
      SELECT id, portfolio_id, asset_id, type, quantity, price, fees,
        currency, transaction_date, notes, created_at, updated_at
      FROM transactions
      WHERE portfolio_id = ? AND asset_id = ? AND type = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const results = await query<Transaction>(findSql, [input.portfolio_id, input.asset_id, input.type]);
    
    if (results.length === 0) {
      throw new Error('Failed to create transaction');
    }
    
    const row = results[0];
    return {
      ...row,
      transaction_date: parseDate(row.transaction_date) as Date,
      created_at: parseDate(row.created_at) as Date,
      updated_at: parseDate(row.updated_at) as Date,
    };
  }

    /**
     * Find transaction by ID
     */
    async findById(id: string): Promise<Transaction | null> {
        const sql = `
      SELECT 
        id, portfolio_id, asset_id, type, quantity, price, fees,
        currency, transaction_date, notes, created_at, updated_at
      FROM transactions
      WHERE id = ?
    `;

        const results = await query<Transaction>(sql, [id]);

        if (results.length === 0) {
            return null;
        }

        const row = results[0];
        return {
            ...row,
            transaction_date: parseDate(row.transaction_date) as Date,
            created_at: parseDate(row.created_at) as Date,
            updated_at: parseDate(row.updated_at) as Date,
        };
    }

    /**
     * Find transactions with filters
     */
    async find(filters: TransactionFilters = {}): Promise<Transaction[]> {
        const conditions: string[] = [];
        const params: any[] = [];

        if (filters.portfolio_id) {
            conditions.push('portfolio_id = ?');
            params.push(filters.portfolio_id);
        }

        if (filters.asset_id) {
            conditions.push('asset_id = ?');
            params.push(filters.asset_id);
        }

        if (filters.type) {
            conditions.push('type = ?');
            params.push(filters.type);
        }

        if (filters.start_date) {
            conditions.push('transaction_date >= ?');
            params.push(formatDate(filters.start_date));
        }

        if (filters.end_date) {
            conditions.push('transaction_date <= ?');
            params.push(formatDate(filters.end_date));
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        let sql = `
      SELECT 
        id, portfolio_id, asset_id, type, quantity, price, fees,
        currency, transaction_date, notes, created_at, updated_at
      FROM transactions
      ${whereClause}
      ORDER BY transaction_date DESC, created_at DESC
    `;

        if (filters.limit) {
            sql += ` LIMIT ${filters.limit}`;
            if (filters.offset) {
                sql += ` OFFSET ${filters.offset}`;
            }
        }

        const results = await query<Transaction>(sql, params);

        return results.map(row => ({
            ...row,
            transaction_date: parseDate(row.transaction_date) as Date,
            created_at: parseDate(row.created_at) as Date,
            updated_at: parseDate(row.updated_at) as Date,
        }));
    }

    /**
     * Find all transactions for a portfolio
     */
    async findByPortfolio(portfolioId: string): Promise<Transaction[]> {
        return this.find({ portfolio_id: portfolioId });
    }

    /**
     * Find all transactions for an asset within a portfolio
     */
    async findByAsset(portfolioId: string, assetId: string): Promise<Transaction[]> {
        return this.find({ portfolio_id: portfolioId, asset_id: assetId });
    }

    /**
     * Get total invested amount (sum of all buy transactions minus fees)
     */
    async getTotalInvested(portfolioId: string): Promise<number> {
        const sql = `
      SELECT SUM(quantity * price + fees) as total_invested
      FROM transactions
      WHERE portfolio_id = ? AND type IN ('BUY', 'TRANSFER_IN')
    `;

        const results = await query<{ total_invested: number }>(sql, [portfolioId]);
        return results[0]?.total_invested || 0;
    }

    /**
     * Get total realized gains (from sell transactions)
     */
    async getTotalRealized(portfolioId: string): Promise<number> {
        const sql = `
      SELECT SUM(quantity * price - fees) as total_realized
      FROM transactions
      WHERE portfolio_id = ? AND type IN ('SELL', 'TRANSFER_OUT')
    `;

        const results = await query<{ total_realized: number }>(sql, [portfolioId]);
        return results[0]?.total_realized || 0;
    }

    /**
     * Get total dividends received
     */
    async getTotalDividends(portfolioId: string): Promise<number> {
        const sql = `
      SELECT SUM(quantity * price) as total_dividends
      FROM transactions
      WHERE portfolio_id = ? AND type = 'DIVIDEND'
    `;

        const results = await query<{ total_dividends: number }>(sql, [portfolioId]);
        return results[0]?.total_dividends || 0;
    }

    /**
     * Get transaction count for a portfolio
     */
    async getCount(portfolioId: string): Promise<number> {
        const sql = `
      SELECT COUNT(*) as count
      FROM transactions
      WHERE portfolio_id = ?
    `;

        const results = await query<{ count: number }>(sql, [portfolioId]);
        return results[0]?.count || 0;
    }

    /**
     * Delete transaction (use with caution - affects holdings)
     */
    async delete(id: string): Promise<boolean> {
        const sql = `
      DELETE FROM transactions
      WHERE id = ?
    `;

        const result = await query(sql, [id]);
        return (result as any).affectedRows > 0;
    }
}

