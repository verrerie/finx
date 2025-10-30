import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const createPortfolio: ToolHandler = async (args, { portfolioService }) => {
  if (!args || typeof args !== 'object' || !('name' in args)) {
    return error('Missing arguments');
  }

  const portfolio = await portfolioService.createPortfolio({
    name: args.name as string,
    description: args.description as string | undefined,
    currency: args.currency as string | undefined,
  });

  return success({
    portfolio,
    message: `Portfolio "${portfolio.name}" created successfully!`,
  });
};


