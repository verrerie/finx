import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';
import type { AddTransactionInput } from '../../types.js';

export const addTransaction: ToolHandler = async (args, { portfolioService }) => {
  if (
    !args ||
    typeof args !== 'object' ||
    !('portfolio_id' in args) ||
    !('symbol' in args) ||
    !('type' in args) ||
    !('quantity' in args) ||
    !('price' in args) ||
    !('transaction_date' in args)
  ) {
    return error('Missing arguments');
  }

  const input: AddTransactionInput = {
    portfolio_id: args.portfolio_id as string,
    symbol: args.symbol as string,
    type: args.type as any,
    quantity: args.quantity as number,
    price: args.price as number,
    fees: args.fees as number | undefined,
    currency: args.currency as string | undefined,
    transaction_date: args.transaction_date as string,
    notes: args.notes as string | undefined,
  };

  const result = await portfolioService.addTransaction(input);
  return success({
    transaction: result.transaction,
    holding: result.holding,
    message: `Transaction recorded: ${input.type} ${input.quantity} shares of ${input.symbol} @ $${input.price}`,
  });
};


