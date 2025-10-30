import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const deletePortfolio: ToolHandler = async (args, { portfolioService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args)) {
    return error('Missing arguments');
  }
  const deleted = await portfolioService.deletePortfolio(args.portfolio_id as string);
  return success({
    success: deleted,
    message: deleted ? 'Portfolio deleted successfully' : 'Portfolio not found',
  });
};


