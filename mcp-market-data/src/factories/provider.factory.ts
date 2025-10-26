/**
 * Factory for creating market data providers
 * 
 * Implements Dependency Inversion Principle (DIP) by abstracting provider creation
 */

import { IMarketDataProvider } from '../interfaces/market-data-provider.interface.js';
import { AlphaVantageProvider } from '../providers/alpha-vantage.js';
import { YahooFinanceProvider } from '../providers/yahoo-finance.js';

export interface ProviderConfig {
    primary: IMarketDataProvider | null;
    fallback: IMarketDataProvider;
}

/**
 * Create and configure market data providers based on available API keys
 * 
 * @param alphaVantageApiKey - Optional Alpha Vantage API key
 * @returns Configuration with primary and fallback providers
 */
export function createProviders(alphaVantageApiKey?: string): ProviderConfig {
    const fallback = new YahooFinanceProvider();
    
    let primary: IMarketDataProvider | null = null;
    
    if (alphaVantageApiKey) {
        try {
            primary = new AlphaVantageProvider(alphaVantageApiKey);
            console.error(`✓ Primary provider: ${primary.name}`);
        } catch (error) {
            console.error(`✗ Failed to initialize Alpha Vantage:`, error);
        }
    } else {
        console.error('ℹ Alpha Vantage API key not set, using Yahoo Finance only');
    }
    
    console.error(`✓ Fallback provider: ${fallback.name}`);
    
    return { primary, fallback };
}

