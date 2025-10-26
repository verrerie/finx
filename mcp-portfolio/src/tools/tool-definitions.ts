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
] as const;

