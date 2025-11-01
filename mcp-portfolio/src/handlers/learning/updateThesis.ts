import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const updateThesis: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('asset_id' in args)) {
    return error('Missing arguments');
  }
  const updates: any = {};
  if (args.thesis !== undefined) updates.thesis = args.thesis as string;
  if (args.bull_case !== undefined) updates.bull_case = args.bull_case as string;
  if (args.bear_case !== undefined) updates.bear_case = args.bear_case as string;
  if (args.target_allocation !== undefined) updates.target_allocation = args.target_allocation as number;
  if (args.review_date !== undefined) updates.review_date = new Date(args.review_date as string);
  if (args.status !== undefined) updates.status = args.status as 'ACTIVE' | 'MONITORING' | 'EXITED' | 'INVALIDATED';

  const updatedThesis = await learningService.updateThesis(
    args.portfolio_id as string,
    args.asset_id as string,
    updates
  );

  return success({ thesis: updatedThesis, message: 'Thesis updated' });
};
