/**
 * Factory for creating market data providers
 * 
 * Implements Dependency Inversion Principle (DIP) by abstracting provider creation
 */

import { IMarketDataProvider } from '../interfaces/market-data-provider.interface.js';
import { AlphaVantageProvider } from '../providers/alpha-vantage.js';
import { FinancialModelingPrepProvider } from '../providers/financial-modeling-prep.js';
import { FREDProvider } from '../providers/fred.js';
import { YahooFinanceProvider } from '../providers/yahoo-finance.js';

export interface ProviderConfig {
    primary: IMarketDataProvider | null;
    financialModelingPrep: IMarketDataProvider | null;
    fred: IMarketDataProvider | null;
    fallback: IMarketDataProvider;
}

/**
 * Create and configure market data providers based on available API keys
 * 
 * @param alphaVantageApiKey - Optional Alpha Vantage API key
 * @param fmpApiKey - Optional Financial Modeling Prep API key
 * @param fredApiKey - Optional FRED API key
 * @returns Configuration with primary, Financial Modeling Prep, FRED, and fallback providers
 */
export function createProviders(alphaVantageApiKey?: string, fmpApiKey?: string, fredApiKey?: string): ProviderConfig {
    const fallback = new YahooFinanceProvider();

    let primary: IMarketDataProvider | null = null;
    let financialModelingPrep: IMarketDataProvider | null = null;
    let fred: IMarketDataProvider | null = null;

    if (alphaVantageApiKey) {
        try {
            primary = new AlphaVantageProvider(alphaVantageApiKey);
            console.error(`✓ Primary provider: ${primary.name}`);
        } catch (error) {
            console.error(`✗ Failed to initialize Alpha Vantage:`, error);
        }
    } else {
        console.error('ℹ Alpha Vantage API key not set');
    }

    if (fmpApiKey) {
        try {
            financialModelingPrep = new FinancialModelingPrepProvider(fmpApiKey);
            console.error(`✓ Financial Modeling Prep provider: ${financialModelingPrep.name}`);
        } catch (error) {
            console.error(`✗ Failed to initialize Financial Modeling Prep:`, error);
        }
    } else {
        console.error('ℹ Financial Modeling Prep API key not set');
    }

    if (fredApiKey) {
        try {
            fred = new FREDProvider(fredApiKey);
            console.error(`✓ FRED provider: ${fred.name}`);
        } catch (error) {
            console.error(`✗ Failed to initialize FRED:`, error);
        }
    } else {
        console.error('ℹ FRED API key not set');
    }

    console.error(`✓ Fallback provider: ${fallback.name}`);

    return { primary, financialModelingPrep, fred, fallback };
}

