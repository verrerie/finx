/**
 * Type definitions for Portfolio Management
 */

export type AssetType = 'STOCK' | 'REAL_ESTATE' | 'INVESTMENT_ACCOUNT';

/**
 * Portfolio entity
 */
export interface Portfolio {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Generic Asset entity
 */
export interface Asset {
  id: string;
  asset_type: AssetType;
  name: string;
  currency: string;
}

export interface Stock extends Asset {
  asset_type: 'STOCK';
  symbol: string;
}

export interface RealEstate extends Asset {
  asset_type: 'REAL_ESTATE';
  address: string;
  property_type: string;
  market_value: number;
}

export interface InvestmentAccount extends Asset {
  asset_type: 'INVESTMENT_ACCOUNT';
  account_type: string; // PEA, PER, Assurance Vie
  institution: string;
  current_value: number;
}

/**
 * Holding (position) entity
 */
export interface Holding {
  id: string;
  portfolio_id: string;
  asset_id: string;
  quantity: number;
  average_cost: number;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Transaction types
 */
export type TransactionType = 
  | 'BUY' 
  | 'SELL' 
  | 'DIVIDEND' 
  | 'SPLIT' 
  | 'TRANSFER_IN' 
  | 'TRANSFER_OUT'
  | 'RENTAL_INCOME'
  | 'EXPENSE';

/**
 * Transaction entity
 */
export interface Transaction {
  id: string;
  portfolio_id: string;
  asset_id: string;
  type: TransactionType;
  quantity: number;
  price: number;
  fees: number;
  currency: string;
  transaction_date: Date;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Watchlist item entity
 */
export interface WatchlistItem {
  id: string;
  portfolio_id: string;
  asset_id: string;
  notes: string | null;
  target_price: number | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  created_at: Date;
  updated_at: Date;
}

/**
 * Investment thesis entity
 */
export interface InvestmentThesis {
  id: string;
  portfolio_id: string;
  asset_id: string;
  thesis: string;
  bull_case: string | null;
  bear_case: string | null;
  target_allocation: number | null;
  review_date: Date | null;
  status: 'ACTIVE' | 'MONITORING' | 'EXITED' | 'INVALIDATED';
  created_at: Date;
  updated_at: Date;
}

/**
 * Portfolio snapshot entity
 */
export interface PortfolioSnapshot {
  id: string;
  portfolio_id: string;
  snapshot_date: Date;
  total_value: number;
  total_cost: number;
  cash_balance: number;
  currency: string;
  created_at: Date;
}

/**
 * Tag entity
 */
export interface Tag {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
  created_at: Date;
}

/**
 * Holding with enriched data (from view or joined query)
 */
export interface HoldingDetail extends Holding {
  portfolio_name: string;
  asset_name: string;
  asset_type: AssetType;
  symbol: string | null;
  currency: string;
  total_cost: number;
  current_price?: number;
  current_value?: number;
  gain_loss?: number;
  gain_loss_percent?: number;
  tags?: Tag[];
}

/**
 * Portfolio summary (from view or aggregated query)
 */
export interface PortfolioSummary extends Portfolio {
  holding_count: number;
  total_cost: number;
  total_value?: number;
  gain_loss?: number;
  gain_loss_percent?: number;
}

/**
 * Transaction filters for queries
 */
export interface TransactionFilters {
  portfolio_id?: string;
  asset_id?: string;
  type?: TransactionType;
  start_date?: Date;
  end_date?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  portfolio_id: string;
  total_cost: number;
  total_value: number;
  gain_loss: number;
  gain_loss_percent: number;
  cash_balance: number;
  total_invested: number;
  total_return: number;
  total_return_percent: number;
  positions: number;
  period_start?: Date;
  period_end?: Date;
}

/**
 * Position performance (individual holding performance)
 */
export interface PositionPerformance {
  asset_id: string;
  asset_name: string;
  symbol: string | null;
  quantity: number;
  average_cost: number;
  total_cost: number;
  current_price: number;
  current_value: number;
  gain_loss: number;
  gain_loss_percent: number;
  weight_percent: number;
  days_held?: number;
}

/**
 * Input for creating a new portfolio
 */
export interface CreatePortfolioInput {
  name: string;
  description?: string;
  currency?: string;
}

/**
 * Input for adding a transaction
 */
export interface AddTransactionInput {
  portfolio_id: string;
  asset_id: string;
  type: TransactionType;
  quantity: number;
  price: number;
  fees?: number;
  currency?: string;
  transaction_date: Date | string;
  notes?: string;
}

/**
 * Input for adding to watchlist
 */
export interface AddWatchlistInput {
  portfolio_id: string;
  asset_id: string;
  notes?: string;
  target_price?: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

/**
 * Input for creating investment thesis
 */
export interface CreateThesisInput {
  portfolio_id: string;
  asset_id: string;
  thesis: string;
  bull_case?: string;
  bear_case?: string;
  target_allocation?: number;
  review_date?: Date | string;
}

