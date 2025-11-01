import type { ToolHandler } from './types.js';
import { createPortfolio } from './portfolio/createPortfolio.js';
import { listPortfolios } from './portfolio/listPortfolios.js';
import { getPortfolio } from './portfolio/getPortfolio.js';
import { getHoldings } from './portfolio/getHoldings.js';
import { addTransaction } from './portfolio/addTransaction.js';
import { getTransactions } from './portfolio/getTransactions.js';
import { calculatePerformance } from './portfolio/calculatePerformance.js';
import { deletePortfolio } from './portfolio/deletePortfolio.js';
import { addToWatchlist } from './learning/addToWatchlist.js';
import { getWatchlist } from './learning/getWatchlist.js';
import { updateWatchlistItem } from './learning/updateWatchlistItem.js';
import { removeFromWatchlist } from './learning/removeFromWatchlist.js';
import { createThesis } from './learning/createThesis.js';
import { getTheses } from './learning/getTheses.js';
import { getThesis } from './learning/getThesis.js';
import { updateThesis } from './learning/updateThesis.js';
import { deleteThesis } from './learning/deleteThesis.js';
import { analyzeWhatIf } from './learning/analyzeWhatIf.js';
import { createAsset } from './asset/createAsset.js';

export const handlers: Record<string, ToolHandler> = {
  create_portfolio: createPortfolio,
  list_portfolios: listPortfolios,
  get_portfolio: getPortfolio,
  get_holdings: getHoldings,
  add_transaction: addTransaction,
  get_transactions: getTransactions,
  calculate_performance: calculatePerformance,
  delete_portfolio: deletePortfolio,
  add_to_watchlist: addToWatchlist,
  get_watchlist: getWatchlist,
  update_watchlist_item: updateWatchlistItem,
  remove_from_watchlist: removeFromWatchlist,
  create_thesis: createThesis,
  get_theses: getTheses,
  get_thesis: getThesis,
  update_thesis: updateThesis,
  delete_thesis: deleteThesis,
  analyze_what_if: analyzeWhatIf,
  create_asset: createAsset,
};


