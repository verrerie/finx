import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const updateWatchlistItem: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('symbol' in args)) {
    return error('Missing arguments');
  }
  const updates: any = {};
  if (args.notes !== undefined) updates.notes = args.notes as string;
  if (args.target_price !== undefined) updates.target_price = args.target_price as number;
  if (args.priority !== undefined) updates.priority = args.priority as 'LOW' | 'MEDIUM' | 'HIGH';

  const updatedItem = await learningService.updateWatchlistItem(
    args.portfolio_id as string,
    args.symbol as string,
    updates
  );

  return success({ watchlist_item: updatedItem, message: 'Watchlist item updated' });
};


