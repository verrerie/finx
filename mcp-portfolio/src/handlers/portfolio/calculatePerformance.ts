import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const calculatePerformance: ToolHandler = async (args, { portfolioService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('current_prices' in args)) {
    return error('Missing arguments');
  }

  const currentPrices = args.current_prices as Record<string, number>;
  const performance = await portfolioService.calculatePerformance(
    args.portfolio_id as string,
    currentPrices
  );
  const positions = await portfolioService.calculatePositionPerformance(
    args.portfolio_id as string,
    currentPrices
  );
  return success({ performance, positions });
};


