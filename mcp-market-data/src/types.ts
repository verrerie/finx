/**
 * Type definitions for Market Data MCP Server
 */

export interface StockQuote {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: number;
    peRatio?: number;
    weekHigh52?: number;
    weekLow52?: number;
    timestamp: Date;
}

export interface HistoricalDataPoint {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface SymbolSearchResult {
    symbol: string;
    name: string;
    exchange: string;
    type: string;
}

export interface CompanyInfo {
    symbol: string;
    name: string;
    description: string;
    sector: string;
    industry: string;
    marketCap: number;

    // Financial metrics
    peRatio?: number;
    pbRatio?: number;
    dividendYield?: number;
    eps?: number;
    beta?: number;

    // Profitability
    profitMargin?: number;
    operatingMargin?: number;
    returnOnEquity?: number;
    returnOnAssets?: number;

    // Financial health
    debtToEquity?: number;
    currentRatio?: number;

    // Growth
    revenueGrowth?: number;
    earningsGrowth?: number;

    // Other
    revenue?: number;
    grossProfit?: number;
    weekHigh52?: number;
    weekLow52?: number;

    lastUpdated: Date;
}

export interface NewsArticle {
    title: string;
    url: string;
    source: string;
    summary: string;
    timePublished: Date;
    authors: string[];
    topics: { topic: string; relevanceScore: string }[];
    overallSentimentScore: number;
    overallSentimentLabel: string;
}

export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

export type Period = '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | 'max';

export enum StatementType {
    INCOME = 'income',
    BALANCE = 'balance',
    CASHFLOW = 'cashflow',
}

export interface IncomeStatement {
    symbol: string;
    period: 'annual' | 'quarter';
    date: string;
    revenue: number;
    costOfRevenue: number;
    grossProfit: number;
    operatingExpenses: number;
    operatingIncome: number;
    interestExpense?: number;
    incomeBeforeTax: number;
    incomeTaxExpense?: number;
    netIncome: number;
    eps?: number;
    sharesOutstanding?: number;
}

export interface BalanceSheet {
    symbol: string;
    period: 'annual' | 'quarter';
    date: string;
    cashAndCashEquivalents: number;
    shortTermInvestments?: number;
    totalCurrentAssets: number;
    propertyPlantEquipment?: number;
    longTermInvestments?: number;
    totalAssets: number;
    accountsPayable?: number;
    shortTermDebt?: number;
    totalCurrentLiabilities: number;
    longTermDebt?: number;
    totalLiabilities: number;
    commonStock?: number;
    retainedEarnings?: number;
    totalStockholdersEquity: number;
    totalLiabilitiesAndEquity: number;
}

export interface CashFlowStatement {
    symbol: string;
    period: 'annual' | 'quarter';
    date: string;
    netIncome: number;
    depreciationAndAmortization?: number;
    operatingCashFlow: number;
    capitalExpenditures?: number;
    investingCashFlow: number;
    dividendsPaid?: number;
    financingCashFlow: number;
    freeCashFlow?: number;
    netChangeInCash: number;
}

export type FinancialStatement = IncomeStatement | BalanceSheet | CashFlowStatement;

export interface EconomicIndicator {
    seriesId: string;
    title: string;
    units: string;
    frequency: string;
    data: EconomicDataPoint[];
    lastUpdated: Date;
}

export interface EconomicDataPoint {
    date: string;
    value: number;
}

// Common FRED series IDs
export const FRED_SERIES_IDS = {
    GDP: 'GDP', // Gross Domestic Product
    CPI: 'CPIAUCSL', // Consumer Price Index
    UNRATE: 'UNRATE', // Unemployment Rate
    FEDFUNDS: 'FEDFUNDS', // Federal Funds Rate
    DGS10: 'DGS10', // 10-Year Treasury Rate
    DEXUSEU: 'DEXUSEU', // U.S. / Euro Foreign Exchange Rate
    M1SL: 'M1SL', // M1 Money Supply
    M2SL: 'M2SL', // M2 Money Supply
} as const;

