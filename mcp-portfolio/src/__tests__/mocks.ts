import { vi } from 'vitest';
import type { LearningService } from '../services/learning.service.js';
import type { PortfolioService } from '../services/portfolio.service.js';
import type { AssetService } from '../services/asset.service.js';
import type {
    AddTransactionInput,
    AddWatchlistInput,
    CreatePortfolioInput,
    CreateThesisInput,
    Holding,
    HoldingDetail,
    InvestmentThesis,
    PerformanceMetrics,
    Portfolio,
    PortfolioSummary,
    Transaction,
    WatchlistItem,
} from '../types.js';

// Sample data for testing
export const mockPortfolio: Portfolio = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Portfolio',
    description: 'A test portfolio',
    currency: 'USD',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
};

export const mockPortfolioSummary: PortfolioSummary = {
    ...mockPortfolio,
    holding_count: 2,
    total_cost: 10000,
};

export const mockHolding: Holding = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    portfolio_id: mockPortfolio.id,
    asset_id: 'a1',
    quantity: 10,
    average_cost: 150.00,
    notes: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
};

export const mockHoldingDetail: HoldingDetail = {
    ...mockHolding,
    portfolio_name: 'Test Portfolio',
    asset_name: 'Apple Inc.',
    asset_type: 'STOCK',
    symbol: 'AAPL',
    currency: 'USD',
    total_cost: 1500.00,
    current_price: 170.00,
    current_value: 1700.00,
    gain_loss: 200.00,
    gain_loss_percent: 13.33,
};

export const mockTransaction: Transaction = {
    id: '123e4567-e89b-12d3-a456-426614174002',
    portfolio_id: mockPortfolio.id,
    asset_id: 'a1',
    type: 'BUY',
    quantity: 10,
    price: 150.00,
    fees: 0,
    currency: 'USD',
    transaction_date: new Date('2024-01-01'),
    notes: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
};

export const mockWatchlistItem: WatchlistItem = {
    id: '123e4567-e89b-12d3-a456-426614174003',
    portfolio_id: mockPortfolio.id,
    asset_id: 'a2',
    notes: 'Interesting company',
    target_price: 350.00,
    priority: 'HIGH',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
};

export const mockThesis: InvestmentThesis = {
    id: '123e4567-e89b-12d3-a456-426614174004',
    portfolio_id: mockPortfolio.id,
    asset_id: 'a3',
    thesis: 'Strong moat in search',
    bull_case: 'AI integration',
    bear_case: 'Regulatory risks',
    target_allocation: 15,
    status: 'ACTIVE',
    review_date: new Date('2024-12-31'),
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
};

export const mockPerformance: PerformanceMetrics = {
    portfolio_id: mockPortfolio.id,
    total_cost: 10000,
    total_value: 11000,
    gain_loss: 1000,
    gain_loss_percent: 10,
    cash_balance: 0,
    total_invested: 10000,
    total_return: 1000,
    total_return_percent: 10,
    positions: 2,
};

// Mock PortfolioService
export class MockPortfolioService implements Partial<PortfolioService> {
    createPortfolio = vi.fn<(input: CreatePortfolioInput) => Promise<Portfolio>>();
    listPortfolios = vi.fn<() => Promise<Portfolio[]>>();
    getPortfolioSummaries = vi.fn<() => Promise<PortfolioSummary[]>>();
    listPortfolioSummaries = vi.fn<() => Promise<PortfolioSummary[]>>();
    getPortfolio = vi.fn<(id: string) => Promise<Portfolio | null>>();
    deletePortfolio = vi.fn<(id: string) => Promise<boolean>>();
    getHoldings = vi.fn<(portfolioId: string) => Promise<HoldingDetail[]>>();
    addTransaction = vi.fn<(input: AddTransactionInput) => Promise<{ transaction: Transaction; holding: Holding }>>();
    getTransactions = vi.fn<(portfolioId: string, limit?: number) => Promise<Transaction[]>>();
    calculatePerformance = vi.fn<(portfolioId: string, currentPrices: Record<string, number>) => Promise<PerformanceMetrics>>();
    calculatePositionPerformance = vi.fn<(portfolioId: string, currentPrices: Record<string, number>) => Promise<any[]>>();
}

// Mock LearningService
export class MockLearningService implements Partial<LearningService> {
    addToWatchlist = vi.fn<(input: AddWatchlistInput) => Promise<WatchlistItem>>();
    getWatchlist = vi.fn<(portfolioId: string) => Promise<WatchlistItem[]>>();
    updateWatchlistItem = vi.fn<(portfolioId: string, assetId: string, updates: Partial<AddWatchlistInput>) => Promise<WatchlistItem | null>>();
    removeFromWatchlist = vi.fn<(portfolioId: string, assetId: string) => Promise<boolean>>();
    createThesis = vi.fn<(input: CreateThesisInput) => Promise<InvestmentThesis>>();
    getTheses = vi.fn<(portfolioId: string) => Promise<InvestmentThesis[]>>();
    getThesis = vi.fn<(portfolioId: string, assetId: string) => Promise<InvestmentThesis | null>>();
    updateThesis = vi.fn<(portfolioId: string, assetId: string, updates: Partial<Omit<InvestmentThesis, 'id' | 'portfolio_id' | 'asset_id' | 'created_at' | 'updated_at'>>) => Promise<InvestmentThesis | null>>();
    deleteThesis = vi.fn<(portfolioId: string, assetId: string) => Promise<boolean>>();
    analyzeWhatIfBuy = vi.fn<(portfolioId: string, assetId: string, quantity: number, price: number, currentPrices: Record<string, number>) => Promise<any>>();
    analyzeWhatIfSell = vi.fn<(portfolioId: string, assetId: string, price: number, currentPrices: Record<string, number>) => Promise<any>>();
}

// Mock AssetService
export class MockAssetService implements Partial<AssetService> {
  createAsset = vi.fn();
  findAssetById = vi.fn();
  findAssets = vi.fn();
}

/**
 * Create a mock handler context for testing
 */
export function createMockContext(overrides: {
    portfolioService?: Partial<PortfolioService>;
    learningService?: Partial<LearningService>;
    assetService?: Partial<AssetService>;
} = {}) {
    return {
        portfolioService: (overrides.portfolioService || new MockPortfolioService()) as PortfolioService,
        learningService: (overrides.learningService || new MockLearningService()) as LearningService,
        assetService: (overrides.assetService || new MockAssetService()) as AssetService,
    };
}

