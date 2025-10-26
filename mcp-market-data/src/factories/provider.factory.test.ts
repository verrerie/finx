import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createProviders } from './provider.factory.js';

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
    });
});

