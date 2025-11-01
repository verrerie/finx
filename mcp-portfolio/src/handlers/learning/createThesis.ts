import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const createThesis: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('asset_id' in args) || !('thesis' in args)) {
    return error('Missing arguments');
  }
  const thesis = await learningService.createThesis({
    portfolio_id: args.portfolio_id as string,
    asset_id: args.asset_id as string,
    thesis: args.thesis as string,
    bull_case: args.bull_case as string | undefined,
    bear_case: args.bear_case as string | undefined,
    target_allocation: args.target_allocation as number | undefined,
    review_date: args.review_date ? new Date(args.review_date as string) : undefined,
  });

  return success({ thesis, message: `Investment thesis for asset ${thesis.asset_id} created` });
};
