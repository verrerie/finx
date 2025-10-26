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

## Setup

See main [README.md](../README.md) for installation and configuration instructions.

## Development

```bash
# Watch mode with auto-reload
pnpm dev:market-data

# Build for production
pnpm build:market-data
```

## Rate Limits

- Alpha Vantage Free: 25 requests/day, 5 requests/minute
- Implements caching and fallback to manage limits
- Yahoo Finance fallback has no documented limits

## Status

**Phase 1a** - In Development

