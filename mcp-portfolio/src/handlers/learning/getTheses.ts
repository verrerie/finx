import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const getTheses: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args)) {
    return error('Missing arguments');
  }
  const theses = await learningService.getTheses(args.portfolio_id as string);
  return success({ theses, count: theses.length });
};


