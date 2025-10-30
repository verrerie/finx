import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const getWatchlist: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args)) {
    return error('Missing arguments');
  }
  const watchlist = await learningService.getWatchlist(args.portfolio_id as string);
  return success({ watchlist, count: watchlist.length });
};


