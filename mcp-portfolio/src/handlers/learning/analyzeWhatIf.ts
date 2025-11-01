import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const analyzeWhatIf: ToolHandler = async (args, { learningService }) => {
  if (!args || typeof args !== 'object' || !('portfolio_id' in args) || !('symbol' in args) || !('action' in args)) {
    return error('Missing arguments');
  }

  const action = (args.action as string) || '';
  const currentPrices = args.current_prices as Record<string, number>;

  if (action === 'SELL') {
    const analysis = await learningService.analyzeWhatIfSell(
      args.portfolio_id as string,
      args.symbol as string,
      args.price as number,
      currentPrices
    );
    return success({ analysis, message: `What-if analysis complete for SELL ${args.symbol}` });
  }

  if (action === 'BUY') {
    const analysis = await learningService.analyzeWhatIfBuy(
      args.portfolio_id as string,
      args.symbol as string,
      args.quantity as number,
      args.price as number,
      currentPrices
    );
    return success({ analysis, message: `What-if analysis complete for BUY ${args.symbol}` });
  }

  return error(`Invalid action: ${action}. Must be "BUY" or "SELL"`);
};


