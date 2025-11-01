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
import { AssetService } from './services/asset.service.js';
import { PORTFOLIO_TOOLS } from './tools/tool-definitions.js';
import { handlers } from './handlers/index.js';
import { error } from './utils/response.js';

/**
 * Initialize services
 */
const portfolioRepo = new PortfolioRepository();
const holdingRepo = new HoldingRepository();
const transactionRepo = new TransactionRepository();
const watchlistRepo = new WatchlistRepository();
const thesisRepo = new ThesisRepository();
const assetService = new AssetService();
const portfolioService = new PortfolioService(portfolioRepo, holdingRepo, transactionRepo, assetService);
const learningService = new LearningService(watchlistRepo, thesisRepo, holdingRepo, assetService);

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

    const handler = handlers[name];
    if (!handler) {
        return error(`Unknown tool: ${name}`);
    }

    try {
        return await handler(args, { portfolioService, learningService, assetService });
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return error(message);
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

