import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const getTransactions: ToolHandler = async (args, { portfolioService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args)) {
    return error('Missing arguments');
  }
  const transactions = await portfolioService.getTransactions(
    args.portfolio_id as string,
    args.limit as number | undefined
  );
  return success({ count: transactions.length, transactions });
};


