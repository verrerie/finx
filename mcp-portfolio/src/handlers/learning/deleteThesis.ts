import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const deleteThesis: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('asset_id' in args)) {
    return error('Missing arguments');
  }
  const deleted = await learningService.deleteThesis(
    args.portfolio_id as string,
    args.asset_id as string
  );

  return success({ deleted, message: deleted ? 'Thesis deleted' : 'Thesis not found' });
};
