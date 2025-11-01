import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const addToWatchlist: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('symbol' in args)) {
    return error('Missing arguments');
  }
  const watchlistItem = await learningService.addToWatchlist({
    portfolio_id: args.portfolio_id as string,
    symbol: args.symbol as string,
    notes: args.notes as string | undefined,
    target_price: args.target_price as number | undefined,
    priority: args.priority as 'LOW' | 'MEDIUM' | 'HIGH' | undefined,
  });

  return success({ watchlist_item: watchlistItem, message: `${watchlistItem.symbol} added to watchlist` });
};


