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
import {
    findSectorFromSymbol,
    formatMetricExplanation,
    getMetricExplanation,
    getPeersBySector,
    listAvailableMetrics,
    listAvailableSectors
} from './educational.js';
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

            case 'explain_fundamental': {
                const { metric, symbol } = args as { metric: string; symbol?: string };

                const explanation = getMetricExplanation(metric);
                if (!explanation) {
                    const availableMetrics = listAvailableMetrics();
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Metric "${metric}" not found.\n\nAvailable metrics:\n${availableMetrics.map(m => `- ${m}`).join('\n')}\n\nUse any of these metric names (case-insensitive, underscores/spaces/hyphens are flexible).`,
                            },
                        ],
                    };
                }

                const formattedExplanation = formatMetricExplanation(explanation, symbol);

                // If symbol is provided, also try to fetch actual data for context
                let contextData = '';
                if (symbol) {
                    try {
                        const upperSymbol = symbol.toUpperCase();
                        const cached = cache.get(`company:${upperSymbol}`);
                        if (cached) {
                            contextData = `\n\n---\n## Current ${upperSymbol} Data Context\n\`\`\`json\n${JSON.stringify(cached, null, 2)}\n\`\`\`\n\nUse this data to practice interpreting the metric!`;
                        }
                    } catch (error) {
                        // Silently fail if we can't get context data
                    }
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: formattedExplanation + contextData,
                        },
                    ],
                };
            }

            case 'compare_peers': {
                const { symbol, sector, metrics } = args as {
                    symbol: string;
                    sector?: string;
                    metrics?: string[];
                };

                const upperSymbol = symbol.toUpperCase();

                // Determine sector
                let targetSector: string | undefined = sector;
                if (!targetSector) {
                    const detectedSector = findSectorFromSymbol(upperSymbol);
                    if (!detectedSector) {
                        const availableSectors = listAvailableSectors();
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Could not auto-detect sector for ${upperSymbol}. Please specify a sector:\n\n${availableSectors.map(s => `- ${s}`).join('\n')}`,
                                },
                            ],
                        };
                    }
                    targetSector = detectedSector;
                }

                // Get peer symbols
                const peers = getPeersBySector(targetSector);
                if (!peers || peers.length === 0) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `No peer data available for sector: ${targetSector}`,
                            },
                        ],
                    };
                }

                // Fetch data for target company and peers (limit to 5 peers for reasonable response size)
                const symbolsToCompare = [upperSymbol, ...peers.filter(p => p !== upperSymbol).slice(0, 5)];

                let comparisonText = `# Peer Comparison: ${upperSymbol}\n\n`;
                comparisonText += `**Sector:** ${targetSector}\n`;
                comparisonText += `**Comparing against:** ${symbolsToCompare.slice(1).join(', ')}\n\n`;
                comparisonText += `---\n\n`;

                // Fetch company info for each symbol
                const companyDataPromises = symbolsToCompare.map(async (sym) => {
                    try {
                        // Check cache first
                        const cached = cache.get(`company:${sym}`);
                        if (cached) {
                            return { symbol: sym, data: cached, source: 'cache' };
                        }

                        // Try Yahoo Finance for quick comparison
                        const info = await yahooFinance.getCompanyInfo(sym);
                        cache.set(`company:${sym}`, info, CACHE_TTL_COMPANY);
                        return { symbol: sym, data: info, source: 'Yahoo Finance' };
                    } catch (error) {
                        return { symbol: sym, data: null, error: String(error) };
                    }
                });

                const results = await Promise.all(companyDataPromises);

                // Build comparison table
                comparisonText += `## Key Metrics Comparison\n\n`;
                comparisonText += `| Company | Market Cap | P/E Ratio | Revenue Growth | Profit Margin |\n`;
                comparisonText += `|---------|------------|-----------|----------------|---------------|\n`;

                for (const result of results) {
                    if (result.data) {
                        const d: any = result.data;
                        const marketCap = d.marketCap ? `$${(d.marketCap / 1e9).toFixed(1)}B` : 'N/A';
                        const pe = d.trailingPE ? d.trailingPE.toFixed(1) : 'N/A';
                        const revenue = d.revenueGrowth ? `${(d.revenueGrowth * 100).toFixed(1)}%` : 'N/A';
                        const margin = d.profitMargin ? `${(d.profitMargin * 100).toFixed(1)}%` : 'N/A';

                        const highlight = result.symbol === upperSymbol ? '**' : '';
                        comparisonText += `| ${highlight}${result.symbol}${highlight} | ${marketCap} | ${pe} | ${revenue} | ${margin} |\n`;
                    } else {
                        comparisonText += `| ${result.symbol} | Error | Error | Error | Error |\n`;
                    }
                }

                comparisonText += `\n*Target company (${upperSymbol}) shown in bold*\n\n`;

                // Add learning insights
                comparisonText += `---\n\n## 💡 Learning Points\n\n`;
                comparisonText += `1. **Compare Valuations**: How does ${upperSymbol}'s P/E compare to peers? Higher P/E suggests market expects stronger growth.\n\n`;
                comparisonText += `2. **Profitability**: Which companies have the best profit margins? This often indicates competitive advantages.\n\n`;
                comparisonText += `3. **Growth Rates**: Compare revenue growth - who's growing fastest? Is it sustainable?\n\n`;
                comparisonText += `4. **Size Matters**: Market cap tells you company size. Larger doesn't mean better - consider growth potential vs stability.\n\n`;
                comparisonText += `5. **Deep Dive**: Use \`get_company_info\` on any peer to learn more. Use \`explain_fundamental\` to understand specific metrics.\n\n`;
                comparisonText += `---\n\n`;
                comparisonText += `*Remember: Peer comparison is just one tool. Consider qualitative factors: management, competitive moats, industry trends, and your investment goals.*`;

                return {
                    content: [
                        {
                            type: 'text',
                            text: comparisonText,
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

