import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const getHoldings: ToolHandler = async (args, { portfolioService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args)) {
    return error('Missing arguments');
  }
  const holdings = await portfolioService.getHoldings(args.portfolio_id as string);
  return success({ count: holdings.length, holdings });
};


