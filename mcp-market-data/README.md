# Market Data MCP Server

Educational MCP server for financial market data with learning features.

## Features

### Core Tools
- `get_quote(symbol)` - Real-time stock quotes
- `get_historical_data(symbol, period)` - Historical price data
- `search_symbol(query)` - Find ticker symbols
- `get_company_info(symbol)` - Company fundamentals

### Learning Tools
- `explain_fundamental(symbol, metric)` - Educational explanations
- `compare_peers(symbol, sector?)` - Peer comparison analysis

## Data Sources

- **Primary:** Alpha Vantage (free tier: 25 calls/day)
- **Fallback:** Yahoo Finance (unlimited, less reliable)
- **Financial Statements:** Financial Modeling Prep (free tier: 250 calls/day)
- **Economic Indicators:** FRED (free tier: 10 requests/second)

Provider priority: Alpha Vantage → Yahoo Finance

## Setup

See main [README.md](../README.md) for installation and configuration instructions.

## Development

```bash
pnpm dev:market-data   # Watch mode with auto-reload
pnpm build:market-data # Build for production
```

## Rate Limits

- Alpha Vantage Free: 25 requests/day, 5 requests/minute
- Financial Modeling Prep Free: 250 calls/day
- FRED Free: 10 requests/second (unlimited)
- System implements caching and automatic fallback through provider chain

