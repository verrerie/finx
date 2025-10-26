/**
 * Learning Service - Business logic for portfolio learning features
 * Follows Single Responsibility Principle: Coordinates learning operations
 * Follows Dependency Inversion Principle: Depends on repository abstractions
 */

import { WatchlistRepository } from '../database/repositories/watchlist.repository.js';
import { ThesisRepository } from '../database/repositories/thesis.repository.js';
import { HoldingRepository } from '../database/repositories/holding.repository.js';
import type {
  WatchlistItem,
  InvestmentThesis,
  AddWatchlistInput,
  CreateThesisInput,
  PositionPerformance,
} from '../types.js';

/**
 * Learning Service
 * Orchestrates portfolio learning and analysis operations
 */
export class LearningService {
  constructor(
    private readonly watchlistRepo: WatchlistRepository,
    private readonly thesisRepo: ThesisRepository,
    private readonly holdingRepo: HoldingRepository
  ) {}

  /**
   * Add symbol to watchlist
   */
  async addToWatchlist(input: AddWatchlistInput): Promise<WatchlistItem> {
    return await this.watchlistRepo.create(input);
  }

  /**
   * Get watchlist for a portfolio
   */
  async getWatchlist(portfolioId: string): Promise<WatchlistItem[]> {
    return await this.watchlistRepo.findByPortfolio(portfolioId);
  }

  /**
   * Update watchlist item
   */
  async updateWatchlistItem(
    portfolioId: string,
    symbol: string,
    updates: Partial<Pick<WatchlistItem, 'notes' | 'target_price' | 'priority'>>
  ): Promise<WatchlistItem | null> {
    return await this.watchlistRepo.update(portfolioId, symbol, updates);
  }

  /**
   * Remove from watchlist
   */
  async removeFromWatchlist(portfolioId: string, symbol: string): Promise<boolean> {
    return await this.watchlistRepo.delete(portfolioId, symbol);
  }

  /**
   * Create investment thesis
   */
  async createThesis(input: CreateThesisInput): Promise<InvestmentThesis> {
    return await this.thesisRepo.create(input);
  }

  /**
   * Get all investment theses for a portfolio
   */
  async getTheses(portfolioId: string): Promise<InvestmentThesis[]> {
    return await this.thesisRepo.findByPortfolio(portfolioId);
  }

  /**
   * Get thesis for a specific symbol
   */
  async getThesis(portfolioId: string, symbol: string): Promise<InvestmentThesis | null> {
    return await this.thesisRepo.findBySymbol(portfolioId, symbol);
  }

  /**
   * Update investment thesis
   */
  async updateThesis(
    portfolioId: string,
    symbol: string,
    updates: Partial<Omit<InvestmentThesis, 'id' | 'portfolio_id' | 'symbol' | 'created_at' | 'updated_at'>>
  ): Promise<InvestmentThesis | null> {
    return await this.thesisRepo.update(portfolioId, symbol, updates);
  }

  /**
   * Delete investment thesis
   */
  async deleteThesis(portfolioId: string, symbol: string): Promise<boolean> {
    return await this.thesisRepo.delete(portfolioId, symbol);
  }

  /**
   * Get theses needing review
   */
  async getThesesForReview(portfolioId: string): Promise<InvestmentThesis[]> {
    return await this.thesisRepo.findNeedingReview(portfolioId);
  }

  /**
   * Analyze what-if scenario: What if I sell a position?
   * 
   * @param portfolioId Portfolio ID
   * @param symbol Symbol to sell
   * @param sellPrice Price to sell at
   * @param currentPrices Current prices for all positions
   * @returns Analysis of portfolio impact
   */
  async analyzeWhatIfSell(
    portfolioId: string,
    symbol: string,
    sellPrice: number,
    currentPrices: Record<string, number>
  ): Promise<{
    symbol: string;
    action: 'SELL';
    current_position: {
      quantity: number;
      average_cost: number;
      total_cost: number;
      current_value: number;
      unrealized_gain_loss: number;
      unrealized_gain_loss_percent: number;
    };
    after_sale: {
      realized_gain_loss: number;
      realized_gain_loss_percent: number;
      proceeds: number;
      tax_impact_estimate: number; // 15% capital gains assumption
    };
    portfolio_impact: {
      current_total_value: number;
      new_total_value: number;
      position_weight_before: number;
      position_weight_after: number;
      cash_increase: number;
    };
  }> {
    // Get current holding
    const holding = await this.holdingRepo.findBySymbol(portfolioId, symbol);
    if (!holding) {
      throw new Error(`No holding found for ${symbol}`);
    }

    // Calculate current position metrics
    const currentPrice = currentPrices[symbol] || holding.average_cost;
    const currentValue = holding.quantity * currentPrice;
    const totalCost = holding.quantity * holding.average_cost;
    const unrealizedGainLoss = currentValue - totalCost;
    const unrealizedGainLossPercent = (unrealizedGainLoss / totalCost) * 100;

    // Calculate sale impact
    const proceeds = holding.quantity * sellPrice;
    const realizedGainLoss = proceeds - totalCost;
    const realizedGainLossPercent = (realizedGainLoss / totalCost) * 100;
    const taxImpactEstimate = realizedGainLoss > 0 ? realizedGainLoss * 0.15 : 0;

    // Calculate portfolio impact
    const allHoldings = await this.holdingRepo.findByPortfolio(portfolioId);
    let currentTotalValue = 0;
    for (const h of allHoldings) {
      const price = currentPrices[h.symbol] || h.average_cost;
      currentTotalValue += h.quantity * price;
    }

    const newTotalValue = currentTotalValue - currentValue + proceeds;
    const positionWeightBefore = (currentValue / currentTotalValue) * 100;
    const positionWeightAfter = 0; // Position is fully sold

    return {
      symbol,
      action: 'SELL',
      current_position: {
        quantity: holding.quantity,
        average_cost: holding.average_cost,
        total_cost: totalCost,
        current_value: currentValue,
        unrealized_gain_loss: unrealizedGainLoss,
        unrealized_gain_loss_percent: unrealizedGainLossPercent,
      },
      after_sale: {
        realized_gain_loss: realizedGainLoss,
        realized_gain_loss_percent: realizedGainLossPercent,
        proceeds,
        tax_impact_estimate: taxImpactEstimate,
      },
      portfolio_impact: {
        current_total_value: currentTotalValue,
        new_total_value: newTotalValue,
        position_weight_before: positionWeightBefore,
        position_weight_after: positionWeightAfter,
        cash_increase: proceeds,
      },
    };
  }

  /**
   * Analyze what-if scenario: What if I buy more of a position?
   * 
   * @param portfolioId Portfolio ID
   * @param symbol Symbol to buy
   * @param quantity Quantity to buy
   * @param buyPrice Price to buy at
   * @param currentPrices Current prices for all positions
   * @returns Analysis of portfolio impact
   */
  async analyzeWhatIfBuy(
    portfolioId: string,
    symbol: string,
    quantity: number,
    buyPrice: number,
    currentPrices: Record<string, number>
  ): Promise<{
    symbol: string;
    action: 'BUY';
    current_position: {
      quantity: number;
      average_cost: number;
      total_cost: number;
    } | null;
    after_purchase: {
      new_quantity: number;
      new_average_cost: number;
      new_total_cost: number;
      additional_investment: number;
    };
    portfolio_impact: {
      current_total_value: number;
      new_total_value: number;
      position_weight_before: number;
      position_weight_after: number;
      cash_required: number;
    };
  }> {
    // Get current holding (may not exist)
    const holding = await this.holdingRepo.findBySymbol(portfolioId, symbol);

    const currentQuantity = holding?.quantity || 0;
    const currentAverageCost = holding?.average_cost || 0;
    const currentTotalCost = holding ? holding.quantity * holding.average_cost : 0;

    // Calculate new position metrics
    const additionalInvestment = quantity * buyPrice;
    const newQuantity = currentQuantity + quantity;
    const newTotalCost = currentTotalCost + additionalInvestment;
    const newAverageCost = newTotalCost / newQuantity;

    // Calculate portfolio impact
    const allHoldings = await this.holdingRepo.findByPortfolio(portfolioId);
    let currentTotalValue = 0;
    let currentPositionValue = 0;

    for (const h of allHoldings) {
      const price = currentPrices[h.symbol] || h.average_cost;
      const value = h.quantity * price;
      currentTotalValue += value;
      if (h.symbol === symbol) {
        currentPositionValue = value;
      }
    }

    const positionWeightBefore = currentTotalValue > 0 
      ? (currentPositionValue / currentTotalValue) * 100 
      : 0;

    const newPositionValue = newQuantity * (currentPrices[symbol] || buyPrice);
    const newTotalValue = currentTotalValue + additionalInvestment;
    const positionWeightAfter = (newPositionValue / newTotalValue) * 100;

    return {
      symbol,
      action: 'BUY',
      current_position: holding ? {
        quantity: currentQuantity,
        average_cost: currentAverageCost,
        total_cost: currentTotalCost,
      } : null,
      after_purchase: {
        new_quantity: newQuantity,
        new_average_cost: newAverageCost,
        new_total_cost: newTotalCost,
        additional_investment: additionalInvestment,
      },
      portfolio_impact: {
        current_total_value: currentTotalValue,
        new_total_value: newTotalValue,
        position_weight_before: positionWeightBefore,
        position_weight_after: positionWeightAfter,
        cash_required: additionalInvestment,
      },
    };
  }
}

