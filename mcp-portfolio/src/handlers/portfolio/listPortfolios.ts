import { success } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const listPortfolios: ToolHandler = async (_args, { portfolioService }) => {
  const portfolios = await portfolioService.listPortfolioSummaries();
  return success({ count: portfolios.length, portfolios });
};


