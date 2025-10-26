#!/usr/bin/env node

/**
 * Portfolio MCP Server
 * Manages investment portfolios, holdings, and transactions
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { SERVER_INFO } from './config.js';
import { closePool, testConnection } from './database/connection.js';
import { HoldingRepository } from './database/repositories/holding.repository.js';
import { PortfolioRepository } from './database/repositories/portfolio.repository.js';
import { ThesisRepository } from './database/repositories/thesis.repository.js';
import { TransactionRepository } from './database/repositories/transaction.repository.js';
import { WatchlistRepository } from './database/repositories/watchlist.repository.js';
import { LearningService } from './services/learning.service.js';
import { PortfolioService } from './services/portfolio.service.js';
import { PORTFOLIO_TOOLS } from './tools/tool-definitions.js';
import type { AddTransactionInput } from './types.js';

/**
 * Initialize services
 */
const portfolioRepo = new PortfolioRepository();
const holdingRepo = new HoldingRepository();
const transactionRepo = new TransactionRepository();
const watchlistRepo = new WatchlistRepository();
const thesisRepo = new ThesisRepository();
const portfolioService = new PortfolioService(portfolioRepo, holdingRepo, transactionRepo);
const learningService = new LearningService(watchlistRepo, thesisRepo, holdingRepo);

/**
 * Create MCP server
 */
const server = new Server(
    {
        name: SERVER_INFO.name,
        version: SERVER_INFO.version,
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

/**
 * Handle tool listing
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: PORTFOLIO_TOOLS,
    };
});

/**
 * Handle tool execution
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    // Ensure args is defined
    if (!args) {
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: 'Missing arguments',
                    }, null, 2),
                },
            ],
            isError: true,
        };
    }

    try {
        switch (name) {
            case 'create_portfolio': {
                const portfolio = await portfolioService.createPortfolio({
                    name: args.name as string,
                    description: args.description as string | undefined,
                    currency: args.currency as string | undefined,
                });

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                portfolio,
                                message: `Portfolio "${portfolio.name}" created successfully!`,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'list_portfolios': {
                const portfolios = await portfolioService.listPortfolioSummaries();

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                count: portfolios.length,
                                portfolios,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_portfolio': {
                const portfolio = await portfolioService.getPortfolio(args.portfolio_id as string);

                if (!portfolio) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    success: false,
                                    error: 'Portfolio not found',
                                }, null, 2),
                            },
                        ],
                    };
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                portfolio,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_holdings': {
                const holdings = await portfolioService.getHoldings(args.portfolio_id as string);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                count: holdings.length,
                                holdings,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'add_transaction': {
                const input: AddTransactionInput = {
                    portfolio_id: args.portfolio_id as string,
                    symbol: args.symbol as string,
                    type: args.type as any,
                    quantity: args.quantity as number,
                    price: args.price as number,
                    fees: args.fees as number | undefined,
                    currency: args.currency as string | undefined,
                    transaction_date: args.transaction_date as string,
                    notes: args.notes as string | undefined,
                };

                const result = await portfolioService.addTransaction(input);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                transaction: result.transaction,
                                holding: result.holding,
                                message: `Transaction recorded: ${input.type} ${input.quantity} shares of ${input.symbol} @ $${input.price}`,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_transactions': {
                const transactions = await portfolioService.getTransactions(
                    args.portfolio_id as string,
                    args.limit as number | undefined
                );

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                count: transactions.length,
                                transactions,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'calculate_performance': {
                const currentPrices = args.current_prices as Record<string, number>;

                const performance = await portfolioService.calculatePerformance(
                    args.portfolio_id as string,
                    currentPrices
                );

                const positionPerformance = await portfolioService.calculatePositionPerformance(
                    args.portfolio_id as string,
                    currentPrices
                );

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                performance,
                                positions: positionPerformance,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'delete_portfolio': {
                const deleted = await portfolioService.deletePortfolio(args.portfolio_id as string);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: deleted,
                                message: deleted
                                    ? 'Portfolio deleted successfully'
                                    : 'Portfolio not found',
                            }, null, 2),
                        },
                    ],
                };
            }

            // Learning & Research Tools
            case 'add_to_watchlist': {
                const watchlistItem = await learningService.addToWatchlist({
                    portfolio_id: args.portfolio_id as string,
                    symbol: args.symbol as string,
                    notes: args.notes as string | undefined,
                    target_price: args.target_price as number | undefined,
                    priority: args.priority as 'LOW' | 'MEDIUM' | 'HIGH' | undefined,
                });

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                watchlist_item: watchlistItem,
                                message: `${watchlistItem.symbol} added to watchlist`,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_watchlist': {
                const watchlist = await learningService.getWatchlist(args.portfolio_id as string);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                watchlist,
                                count: watchlist.length,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'update_watchlist_item': {
                const updates: any = {};
                if (args.notes !== undefined) updates.notes = args.notes as string;
                if (args.target_price !== undefined) updates.target_price = args.target_price as number;
                if (args.priority !== undefined) updates.priority = args.priority as 'LOW' | 'MEDIUM' | 'HIGH';

                const updatedItem = await learningService.updateWatchlistItem(
                    args.portfolio_id as string,
                    args.symbol as string,
                    updates
                );

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                watchlist_item: updatedItem,
                                message: 'Watchlist item updated',
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'remove_from_watchlist': {
                const removed = await learningService.removeFromWatchlist(
                    args.portfolio_id as string,
                    args.symbol as string
                );

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: removed,
                                message: removed
                                    ? 'Item removed from watchlist'
                                    : 'Item not found in watchlist',
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'create_thesis': {
                const thesis = await learningService.createThesis({
                    portfolio_id: args.portfolio_id as string,
                    symbol: args.symbol as string,
                    thesis: args.thesis as string,
                    bull_case: args.bull_case as string | undefined,
                    bear_case: args.bear_case as string | undefined,
                    target_allocation: args.target_allocation as number | undefined,
                    review_date: args.review_date ? new Date(args.review_date as string) : undefined,
                });

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                thesis,
                                message: `Investment thesis for ${thesis.symbol} created`,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_theses': {
                const theses = await learningService.getTheses(args.portfolio_id as string);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                theses,
                                count: theses.length,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_thesis': {
                const thesis = await learningService.getThesis(
                    args.portfolio_id as string,
                    args.symbol as string
                );

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                thesis,
                                message: thesis ? 'Thesis found' : 'No thesis found for this symbol',
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'update_thesis': {
                const updates: any = {};
                if (args.thesis !== undefined) updates.thesis = args.thesis as string;
                if (args.bull_case !== undefined) updates.bull_case = args.bull_case as string;
                if (args.bear_case !== undefined) updates.bear_case = args.bear_case as string;
                if (args.target_allocation !== undefined) updates.target_allocation = args.target_allocation as number;
                if (args.review_date !== undefined) {
                    updates.review_date = new Date(args.review_date as string);
                }
                if (args.status !== undefined) {
                    updates.status = args.status as 'ACTIVE' | 'MONITORING' | 'EXITED' | 'INVALIDATED';
                }

                const updatedThesis = await learningService.updateThesis(
                    args.portfolio_id as string,
                    args.symbol as string,
                    updates
                );

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                thesis: updatedThesis,
                                message: 'Thesis updated',
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'delete_thesis': {
                const deleted = await learningService.deleteThesis(
                    args.portfolio_id as string,
                    args.symbol as string
                );

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: deleted,
                                message: deleted ? 'Thesis deleted' : 'Thesis not found',
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'analyze_what_if': {
                const action = args.action as string;
                const currentPrices = args.current_prices as Record<string, number>;

                let analysis;
                if (action === 'SELL') {
                    analysis = await learningService.analyzeWhatIfSell(
                        args.portfolio_id as string,
                        args.symbol as string,
                        args.price as number,
                        currentPrices
                    );
                } else if (action === 'BUY') {
                    analysis = await learningService.analyzeWhatIfBuy(
                        args.portfolio_id as string,
                        args.symbol as string,
                        args.quantity as number,
                        args.price as number,
                        currentPrices
                    );
                } else {
                    throw new Error(`Invalid action: ${action}. Must be "BUY" or "SELL"`);
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                analysis,
                                message: `What-if analysis complete for ${action} ${args.symbol}`,
                            }, null, 2),
                        },
                    ],
                };
            }

            default:
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: false,
                                error: `Unknown tool: ${name}`,
                            }, null, 2),
                        },
                    ],
                    isError: true,
                };
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: errorMessage,
                    }, null, 2),
                },
            ],
            isError: true,
        };
    }
});

/**
 * Start the server
 */
async function main() {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
        console.error('Failed to connect to database. Please check your configuration.');
        process.exit(1);
    }

    console.error('Portfolio MCP Server started successfully');
    console.error(`Version: ${SERVER_INFO.version}`);
    console.error('Database connection established');

    const transport = new StdioServerTransport();
    await server.connect(transport);

    // Cleanup on exit
    process.on('SIGINT', async () => {
        console.error('\nShutting down...');
        await closePool();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.error('\nShutting down...');
        await closePool();
        process.exit(0);
    });
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});

