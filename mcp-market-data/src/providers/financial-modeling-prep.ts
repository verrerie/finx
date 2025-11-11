/**
 * Financial Modeling Prep market data provider
 * 
 * Free tier: 250 calls/day
 * API base: https://financialmodelingprep.com/api/v3
 * Authentication: API key in query parameter (apikey)
 */

import axios from 'axios';
import { IMarketDataProvider } from '../interfaces/market-data-provider.interface.js';
import { CompanyInfo, FinancialStatement, StatementType, StockQuote } from '../types.js';
import { config } from '../config.js';

export class FinancialModelingPrepProvider implements IMarketDataProvider {
    readonly name = 'Financial Modeling Prep';
    private apiKey: string;
    private baseUrl = 'https://financialmodelingprep.com/api/v3';
    private stableBaseUrl = 'https://financialmodelingprep.com/stable';

    constructor(apiKey?: string) {
        const key = apiKey || config.ENV.FMP_API_KEY;
        if (!key) {
            throw new Error('Financial Modeling Prep API key is required');
        }
        this.apiKey = key;
    }

    async getQuote(symbol: string): Promise<StockQuote> {
        try {
            const response = await axios.get(`${this.baseUrl}/quote/${symbol}`, {
                params: { apikey: this.apiKey },
            });
            const data = response.data;

            if (!data || !Array.isArray(data) || data.length === 0) {
                throw new Error(`No quote data available for ${symbol}`);
            }

            const quote = data[0];

            return {
                symbol: quote.symbol || symbol,
                price: quote.price || 0,
                change: quote.change || 0,
                changePercent: quote.changesPercentage ? parseFloat(quote.changesPercentage) : 0,
                volume: quote.volume || 0,
                marketCap: quote.marketCap,
                peRatio: quote.pe,
                weekHigh52: quote.yearHigh,
                weekLow52: quote.yearLow,
                timestamp: new Date(quote.timestamp || Date.now()),
            };
        } catch (error) {
            throw new Error(`Financial Modeling Prep quote error for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getCompanyInfo(symbol: string): Promise<CompanyInfo> {
        try {
            // Use stable profile endpoint for comprehensive company data
            const [profile, keyMetrics] = await Promise.all([
                axios.get(`${this.stableBaseUrl}/profile/${symbol}`, {
                    params: { apikey: this.apiKey },
                }).catch(() => null),
                axios.get(`${this.baseUrl}/key-metrics-ttm/${symbol}`, {
                    params: { apikey: this.apiKey },
                }).catch(() => null),
            ]);

            const profileData = profile?.data;
            const metricsData = keyMetrics?.data;

            if (!profileData || !Array.isArray(profileData) || profileData.length === 0) {
                throw new Error(`No company data available for ${symbol}`);
            }

            const company = profileData[0];
            const metrics = metricsData && Array.isArray(metricsData) && metricsData.length > 0 ? metricsData[0] : null;

            return {
                symbol: company.symbol || symbol,
                name: company.companyName || 'N/A',
                description: company.description || 'No description available',
                sector: company.sector || 'N/A',
                industry: company.industry || 'N/A',
                marketCap: company.mktCap || company.marketCap || 0,

                // Valuation
                peRatio: metrics?.peRatioTTM || company.peRatioTTM || company.peRatio,
                pbRatio: metrics?.pbRatioTTM || company.pbRatio,
                dividendYield: company.lastDiv || metrics?.dividendYieldTTM || company.dividendYield,
                eps: metrics?.netIncomePerShareTTM || company.eps,
                beta: company.beta,

                // Profitability
                profitMargin: metrics?.netProfitMarginTTM || company.profitMargin,
                operatingMargin: metrics?.operatingProfitMarginTTM || company.operatingMargin,
                returnOnEquity: metrics?.roeTTM || company.returnOnEquity,
                returnOnAssets: metrics?.roaTTM || company.returnOnAssets,

                // Financial health
                debtToEquity: metrics?.debtToEquityTTM || company.debtToEquity,
                currentRatio: metrics?.currentRatioTTM || company.currentRatio,

                // Growth
                revenueGrowth: metrics?.revenueGrowthTTM || company.revenueGrowth,
                earningsGrowth: metrics?.earningsGrowthTTM || company.earningsGrowth,

                // Other
                revenue: metrics?.revenuePerShareTTM ? metrics.revenuePerShareTTM * (metrics.sharesOutstandingTTM || 0) : company.revenue,
                grossProfit: metrics?.grossProfitTTM || company.grossProfit,
                weekHigh52: company.range?.split('-')?.[1] ? parseFloat(company.range.split('-')[1]) : company.weekHigh52 || company.yearHigh,
                weekLow52: company.range?.split('-')?.[0] ? parseFloat(company.range.split('-')[0]) : company.weekLow52 || company.yearLow,

                // Company profile details from stable profile API
                ceo: company.ceo,
                address: company.address,
                city: company.city,
                state: company.state,
                zip: company.zip,
                country: company.country,
                phone: company.phone,
                website: company.website,
                exchange: company.exchange,
                exchangeShortName: company.exchangeShortName,
                ipoDate: company.ipoDate,
                currency: company.currency,
                fullTimeEmployees: company.fullTimeEmployees,
                image: company.image,
                isin: company.isin,
                cusip: company.cusip,
                cik: company.cik,

                lastUpdated: new Date(),
            };
        } catch (error) {
            throw new Error(`Financial Modeling Prep company info error for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getFinancialStatements(symbol: string, statementType: StatementType, period: 'annual' | 'quarter' = 'annual'): Promise<FinancialStatement[]> {
        try {
            let endpoint = '';
            switch (statementType) {
                case StatementType.INCOME:
                    endpoint = period === 'annual' ? 'income-statement' : 'income-statement';
                    break;
                case StatementType.BALANCE:
                    endpoint = period === 'annual' ? 'balance-sheet-statement' : 'balance-sheet-statement';
                    break;
                case StatementType.CASHFLOW:
                    endpoint = period === 'annual' ? 'cash-flow-statement' : 'cash-flow-statement';
                    break;
            }

            const response = await axios.get(`${this.baseUrl}/${endpoint}/${symbol}`, {
                params: {
                    apikey: this.apiKey,
                    period: period === 'annual' ? 'annual' : 'quarter',
                    limit: 120, // Get up to 120 periods
                },
            });
            const data = response.data;

            if (!data || !Array.isArray(data)) {
                throw new Error(`No financial statement data available for ${symbol}`);
            }

            return data.map((statement: any) => {
                switch (statementType) {
                    case StatementType.INCOME:
                        return this.transformIncomeStatement(statement, symbol, period);
                    case StatementType.BALANCE:
                        return this.transformBalanceSheet(statement, symbol, period);
                    case StatementType.CASHFLOW:
                        return this.transformCashFlowStatement(statement, symbol, period);
                }
            });
        } catch (error) {
            throw new Error(`Financial Modeling Prep financial statements error for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private transformIncomeStatement(data: any, symbol: string, period: 'annual' | 'quarter'): FinancialStatement {
        return {
            symbol,
            period,
            date: data.date || data.calendarYear || '',
            revenue: data.revenue || 0,
            costOfRevenue: data.costOfRevenue || data.costOfGoodsSold || 0,
            grossProfit: data.grossProfit || 0,
            operatingExpenses: data.operatingExpenses || data.operatingCosts || 0,
            operatingIncome: data.operatingIncome || 0,
            interestExpense: data.interestExpense,
            incomeBeforeTax: data.incomeBeforeTax || data.incomeBeforeTax || 0,
            incomeTaxExpense: data.incomeTaxExpense,
            netIncome: data.netIncome || 0,
            eps: data.eps || data.epsDiluted,
            sharesOutstanding: data.weightedAverageShsOut || data.weightedAverageShsOutDil,
        };
    }

    private transformBalanceSheet(data: any, symbol: string, period: 'annual' | 'quarter'): FinancialStatement {
        return {
            symbol,
            period,
            date: data.date || data.calendarYear || '',
            cashAndCashEquivalents: data.cashAndCashEquivalents || data.cashAndShortTermInvestments || 0,
            shortTermInvestments: data.shortTermInvestments,
            totalCurrentAssets: data.totalCurrentAssets || 0,
            propertyPlantEquipment: data.propertyPlantEquipmentNet || data.propertyPlantAndEquipmentNet || data.netPPE,
            longTermInvestments: data.longTermInvestments,
            totalAssets: data.totalAssets || 0,
            accountsPayable: data.accountPayables,
            shortTermDebt: data.shortTermDebt || data.shortTermDebt || 0,
            totalCurrentLiabilities: data.totalCurrentLiabilities || 0,
            longTermDebt: data.longTermDebt || 0,
            totalLiabilities: data.totalLiabilities || 0,
            commonStock: data.commonStock,
            retainedEarnings: data.retainedEarnings,
            totalStockholdersEquity: data.totalStockholdersEquity || data.totalEquity || 0,
            totalLiabilitiesAndEquity: data.totalLiabilitiesAndEquity || data.totalAssets || 0,
        };
    }

    private transformCashFlowStatement(data: any, symbol: string, period: 'annual' | 'quarter'): FinancialStatement {
        return {
            symbol,
            period,
            date: data.date || data.calendarYear || '',
            netIncome: data.netIncome || 0,
            depreciationAndAmortization: data.depreciationAndAmortization,
            operatingCashFlow: data.operatingCashFlow || data.netCashProvidedByOperatingActivities || 0,
            capitalExpenditures: data.capitalExpenditure || data.capitalExpenditure || 0,
            investingCashFlow: data.netCashUsedForInvestingActivites || data.netCashUsedInInvestingActivities || 0,
            dividendsPaid: data.dividendsPaid,
            financingCashFlow: data.netCashUsedProvidedByFinancingActivities || data.netCashUsedInFinancingActivities || 0,
            freeCashFlow: data.freeCashFlow,
            netChangeInCash: data.netChangeInCash || data.netChangeInCashAndCashEquivalents || 0,
        };
    }
}

