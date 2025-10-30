import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const removeFromWatchlist: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('symbol' in args)) {
    return error('Missing arguments');
  }
  const removed = await learningService.removeFromWatchlist(
    args.portfolio_id as string,
    args.symbol as string
  );

  return success({ success: removed, message: removed ? 'Item removed from watchlist' : 'Item not found in watchlist' });
};


