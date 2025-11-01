import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const getThesis: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('asset_id' in args)) {
    return error('Missing arguments');
  }
  const thesis = await learningService.getThesis(
    args.portfolio_id as string,
    args.asset_id as string
  );
  return success({ thesis, message: thesis ? 'Thesis found' : 'No thesis found for this asset' });
};
