import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createProviders, createRateLimiters } from './provider.factory.js';

// Mock providers to test error handling paths
vi.mock('../providers/alpha-vantage.js', async () => {
    const actual = await vi.importActual('../providers/alpha-vantage.js') as any;
    class MockAlphaVantageProvider extends actual.AlphaVantageProvider {
        constructor(apiKey?: string) {
            if (apiKey === 'error-key') {
                throw new Error('Failed to initialize Alpha Vantage');
            }
            super(apiKey);
        }
    }
    return {
        ...actual,
        AlphaVantageProvider: MockAlphaVantageProvider,
    };
});

vi.mock('../providers/financial-modeling-prep.js', async () => {
    const actual = await vi.importActual('../providers/financial-modeling-prep.js') as any;
    class MockFinancialModelingPrepProvider extends actual.FinancialModelingPrepProvider {
        constructor(apiKey?: string) {
            if (apiKey === 'error-key') {
                throw new Error('Failed to initialize Financial Modeling Prep');
            }
            super(apiKey);
        }
    }
    return {
        ...actual,
        FinancialModelingPrepProvider: MockFinancialModelingPrepProvider,
    };
});

vi.mock('../providers/fred.js', async () => {
    const actual = await vi.importActual('../providers/fred.js') as any;
    class MockFREDProvider extends actual.FREDProvider {
        constructor(apiKey?: string) {
            if (apiKey === 'error-key') {
                throw new Error('Failed to initialize FRED');
            }
            super(apiKey);
        }
    }
    return {
        ...actual,
        FREDProvider: MockFREDProvider,
    };
});

describe('Provider Factory', () => {
    let consoleErrorSpy: any;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    describe('createProviders', () => {
        it('should create fallback provider (Yahoo Finance)', () => {
            const config = createProviders();

            expect(config.fallback).toBeDefined();
            expect(config.fallback.name).toBe('Yahoo Finance');
        });

        it('should not create primary provider without API key', () => {
            const config = createProviders();

            expect(config.primary).toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Alpha Vantage API key not set')
            );
        });

        it('should not create primary provider with empty API key', () => {
            const config = createProviders('');

            expect(config.primary).toBeNull();
        });

        it('should create primary provider with valid API key', () => {
            const config = createProviders('test-api-key');

            expect(config.primary).toBeDefined();
            expect(config.primary?.name).toBe('Alpha Vantage');
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Primary provider: Alpha Vantage')
            );
        });

        it('should log fallback provider', () => {
            createProviders();

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Fallback provider: Yahoo Finance')
            );
        });

        it('should return both providers when API key is provided', () => {
            const config = createProviders('test-api-key');

            expect(config.primary).toBeDefined();
            expect(config.fallback).toBeDefined();
            expect(config.primary?.name).toBe('Alpha Vantage');
            expect(config.fallback.name).toBe('Yahoo Finance');
        });

        it('should have fallback provider implement IMarketDataProvider', () => {
            const config = createProviders();

            expect(config.fallback).toHaveProperty('name');
            expect(config.fallback).toHaveProperty('getQuote');
            expect(config.fallback).toHaveProperty('getCompanyInfo');
            expect(typeof config.fallback.getQuote).toBe('function');
            expect(typeof config.fallback.getCompanyInfo).toBe('function');
        });

        it('should have primary provider implement IMarketDataProvider when created', () => {
            const config = createProviders('test-api-key');

            expect(config.primary).toHaveProperty('name');
            expect(config.primary).toHaveProperty('getQuote');
            expect(config.primary).toHaveProperty('getCompanyInfo');
            expect(typeof config.primary?.getQuote).toBe('function');
            expect(typeof config.primary?.getCompanyInfo).toBe('function');
        });

        it('should handle Financial Modeling Prep provider creation', () => {
            const config = createProviders(undefined, 'test-fmp-key');

            expect(config.financialModelingPrep).toBeDefined();
            expect(config.financialModelingPrep?.name).toBe('Financial Modeling Prep');
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Financial Modeling Prep provider: Financial Modeling Prep')
            );
        });

        it('should handle FRED provider creation', () => {
            const config = createProviders(undefined, undefined, 'test-fred-key');

            expect(config.fred).toBeDefined();
            expect(config.fred?.name).toBe('FRED');
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('FRED provider: FRED')
            );
        });

        it('should handle provider initialization errors gracefully', () => {
            // Mock provider constructors to throw errors
            const originalError = console.error;
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            // This will test the error handling paths
            const config = createProviders('invalid-key', 'invalid-fmp-key', 'invalid-fred-key');

            // Should still have fallback provider
            expect(config.fallback).toBeDefined();
            expect(config.fallback.name).toBe('Yahoo Finance');

            errorSpy.mockRestore();
        });

        it('should handle Alpha Vantage provider initialization error', () => {
            const config = createProviders('error-key');

            expect(config.primary).toBeNull();
            expect(config.fallback).toBeDefined();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Failed to initialize Alpha Vantage'),
                expect.any(Error)
            );
        });

        it('should handle Financial Modeling Prep provider initialization error', () => {
            const config = createProviders(undefined, 'error-key');

            expect(config.financialModelingPrep).toBeNull();
            expect(config.fallback).toBeDefined();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Failed to initialize Financial Modeling Prep'),
                expect.any(Error)
            );
        });

        it('should handle FRED provider initialization error', () => {
            const config = createProviders(undefined, undefined, 'error-key');

            expect(config.fred).toBeNull();
            expect(config.fallback).toBeDefined();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Failed to initialize FRED'),
                expect.any(Error)
            );
        });
    });

    describe('createRateLimiters', () => {
        it('should create rate limiters for providers with API keys', () => {
            const rateLimiters = createRateLimiters('test-av-key', 'test-fmp-key', 'test-fred-key');

            expect(rateLimiters.primary).toBeDefined();
            expect(rateLimiters.financialModelingPrep).toBeDefined();
            expect(rateLimiters.fred).toBeDefined();
        });

        it('should return null rate limiters for providers without API keys', () => {
            const rateLimiters = createRateLimiters();

            expect(rateLimiters.primary).toBeNull();
            expect(rateLimiters.financialModelingPrep).toBeNull();
            expect(rateLimiters.fred).toBeNull();
        });

        it('should create rate limiter only for primary provider', () => {
            const rateLimiters = createRateLimiters('test-av-key');

            expect(rateLimiters.primary).toBeDefined();
            expect(rateLimiters.financialModelingPrep).toBeNull();
            expect(rateLimiters.fred).toBeNull();
        });

        it('should create rate limiter only for Financial Modeling Prep provider', () => {
            const rateLimiters = createRateLimiters(undefined, 'test-fmp-key');

            expect(rateLimiters.primary).toBeNull();
            expect(rateLimiters.financialModelingPrep).toBeDefined();
            expect(rateLimiters.fred).toBeNull();
        });

        it('should create rate limiter only for FRED provider', () => {
            const rateLimiters = createRateLimiters(undefined, undefined, 'test-fred-key');

            expect(rateLimiters.primary).toBeNull();
            expect(rateLimiters.financialModelingPrep).toBeNull();
            expect(rateLimiters.fred).toBeDefined();
        });
    });
});

