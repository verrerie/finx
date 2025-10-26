import { describe, expect, it } from 'vitest';
import {
    findSectorFromSymbol,
    formatMetricExplanation,
    getMetricExplanation,
    getPeersBySector,
    listAvailableMetrics,
    listAvailableSectors,
} from './educational.js';

describe('Educational Functions', () => {
    describe('getMetricExplanation', () => {
        it('should return explanation for valid metric', () => {
            const explanation = getMetricExplanation('pe_ratio');
            expect(explanation).toBeDefined();
            expect(explanation?.name).toBe('P/E Ratio (Price-to-Earnings)');
        });

        it('should handle different formats (underscores, spaces, hyphens)', () => {
            const withUnderscore = getMetricExplanation('pe_ratio');
            const withSpace = getMetricExplanation('pe ratio');
            const withHyphen = getMetricExplanation('pe-ratio');

            expect(withUnderscore).toEqual(withSpace);
            expect(withSpace).toEqual(withHyphen);
        });

        it('should be case insensitive', () => {
            const lowercase = getMetricExplanation('pe_ratio');
            const uppercase = getMetricExplanation('PE_RATIO');
            const mixed = getMetricExplanation('Pe_RaTiO');

            expect(lowercase).toEqual(uppercase);
            expect(uppercase).toEqual(mixed);
        });

        it('should return null for invalid metric', () => {
            const explanation = getMetricExplanation('invalid_metric');
            expect(explanation).toBeNull();
        });

        it('should have all required fields', () => {
            const explanation = getMetricExplanation('roe');
            expect(explanation).toBeDefined();
            expect(explanation).toHaveProperty('name');
            expect(explanation).toHaveProperty('definition');
            expect(explanation).toHaveProperty('whatItMeans');
            expect(explanation).toHaveProperty('howToInterpret');
            expect(explanation).toHaveProperty('goodVsBad');
            expect(explanation).toHaveProperty('example');
            expect(explanation).toHaveProperty('relatedMetrics');
            expect(explanation).toHaveProperty('furtherReading');
        });
    });

    describe('listAvailableMetrics', () => {
        it('should return array of metric names', () => {
            const metrics = listAvailableMetrics();
            expect(Array.isArray(metrics)).toBe(true);
            expect(metrics.length).toBeGreaterThan(0);
        });

        it('should include common metrics', () => {
            const metrics = listAvailableMetrics();
            expect(metrics).toContain('P/E Ratio (Price-to-Earnings)');
            expect(metrics).toContain('ROE (Return on Equity)');
            expect(metrics).toContain('Market Capitalization');
        });
    });

    describe('formatMetricExplanation', () => {
        it('should format explanation without symbol', () => {
            const explanation = getMetricExplanation('pe_ratio');
            const formatted = formatMetricExplanation(explanation!);

            expect(formatted).toContain('# P/E Ratio (Price-to-Earnings)');
            expect(formatted).toContain('## Definition');
            expect(formatted).toContain('## What It Means');
            expect(formatted).toContain('## How to Interpret');
            expect(formatted).toContain('## Good vs Bad');
            expect(formatted).toContain('## Example');
            expect(formatted).toContain('## Related Metrics to Explore');
            expect(formatted).toContain('## Next Steps');
        });

        it('should include symbol in title when provided', () => {
            const explanation = getMetricExplanation('pe_ratio');
            const formatted = formatMetricExplanation(explanation!, 'AAPL');

            expect(formatted).toContain('# P/E Ratio (Price-to-Earnings) for AAPL');
        });

        it('should include disclaimer at the end', () => {
            const explanation = getMetricExplanation('roe');
            const formatted = formatMetricExplanation(explanation!);

            expect(formatted).toContain('This is educational information, not financial advice');
        });
    });

    describe('getPeersBySector', () => {
        it('should return peers for Technology sector', () => {
            const peers = getPeersBySector('Technology');
            expect(Array.isArray(peers)).toBe(true);
            expect(peers.length).toBeGreaterThan(0);
            expect(peers).toContain('AAPL');
            expect(peers).toContain('MSFT');
        });

        it('should return peers for Financial Services sector', () => {
            const peers = getPeersBySector('Financial Services');
            expect(Array.isArray(peers)).toBe(true);
            expect(peers).toContain('JPM');
            expect(peers).toContain('BAC');
        });

        it('should return empty array for invalid sector', () => {
            const peers = getPeersBySector('Invalid Sector');
            expect(peers).toEqual([]);
        });

        it('should be case sensitive', () => {
            const peers = getPeersBySector('technology'); // lowercase
            expect(peers).toEqual([]);
        });
    });

    describe('findSectorFromSymbol', () => {
        it('should find Technology sector for AAPL', () => {
            const sector = findSectorFromSymbol('AAPL');
            expect(sector).toBe('Technology');
        });

        it('should find Financial Services sector for JPM', () => {
            const sector = findSectorFromSymbol('JPM');
            expect(sector).toBe('Financial Services');
        });

        it('should return null for unknown symbol', () => {
            const sector = findSectorFromSymbol('UNKNOWN');
            expect(sector).toBeNull();
        });

        it('should be case insensitive', () => {
            const upper = findSectorFromSymbol('AAPL');
            const lower = findSectorFromSymbol('aapl');
            expect(upper).toBe(lower);
        });
    });

    describe('listAvailableSectors', () => {
        it('should return array of sector names', () => {
            const sectors = listAvailableSectors();
            expect(Array.isArray(sectors)).toBe(true);
            expect(sectors.length).toBeGreaterThan(0);
        });

        it('should include common sectors', () => {
            const sectors = listAvailableSectors();
            expect(sectors).toContain('Technology');
            expect(sectors).toContain('Financial Services');
            expect(sectors).toContain('Healthcare');
            expect(sectors).toContain('Energy');
        });

        it('should return unique sectors', () => {
            const sectors = listAvailableSectors();
            const uniqueSectors = [...new Set(sectors)];
            expect(sectors.length).toBe(uniqueSectors.length);
        });
    });
});

