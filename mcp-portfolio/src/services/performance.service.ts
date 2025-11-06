
import { HoldingRepository } from '../database/repositories/holding.repository.js';
import { TransactionRepository } from '../database/repositories/transaction.repository.js';
import { PerformanceMetrics, PositionPerformance } from '../types.js';

export class PerformanceService {
  constructor(
    private readonly holdingRepo: HoldingRepository,
    private readonly transactionRepo: TransactionRepository
  ) {}

  public async calculatePerformance(
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
      const currentPrice = currentPrices[holding.asset_id];
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

  public async calculatePositionPerformance(
    portfolioId: string,
    currentPrices: Record<string, number>
  ): Promise<PositionPerformance[]> {
    const holdings = await this.holdingRepo.findDetailsByPortfolio(portfolioId);
    const performanceMetrics = await this.calculatePerformance(portfolioId, currentPrices);

    return holdings.map(holding => {
      const currentPrice = currentPrices[holding.asset_id] || holding.average_cost;
      const currentValue = holding.quantity * currentPrice;
      const totalCost = holding.quantity * holding.average_cost;
      const gainLoss = currentValue - totalCost;
      const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
      const weightPercent = performanceMetrics.total_value > 0
        ? (currentValue / performanceMetrics.total_value) * 100
        : 0;

      return {
        asset_id: holding.asset_id,
        asset_name: holding.asset_name,
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
}
