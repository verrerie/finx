#!/usr/bin/env node

/**
 * Market Data MCP Server
 * 
 * Provides real-time and historical market data with educational explanations.
 * Refactored to follow SOLID principles.
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { Cache } from './cache.js';
import { ENV, RATE_LIMITS } from './config.js';
import { createProviders } from './factories/provider.factory.js';
import { RateLimiter } from './rate-limiter.js';
import { MarketDataService } from './services/market-data.service.js';
import { TOOL_DEFINITIONS } from './tools/tool-definitions.js';
import { Period } from './types.js';

// Initialize dependencies
const cache = new Cache();
const rateLimiter = new RateLimiter(RATE_LIMITS.CALLS_PER_MINUTE, RATE_LIMITS.CALLS_PER_DAY);
const providers = createProviders(ENV.ALPHA_VANTAGE_API_KEY);

// Create service with injected dependencies
const marketDataService = new MarketDataService(
    cache,
    rateLimiter,
    providers.primary,
    providers.fallback
);

// Create MCP server
const server = new Server(
    {
        name: 'finx-market-data',
        version: '0.2.0', // Bumped for SOLID refactoring
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOL_DEFINITIONS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'get_quote': {
                const { symbol } = args as { symbol: string };
                const result = await marketDataService.getQuote(symbol);

                let text = JSON.stringify(result.data, null, 2);
                if (result.cached) {
                    text += '\n\n(Cached data)';
                } else {
                    text += `\n\n(Source: ${result.source}`;
                    if (result.rateLimitInfo) {
                        text += ` | ${result.rateLimitInfo}`;
                    }
                    text += ')';
                }

                return {
                    content: [{ type: 'text', text }],
                };
            }

            case 'get_historical_data': {
                const { symbol, period = '1y' } = args as { symbol: string; period?: Period };
                const result = await marketDataService.getHistoricalData(symbol, period);

                const text = JSON.stringify(result.data, null, 2) + `\n\n(${result.metadata})`;

                return {
                    content: [{ type: 'text', text }],
                };
            }

            case 'search_symbol': {
                const { query } = args as { query: string };
                const result = await marketDataService.searchSymbol(query);

                let text = JSON.stringify(result.data, null, 2);
                text += `\n\n(${result.metadata}`;
                if (result.rateLimitInfo) {
                    text += ` | ${result.rateLimitInfo}`;
                }
                text += ')';

                return {
                    content: [{ type: 'text', text }],
                };
            }

            case 'get_company_info': {
                const { symbol } = args as { symbol: string };
                const result = await marketDataService.getCompanyInfo(symbol);

                let text = JSON.stringify(result.data, null, 2);
                if (result.cached) {
                    text += '\n\n(Cached data)';
                } else {
                    text += `\n\n(Source: ${result.source}`;
                    if (result.rateLimitInfo) {
                        text += ` | ${result.rateLimitInfo}`;
                    }
                    text += ')';
                }

                return {
                    content: [{ type: 'text', text }],
                };
            }

            case 'explain_fundamental': {
                const { metric, symbol } = args as { metric: string; symbol?: string };
                const result = await marketDataService.explainFundamental(metric, symbol);

                const text = result.explanation + (result.contextData || '');

                return {
                    content: [{ type: 'text', text }],
                };
            }

            case 'compare_peers': {
                const { symbol, sector, metrics } = args as {
                    symbol: string;
                    sector?: string;
                    metrics?: string[];
                };
                const result = await marketDataService.comparePeers(symbol, sector, metrics);

                return {
                    content: [{ type: 'text', text: result.comparison }],
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

    console.error('FinX Market Data MCP Server running (v0.2.0 - SOLID refactored)');
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
