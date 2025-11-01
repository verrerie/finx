import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const analyzeWhatIf: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('asset_id' in args) || !('action' in args)) {
    return error('Missing arguments');
  }

  const action = (args.action as string) || '';
  const currentPrices = args.current_prices as Record<string, number>;

  if (action === 'SELL') {
    const analysis = await learningService.analyzeWhatIfSell(
      args.portfolio_id as string,
      args.asset_id as string,
      args.price as number,
      currentPrices
    );
    return success({ analysis, message: `What-if analysis complete for SELL ${args.asset_id}` });
  }

  if (action === 'BUY') {
    const analysis = await learningService.analyzeWhatIfBuy(
      args.portfolio_id as string,
      args.asset_id as string,
      args.quantity as number,
      args.price as number,
      currentPrices
    );
    return success({ analysis, message: `What-if analysis complete for BUY ${args.asset_id}` });
  }

  return error(`Invalid action: ${action}. Must be "BUY" or "SELL"`);
};
