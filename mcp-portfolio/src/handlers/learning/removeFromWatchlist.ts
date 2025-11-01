import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const removeFromWatchlist: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('asset_id' in args)) {
    return error('Missing arguments');
  }
  const removed = await learningService.removeFromWatchlist(
    args.portfolio_id as string,
    args.asset_id as string
  );

  return success({ removed, message: removed ? 'Item removed from watchlist' : 'Item not found in watchlist' });
};
