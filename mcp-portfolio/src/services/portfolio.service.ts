/**
 * Portfolio Service - Business logic layer
 * Follows Single Responsibility Principle: Coordinates portfolio operations
 * Follows Dependency Inversion Principle: Depends on repository abstractions
 */

import { transaction as dbTransaction } from '../database/connection.js';
import { HoldingRepository } from '../database/repositories/holding.repository.js';
import { PortfolioRepository } from '../database/repositories/portfolio.repository.js';
import { TransactionRepository } from '../database/repositories/transaction.repository.js';
import { AssetService } from './asset.service.js';
import type {
    AddTransactionInput,
    CreatePortfolioInput,
    Holding,
    HoldingDetail,
    PerformanceMetrics,
    Portfolio,
    PortfolioSummary,
    PositionPerformance,
    Transaction,
} from '../types.js';

import { PerformanceService } from './performance.service.js';

/**
 * Portfolio Service
 * Orchestrates portfolio management operations
 */
export class PortfolioService {
    constructor(
        private readonly portfolioRepo: PortfolioRepository,
        private readonly holdingRepo: HoldingRepository,
        private readonly transactionRepo: TransactionRepository,
        private readonly assetService: AssetService,
        private readonly performanceService: PerformanceService,
    ) { }

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
      const transaction = await this.transactionRepo.create(input);

            // Update holdings based on transaction type
            let holding: Holding | null = null;

            if (input.type === 'BUY' || input.type === 'TRANSFER_IN') {
                // Get current holding
                const currentHolding = await this.holdingRepo.findByAsset(
                    input.portfolio_id,
                    input.asset_id
                );

                if (currentHolding) {
                    const newQuantity = currentHolding.quantity + input.quantity;
                    const totalCost =
                        (currentHolding.quantity * currentHolding.average_cost) +
                        (input.quantity * input.price) +
                        (input.fees || 0);
                    const newAverageCost = totalCost / newQuantity;

                    await this.holdingRepo.updatePosition(input.portfolio_id, input.asset_id, newQuantity, newAverageCost);

                    holding = await this.holdingRepo.findByAsset(input.portfolio_id, input.asset_id);
        } else {
          const averageCost = input.price + (input.fees || 0) / input.quantity;
          
          await this.holdingRepo.create(input.portfolio_id, input.asset_id, input.quantity, averageCost);

          holding = await this.holdingRepo.findByAsset(input.portfolio_id, input.asset_id);
        }
            } else if (input.type === 'SELL' || input.type === 'TRANSFER_OUT') {
                // Reduce holding quantity
                await conn.query(
                    `UPDATE holdings SET quantity = quantity - ? WHERE portfolio_id = ? AND asset_id = ?`,
                    [input.quantity, input.portfolio_id, input.asset_id]
                );

                // Delete if quantity <= 0
                await conn.query(
                    `DELETE FROM holdings WHERE portfolio_id = ? AND asset_id = ? AND quantity <= 0`,
                    [input.portfolio_id, input.asset_id]
                );

                holding = await this.holdingRepo.findByAsset(input.portfolio_id, input.asset_id);
            }
            // For DIVIDEND and SPLIT, we don't update holdings automatically

            return { transaction, holding };
    });
  }

    /**
     * Calculate portfolio performance metrics
     * 
     * @param portfolioId Portfolio ID
     * @param currentPrices Map of asset_id to current price
     * @returns Performance metrics
     */
    async calculatePerformance(
        portfolioId: string,
        currentPrices: Record<string, number>
    ): Promise<PerformanceMetrics> {
        return await this.performanceService.calculatePerformance(portfolioId, currentPrices);
    }

    /**
     * Calculate performance for individual positions
     * 
     * @param portfolioId Portfolio ID
     * @param currentPrices Map of asset_id to current price
     * @returns Array of position performance metrics
     */
    async calculatePositionPerformance(
        portfolioId: string,
        currentPrices: Record<string, number>
    ): Promise<PositionPerformance[]> {
        return await this.performanceService.calculatePositionPerformance(portfolioId, currentPrices);
    }

    /**
     * Delete a portfolio and all related data
     */
    async deletePortfolio(id: string): Promise<boolean> {
        return await this.portfolioRepo.delete(id);
    }
}

