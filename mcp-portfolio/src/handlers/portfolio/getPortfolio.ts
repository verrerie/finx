import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const getPortfolio: ToolHandler = async (args, { portfolioService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args)) {
    return error('Missing arguments');
  }

  const portfolio = await portfolioService.getPortfolio(args.portfolio_id as string);
  if (!portfolio) return error('Portfolio not found');
  return success({ portfolio });
};


