/**
 * MCP Tool Definitions
 * 
 * Centralized tool schemas for the Market Data MCP Server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const TOOL_DEFINITIONS: Tool[] = [
    {
        name: 'get_quote',
        description: 'Get current stock quote with price, change, volume, and basic metrics. Returns real-time market data for a given ticker symbol.',
        inputSchema: {
            type: 'object',
            properties: {
                symbol: {
                    type: 'string',
                    description: 'Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)',
                },
            },
            required: ['symbol'],
        },
    },
    {
        name: 'get_historical_data',
        description: 'Get historical price data for a stock over a specified period. Useful for analyzing price trends and patterns.',
        inputSchema: {
            type: 'object',
            properties: {
                symbol: {
                    type: 'string',
                    description: 'Stock ticker symbol (e.g., AAPL)',
                },
                period: {
                    type: 'string',
                    enum: ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', 'max'],
                    description: 'Time period for historical data',
                    default: '1y',
                },
            },
            required: ['symbol'],
        },
    },
    {
        name: 'search_symbol',
        description: 'Search for stock ticker symbols by company name or partial symbol. Helps find the correct ticker for a company.',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Company name or partial ticker symbol to search for',
                },
            },
            required: ['query'],
        },
    },
    {
        name: 'get_company_info',
        description: 'Get comprehensive company fundamentals including financial metrics, ratios, sector info, and business description. Essential for fundamental analysis.',
        inputSchema: {
            type: 'object',
            properties: {
                symbol: {
                    type: 'string',
                    description: 'Stock ticker symbol (e.g., AAPL)',
                },
            },
            required: ['symbol'],
        },
    },
    {
        name: 'explain_fundamental',
        description: 'Get an educational explanation of a specific financial metric or fundamental concept. Includes definition, interpretation guide, examples, and related metrics. Perfect for learning while analyzing stocks.',
        inputSchema: {
            type: 'object',
            properties: {
                metric: {
                    type: 'string',
                    description: 'The financial metric to explain (e.g., "pe_ratio", "roe", "debt_to_equity", "dividend_yield"). Use list_metrics to see all available explanations.',
                },
                symbol: {
                    type: 'string',
                    description: 'Optional: Stock ticker symbol to provide context-specific examples',
                },
            },
            required: ['metric'],
        },
    },
    {
        name: 'compare_peers',
        description: 'Compare a stock against peer companies in the same sector. Learn by seeing how metrics differ across similar businesses. Returns side-by-side comparison of key fundamentals.',
        inputSchema: {
            type: 'object',
            properties: {
                symbol: {
                    type: 'string',
                    description: 'Stock ticker symbol to compare (e.g., AAPL)',
                },
                sector: {
                    type: 'string',
                    description: 'Optional: Sector to compare against (e.g., "Technology", "Financial Services"). If not provided, will auto-detect from symbol.',
                },
                metrics: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    description: 'Optional: Specific metrics to compare (default: pe_ratio, market_cap, revenue, profit_margin)',
                },
            },
            required: ['symbol'],
        },
    },
];

