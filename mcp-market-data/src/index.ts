#!/usr/bin/env node

/**
 * Market Data MCP Server
 * 
 * Provides real-time and historical market data with educational explanations.
 * Core tools: get_quote, get_historical_data, search_symbol, get_company_info
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { Cache } from './cache.js';
import { AlphaVantageProvider } from './providers/alpha-vantage.js';
import { YahooFinanceProvider } from './providers/yahoo-finance.js';
import { RateLimiter } from './rate-limiter.js';
import { Period } from './types.js';

// Environment configuration
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || '';
const CACHE_TTL_QUOTE = 5 * 60 * 1000; // 5 minutes
const CACHE_TTL_COMPANY = 24 * 60 * 60 * 1000; // 24 hours

// Initialize providers and utilities
const cache = new Cache();
const rateLimiter = new RateLimiter(5, 25); // 5/minute, 25/day for Alpha Vantage

let alphaVantage: AlphaVantageProvider | null = null;
const yahooFinance = new YahooFinanceProvider();

if (ALPHA_VANTAGE_API_KEY) {
    try {
        alphaVantage = new AlphaVantageProvider(ALPHA_VANTAGE_API_KEY);
    } catch (error) {
        console.error('Failed to initialize Alpha Vantage:', error);
    }
}

// Define MCP tools
const tools: Tool[] = [
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
];

// Create MCP server
const server = new Server(
    {
        name: 'finx-market-data',
        version: '0.1.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'get_quote': {
                const { symbol } = args as { symbol: string };
                const upperSymbol = symbol.toUpperCase();

                // Check cache first
                const cached = cache.get(`quote:${upperSymbol}`);
                if (cached) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(cached, null, 2) + '\n\n(Cached data)',
                            },
                        ],
                    };
                }

                // Try Alpha Vantage first (with rate limiting)
                if (alphaVantage) {
                    try {
                        const quote = await rateLimiter.execute(() =>
                            alphaVantage!.getQuote(upperSymbol)
                        );
                        cache.set(`quote:${upperSymbol}`, quote, CACHE_TTL_QUOTE);

                        const stats = rateLimiter.getStats();
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(quote, null, 2) +
                                        `\n\n(Source: Alpha Vantage | API calls: ${stats.callsLastDay}/25 today, ${stats.callsLastMinute}/5 this minute)`,
                                },
                            ],
                        };
                    } catch (error) {
                        console.error('Alpha Vantage failed, falling back to Yahoo Finance:', error);
                    }
                }

                // Fallback to Yahoo Finance
                const quote = await yahooFinance.getQuote(upperSymbol);
                cache.set(`quote:${upperSymbol}`, quote, CACHE_TTL_QUOTE);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(quote, null, 2) + '\n\n(Source: Yahoo Finance)',
                        },
                    ],
                };
            }

            case 'get_historical_data': {
                const { symbol, period = '1y' } = args as { symbol: string; period?: Period };
                const upperSymbol = symbol.toUpperCase();

                // Yahoo Finance is better for historical data
                const data = await yahooFinance.getHistoricalData(upperSymbol, period);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(data, null, 2) +
                                `\n\n(${data.length} data points over ${period})`,
                        },
                    ],
                };
            }

            case 'search_symbol': {
                const { query } = args as { query: string };

                // Alpha Vantage has better symbol search
                if (alphaVantage) {
                    try {
                        const results = await rateLimiter.execute(() =>
                            alphaVantage!.searchSymbol(query)
                        );

                        const stats = rateLimiter.getStats();
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(results, null, 2) +
                                        `\n\n(Found ${results.length} matches | API calls: ${stats.callsLastDay}/25 today)`,
                                },
                            ],
                        };
                    } catch (error) {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nTip: Try using the exact ticker symbol with get_quote instead.`,
                                },
                            ],
                        };
                    }
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Symbol search requires Alpha Vantage API key. Please set ALPHA_VANTAGE_API_KEY environment variable.\n\nTip: You can find ticker symbols at https://finance.yahoo.com',
                        },
                    ],
                };
            }

            case 'get_company_info': {
                const { symbol } = args as { symbol: string };
                const upperSymbol = symbol.toUpperCase();

                // Check cache first
                const cached = cache.get(`company:${upperSymbol}`);
                if (cached) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(cached, null, 2) + '\n\n(Cached data)',
                            },
                        ],
                    };
                }

                // Try Alpha Vantage first (richer fundamental data)
                if (alphaVantage) {
                    try {
                        const info = await rateLimiter.execute(() =>
                            alphaVantage!.getCompanyInfo(upperSymbol)
                        );
                        cache.set(`company:${upperSymbol}`, info, CACHE_TTL_COMPANY);

                        const stats = rateLimiter.getStats();
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(info, null, 2) +
                                        `\n\n(Source: Alpha Vantage | API calls: ${stats.callsLastDay}/25 today)`,
                                },
                            ],
                        };
                    } catch (error) {
                        console.error('Alpha Vantage failed, falling back to Yahoo Finance:', error);
                    }
                }

                // Fallback to Yahoo Finance
                const info = await yahooFinance.getCompanyInfo(upperSymbol);
                cache.set(`company:${upperSymbol}`, info, CACHE_TTL_COMPANY);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(info, null, 2) + '\n\n(Source: Yahoo Finance)',
                        },
                    ],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
            isError: true,
        };
    }
});

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('FinX Market Data MCP Server running');
    console.error(`Alpha Vantage: ${alphaVantage ? 'enabled' : 'disabled (API key not set)'}`);
    console.error('Yahoo Finance: enabled (fallback)');
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});

