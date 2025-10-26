/**
 * MCP Tool Definitions for Portfolio Management
 * Centralized tool schemas following Interface Segregation Principle
 */

/**
 * All available MCP tools for portfolio management
 */
export const PORTFOLIO_TOOLS = [
    {
        name: 'create_portfolio',
        description: 'Create a new investment portfolio. Start here to track your investments.',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Portfolio name (e.g., "Long-term Growth", "Dividend Income")',
                },
                description: {
                    type: 'string',
                    description: 'Portfolio description and investment strategy (optional)',
                },
                currency: {
                    type: 'string',
                    description: 'Base currency (default: USD)',
                    enum: ['USD', 'EUR', 'GBP', 'CAD', 'JPY'],
                },
            },
            required: ['name'],
        },
    },
    {
        name: 'list_portfolios',
        description: 'List all your portfolios with summary information including holdings count and total cost.',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'get_portfolio',
        description: 'Get detailed information about a specific portfolio.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
            },
            required: ['portfolio_id'],
        },
    },
    {
        name: 'get_holdings',
        description: 'Get all current holdings (positions) in a portfolio with details like quantity, average cost, and total value.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
            },
            required: ['portfolio_id'],
        },
    },
    {
        name: 'add_transaction',
        description: 'Add a buy/sell transaction. This automatically updates holdings and calculates average cost basis.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
                symbol: {
                    type: 'string',
                    description: 'Stock symbol (e.g., AAPL, MSFT)',
                },
                type: {
                    type: 'string',
                    description: 'Transaction type',
                    enum: ['BUY', 'SELL', 'DIVIDEND', 'SPLIT', 'TRANSFER_IN', 'TRANSFER_OUT'],
                },
                quantity: {
                    type: 'number',
                    description: 'Number of shares',
                },
                price: {
                    type: 'number',
                    description: 'Price per share',
                },
                fees: {
                    type: 'number',
                    description: 'Transaction fees (optional, default: 0)',
                },
                currency: {
                    type: 'string',
                    description: 'Currency (optional, default: USD)',
                },
                transaction_date: {
                    type: 'string',
                    description: 'Transaction date (YYYY-MM-DD)',
                },
                notes: {
                    type: 'string',
                    description: 'Optional notes about the transaction',
                },
            },
            required: ['portfolio_id', 'symbol', 'type', 'quantity', 'price', 'transaction_date'],
        },
    },
    {
        name: 'get_transactions',
        description: 'Get transaction history for a portfolio. Returns recent transactions in reverse chronological order.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of transactions to return (optional, default: 50)',
                },
            },
            required: ['portfolio_id'],
        },
    },
    {
        name: 'calculate_performance',
        description: 'Calculate portfolio performance metrics including total return, gain/loss, and position-level performance. Requires current market prices.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
                current_prices: {
                    type: 'object',
                    description: 'Map of symbol to current price (e.g., {"AAPL": 150.25, "MSFT": 380.50})',
                    additionalProperties: {
                        type: 'number',
                    },
                },
            },
            required: ['portfolio_id', 'current_prices'],
        },
    },
    {
        name: 'delete_portfolio',
        description: 'Delete a portfolio and all related data (holdings, transactions). This action cannot be undone.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
            },
            required: ['portfolio_id'],
        },
    },
    // Learning & Research Tools
    {
        name: 'add_to_watchlist',
        description: 'Add a stock to your watchlist for research and monitoring. Track stocks you\'re considering buying.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
                symbol: {
                    type: 'string',
                    description: 'Stock symbol (e.g., AAPL, MSFT)',
                },
                notes: {
                    type: 'string',
                    description: 'Research notes or reasons for watching (optional)',
                },
                target_price: {
                    type: 'number',
                    description: 'Your target buy price (optional)',
                },
                priority: {
                    type: 'string',
                    description: 'Priority level (optional, default: MEDIUM)',
                    enum: ['LOW', 'MEDIUM', 'HIGH'],
                },
            },
            required: ['portfolio_id', 'symbol'],
        },
    },
    {
        name: 'get_watchlist',
        description: 'Get your watchlist of stocks you\'re researching or monitoring.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
            },
            required: ['portfolio_id'],
        },
    },
    {
        name: 'update_watchlist_item',
        description: 'Update notes, target price, or priority for a watchlist item.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
                symbol: {
                    type: 'string',
                    description: 'Stock symbol',
                },
                notes: {
                    type: 'string',
                    description: 'Updated research notes (optional)',
                },
                target_price: {
                    type: 'number',
                    description: 'Updated target price (optional)',
                },
                priority: {
                    type: 'string',
                    description: 'Updated priority level (optional)',
                    enum: ['LOW', 'MEDIUM', 'HIGH'],
                },
            },
            required: ['portfolio_id', 'symbol'],
        },
    },
    {
        name: 'remove_from_watchlist',
        description: 'Remove a stock from your watchlist.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
                symbol: {
                    type: 'string',
                    description: 'Stock symbol',
                },
            },
            required: ['portfolio_id', 'symbol'],
        },
    },
    {
        name: 'create_thesis',
        description: 'Document your investment thesis for a stock. Record bull case, bear case, and target allocation.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
                symbol: {
                    type: 'string',
                    description: 'Stock symbol',
                },
                thesis: {
                    type: 'string',
                    description: 'Your investment thesis (why you own or want to own this)',
                },
                bull_case: {
                    type: 'string',
                    description: 'Bull case - reasons for price appreciation (optional)',
                },
                bear_case: {
                    type: 'string',
                    description: 'Bear case - risks and concerns (optional)',
                },
                target_allocation: {
                    type: 'number',
                    description: 'Target % of portfolio (optional)',
                },
                review_date: {
                    type: 'string',
                    description: 'Date to review thesis (YYYY-MM-DD, optional)',
                },
            },
            required: ['portfolio_id', 'symbol', 'thesis'],
        },
    },
    {
        name: 'get_theses',
        description: 'Get all investment theses for your portfolio.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
            },
            required: ['portfolio_id'],
        },
    },
    {
        name: 'get_thesis',
        description: 'Get investment thesis for a specific stock.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
                symbol: {
                    type: 'string',
                    description: 'Stock symbol',
                },
            },
            required: ['portfolio_id', 'symbol'],
        },
    },
    {
        name: 'update_thesis',
        description: 'Update your investment thesis as you learn more or market conditions change.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
                symbol: {
                    type: 'string',
                    description: 'Stock symbol',
                },
                thesis: {
                    type: 'string',
                    description: 'Updated investment thesis (optional)',
                },
                bull_case: {
                    type: 'string',
                    description: 'Updated bull case (optional)',
                },
                bear_case: {
                    type: 'string',
                    description: 'Updated bear case (optional)',
                },
                target_allocation: {
                    type: 'number',
                    description: 'Updated target % of portfolio (optional)',
                },
                review_date: {
                    type: 'string',
                    description: 'Updated review date (YYYY-MM-DD, optional)',
                },
                status: {
                    type: 'string',
                    description: 'Updated status (optional)',
                    enum: ['ACTIVE', 'MONITORING', 'EXITED', 'INVALIDATED'],
                },
            },
            required: ['portfolio_id', 'symbol'],
        },
    },
    {
        name: 'delete_thesis',
        description: 'Delete an investment thesis.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
                symbol: {
                    type: 'string',
                    description: 'Stock symbol',
                },
            },
            required: ['portfolio_id', 'symbol'],
        },
    },
    {
        name: 'analyze_what_if',
        description: 'Analyze "what if" scenarios - see how buying or selling would impact your portfolio before making a decision.',
        inputSchema: {
            type: 'object',
            properties: {
                portfolio_id: {
                    type: 'string',
                    description: 'Portfolio ID (UUID)',
                },
                symbol: {
                    type: 'string',
                    description: 'Stock symbol',
                },
                action: {
                    type: 'string',
                    description: 'What action to analyze',
                    enum: ['BUY', 'SELL'],
                },
                quantity: {
                    type: 'number',
                    description: 'Quantity to buy or sell',
                },
                price: {
                    type: 'number',
                    description: 'Price per share for the transaction',
                },
                current_prices: {
                    type: 'object',
                    description: 'Map of symbol to current price for all positions (e.g., {"AAPL": 150.25, "MSFT": 380.50})',
                    additionalProperties: {
                        type: 'number',
                    },
                },
            },
            required: ['portfolio_id', 'symbol', 'action', 'quantity', 'price', 'current_prices'],
        },
    },
] as const;

