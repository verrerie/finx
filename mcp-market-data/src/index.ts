import dotenv from 'dotenv';
dotenv.config();

import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { Cache } from './cache.js';
import { config } from './config.js';
import { createProviders } from './factories/provider.factory.js';
import { RateLimiter } from './rate-limiter.js';
import { EducationalService } from './services/educational.service.js';
import { MarketDataService } from './services/market-data.service.js';
import { TOOL_DEFINITIONS } from './tools/tool-definitions.js';
import { Period } from './types.js';

/**
 * Reads the version from package.json lazily with proper error handling.
 * Falls back to '0.0.0' if the file cannot be read.
 */
function getVersion(): string {
    try {
        // Resolve path relative to the compiled output location (dist/)
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        // In dist/, we need to go up one level to find package.json
        const packageJsonPath = resolve(__dirname, '../package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        return packageJson.version || '0.0.0';
    } catch (error) {
        // If we can't read package.json, log a warning and use a fallback version
        console.error('Warning: Could not read version from package.json, using fallback:', error);
        return '0.0.0';
    }
}

export async function startMarketDataServer(server: Server, transport: StdioServerTransport) {
    // Initialize dependencies
    const cache = new Cache();
    const rateLimiter = new RateLimiter(config.RATE_LIMITS.CALLS_PER_MINUTE, config.RATE_LIMITS.CALLS_PER_DAY);
    const providers = createProviders(config.ENV.ALPHA_VANTAGE_API_KEY, config.ENV.FMP_API_KEY, config.ENV.FRED_API_KEY);

    // Create services with injected dependencies
    const marketDataService = new MarketDataService(
        cache,
        rateLimiter,
        providers.primary,
        providers.financialModelingPrep,
        providers.fred,
        providers.fallback
    );
    const educationalService = new EducationalService(
        cache,
        providers.fallback,
        [providers.primary, providers.financialModelingPrep, providers.fred, providers.fallback].filter(p => p) as any
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
                    const result = await educationalService.explainFundamental(metric, symbol);

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
                    const result = await educationalService.comparePeers(symbol, sector, metrics);

                    return {
                        content: [{ type: 'text', text: result.comparison }],
                    };
                }

                case 'get_news': {
                    const { symbol, topic } = args as { symbol?: string; topic?: string };
                    const result = await marketDataService.getNews(symbol, topic);

                    const text = JSON.stringify(result.data, null, 2) + `\n\n(${result.metadata})`;

                    return {
                        content: [{ type: 'text', text }],
                    };
                }

                case 'get_financial_statements': {
                    const { symbol, statementType, period } = args as {
                        symbol: string;
                        statementType: 'income' | 'balance' | 'cashflow';
                        period?: 'annual' | 'quarter';
                    };
                    const result = await marketDataService.getFinancialStatements(
                        symbol,
                        statementType as any,
                        period || 'annual'
                    );

                    const text = JSON.stringify(result.data, null, 2) + `\n\n(${result.metadata})`;

                    return {
                        content: [{ type: 'text', text }],
                    };
                }

                case 'get_economic_indicator': {
                    const { seriesId, startDate, endDate } = args as {
                        seriesId: string;
                        startDate?: string;
                        endDate?: string;
                    };
                    const result = await marketDataService.getEconomicIndicator(seriesId, startDate, endDate);

                    const text = JSON.stringify(result.data, null, 2) + `\n\n(${result.metadata})`;

                    return {
                        content: [{ type: 'text', text }],
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

    await server.connect(transport);
}

// Start server
async function main() {
    // Read version lazily at runtime, not during module initialization
    const version = getVersion();

    const server = new Server(
        {
            name: 'finx-market-data',
            version,
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );
    const transport = new StdioServerTransport();
    await startMarketDataServer(server, transport);

    console.error(`FinX Market Data MCP Server running (v${version})`);
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
