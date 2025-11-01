import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const addToWatchlist: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('asset_id' in args)) {
    return error('Missing arguments');
  }
  const watchlistItem = await learningService.addToWatchlist({
    portfolio_id: args.portfolio_id as string,
    asset_id: args.asset_id as string,
    notes: args.notes as string | undefined,
    target_price: args.target_price as number | undefined,
    priority: args.priority as 'LOW' | 'MEDIUM' | 'HIGH' | undefined,
  });

  return success({ watchlist_item: watchlistItem, message: `Asset ${watchlistItem.asset_id} added to watchlist` });
};
