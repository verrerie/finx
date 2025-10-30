import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const deleteThesis: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('symbol' in args)) {
    return error('Missing arguments');
  }
  const deleted = await learningService.deleteThesis(
    args.portfolio_id as string,
    args.symbol as string
  );

  return success({ success: deleted, message: deleted ? 'Thesis deleted' : 'Thesis not found' });
};


