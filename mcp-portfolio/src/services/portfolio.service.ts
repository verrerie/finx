/**
 * Portfolio Service - Business logic layer
 * Follows Single Responsibility Principle: Coordinates portfolio operations
 * Follows Dependency Inversion Principle: Depends on repository abstractions
 */

import { transaction as dbTransaction } from '../database/connection.js';
import { PortfolioRepository } from '../database/repositories/portfolio.repository.js';
import { HoldingRepository } from '../database/repositories/holding.repository.js';
import { TransactionRepository } from '../database/repositories/transaction.repository.js';
import type {
  Portfolio,
  PortfolioSummary,
  Holding,
  HoldingDetail,
  Transaction,
  CreatePortfolioInput,
  AddTransactionInput,
  PerformanceMetrics,
  PositionPerformance,
} from '../types.js';

/**
 * Portfolio Service
 * Orchestrates portfolio management operations
 */
export class PortfolioService {
  constructor(
    private readonly portfolioRepo: PortfolioRepository,
    private readonly holdingRepo: HoldingRepository,
    private readonly transactionRepo: TransactionRepository
  ) {}

  /**
   * Create a new portfolio
   */
  async createPortfolio(input: CreatePortfolioInput): Promise<Portfolio> {
    return await this.portfolioRepo.create(input);
  }

  /**
   * Get all portfolios
   */
  async listPortfolios(): Promise<Portfolio[]> {
    return await this.portfolioRepo.findAll();
  }

  /**
   * Get portfolio summaries
   */
  async listPortfolioSummaries(): Promise<PortfolioSummary[]> {
    return await this.portfolioRepo.findAllSummaries();
  }

  /**
   * Get portfolio by ID
   */
  async getPortfolio(id: string): Promise<Portfolio | null> {
    return await this.portfolioRepo.findById(id);
  }

  /**
   * Get holdings for a portfolio
   */
  async getHoldings(portfolioId: string): Promise<HoldingDetail[]> {
    return await this.holdingRepo.findDetailsByPortfolio(portfolioId);
  }

  /**
   * Get transactions for a portfolio
   */
  async getTransactions(portfolioId: string, limit?: number): Promise<Transaction[]> {
    return await this.transactionRepo.find({
      portfolio_id: portfolioId,
      limit,
    });
  }

  /**
   * Add a transaction and update holdings atomically
   * This is the core business logic for portfolio management
   */
  async addTransaction(input: AddTransactionInput): Promise<{
    transaction: Transaction;
    holding: Holding | null;
  }> {
    // Verify portfolio exists
    const portfolio = await this.portfolioRepo.findById(input.portfolio_id);
    if (!portfolio) {
      throw new Error(`Portfolio not found: ${input.portfolio_id}`);
    }

    return await dbTransaction(async (conn) => {
      // Create transaction record
      const sql = `
        INSERT INTO transactions (
          portfolio_id, symbol, type, quantity, price, fees, 
          currency, transaction_date, notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        input.portfolio_id,
        input.symbol,
        input.type,
        input.quantity,
        input.price,
        input.fees || 0,
        input.currency || 'USD',
        typeof input.transaction_date === 'string' 
          ? input.transaction_date 
          : input.transaction_date.toISOString().split('T')[0],
        input.notes || null,
      ];
      
      const result = await conn.query(sql, params);
      const transactionId = result.insertId;

      // Update holdings based on transaction type
      let holding: Holding | null = null;

      if (input.type === 'BUY' || input.type === 'TRANSFER_IN') {
        // Get current holding
        const currentHolding = await this.holdingRepo.findBySymbol(
          input.portfolio_id,
          input.symbol
        );

        if (currentHolding) {
          // Update existing holding - calculate new average cost
          const newQuantity = currentHolding.quantity + input.quantity;
          const totalCost = 
            (currentHolding.quantity * currentHolding.average_cost) + 
            (input.quantity * input.price) + 
            (input.fees || 0);
          const newAverageCost = totalCost / newQuantity;

          await conn.query(
            `UPDATE holdings SET quantity = ?, average_cost = ? WHERE portfolio_id = ? AND symbol = ?`,
            [newQuantity, newAverageCost, input.portfolio_id, input.symbol]
          );

          holding = await this.holdingRepo.findBySymbol(input.portfolio_id, input.symbol);
        } else {
          // Create new holding
          const averageCost = input.price + (input.fees || 0) / input.quantity;
          
          await conn.query(
            `INSERT INTO holdings (portfolio_id, symbol, quantity, average_cost, currency) VALUES (?, ?, ?, ?, ?)`,
            [input.portfolio_id, input.symbol, input.quantity, averageCost, input.currency || 'USD']
          );

          holding = await this.holdingRepo.findBySymbol(input.portfolio_id, input.symbol);
        }
      } else if (input.type === 'SELL' || input.type === 'TRANSFER_OUT') {
        // Reduce holding quantity
        await conn.query(
          `UPDATE holdings SET quantity = quantity - ? WHERE portfolio_id = ? AND symbol = ?`,
          [input.quantity, input.portfolio_id, input.symbol]
        );

        // Delete if quantity <= 0
        await conn.query(
          `DELETE FROM holdings WHERE portfolio_id = ? AND symbol = ? AND quantity <= 0`,
          [input.portfolio_id, input.symbol]
        );

        holding = await this.holdingRepo.findBySymbol(input.portfolio_id, input.symbol);
      }
      // For DIVIDEND and SPLIT, we don't update holdings automatically

      // Fetch the created transaction
      const transaction = await this.transactionRepo.findById(transactionId);
      if (!transaction) {
        throw new Error('Failed to create transaction');
      }

      return { transaction, holding };
    });
  }

  /**
   * Calculate portfolio performance metrics
   * 
   * @param portfolioId Portfolio ID
   * @param currentPrices Map of symbol to current price
   * @returns Performance metrics
   */
  async calculatePerformance(
    portfolioId: string,
    currentPrices: Record<string, number>
  ): Promise<PerformanceMetrics> {
    const holdings = await this.holdingRepo.findByPortfolio(portfolioId);
    const totalCost = await this.holdingRepo.getTotalCost(portfolioId);
    const totalInvested = await this.transactionRepo.getTotalInvested(portfolioId);
    const totalRealized = await this.transactionRepo.getTotalRealized(portfolioId);
    const totalDividends = await this.transactionRepo.getTotalDividends(portfolioId);

    // Calculate current value
    let totalValue = 0;
    for (const holding of holdings) {
      const currentPrice = currentPrices[holding.symbol];
      if (currentPrice !== undefined) {
        totalValue += holding.quantity * currentPrice;
      } else {
        // If no current price provided, use average cost
        totalValue += holding.quantity * holding.average_cost;
      }
    }

    const gainLoss = totalValue - totalCost;
    const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

    const totalReturn = (totalValue + totalRealized + totalDividends) - totalInvested;
    const totalReturnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    return {
      portfolio_id: portfolioId,
      total_cost: totalCost,
      total_value: totalValue,
      gain_loss: gainLoss,
      gain_loss_percent: gainLossPercent,
      cash_balance: 0, // TODO: Implement cash tracking
      total_invested: totalInvested,
      total_return: totalReturn,
      total_return_percent: totalReturnPercent,
      positions: holdings.length,
    };
  }

  /**
   * Calculate performance for individual positions
   * 
   * @param portfolioId Portfolio ID
   * @param currentPrices Map of symbol to current price
   * @returns Array of position performance metrics
   */
  async calculatePositionPerformance(
    portfolioId: string,
    currentPrices: Record<string, number>
  ): Promise<PositionPerformance[]> {
    const holdings = await this.holdingRepo.findByPortfolio(portfolioId);
    const performanceMetrics = await this.calculatePerformance(portfolioId, currentPrices);

    return holdings.map(holding => {
      const currentPrice = currentPrices[holding.symbol] || holding.average_cost;
      const currentValue = holding.quantity * currentPrice;
      const totalCost = holding.quantity * holding.average_cost;
      const gainLoss = currentValue - totalCost;
      const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
      const weightPercent = performanceMetrics.total_value > 0 
        ? (currentValue / performanceMetrics.total_value) * 100 
        : 0;

      return {
        symbol: holding.symbol,
        quantity: holding.quantity,
        average_cost: holding.average_cost,
        total_cost: totalCost,
        current_price: currentPrice,
        current_value: currentValue,
        gain_loss: gainLoss,
        gain_loss_percent: gainLossPercent,
        weight_percent: weightPercent,
      };
    });
  }

  /**
   * Delete a portfolio and all related data
   */
  async deletePortfolio(id: string): Promise<boolean> {
    return await this.portfolioRepo.delete(id);
  }
}

