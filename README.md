# FinX - Financial AI Agent System

![CI](https://github.com/verrerie/finx/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/verrerie/finx/branch/main/graph/badge.svg)](https://codecov.io/gh/verrerie/finx)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)
![pnpm Version](https://img.shields.io/badge/pnpm-%3E%3D9.0.0-orange)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A learning-focused financial AI agent system built with MCP (Model Context Protocol) servers. Designed to help you learn investment concepts through hands-on portfolio management and market analysis.

## 🎯 Philosophy

**Learn by Doing** - This is not just an investment tool; it's an educational platform that helps you understand financial concepts by applying them to real data and your actual portfolio.

## 🏗️ Architecture

**Monorepo Structure** - pnpm workspaces with independently versioned packages

### MCP Servers (Workspace Packages)

- **@finx/mcp-market-data** - Real-time quotes, historical data, and company fundamentals with educational explanations
- **@finx/mcp-portfolio** - Track holdings, transactions, and performance with learning features

### Infrastructure

- **MariaDB 11.8** - Local storage for portfolio data and learning journal
- **Knowledge Base** - Document financial concepts as you learn them
- **Cursor Integration** - Learning-oriented instructions and prompts

See [docs/MONOREPO.md](./docs/MONOREPO.md) for detailed workspace documentation.

## 📋 Current Status

**Phase 1a: Market Data Foundation** ✅ Complete

- [x] Project structure initialized
- [x] Market Data MCP Server core tools (quote, historical, search, company info)
- [x] Market Data learning features (explain fundamentals, compare peers)
- [x] Cursor integration with learning prompts
- [x] Knowledge base setup with concepts and journal templates
- [x] Testing, validation, and SOLID refactoring
- [x] CI/CD with automated testing and releases

**Phase 1b: Portfolio Management** ✅ Complete

- [x] Database infrastructure (Docker Compose + MariaDB 11.8)
- [x] Portfolio MCP Server core tools (8 tools)
- [x] Portfolio learning features (10 additional tools)
- [x] Portfolio analysis prompts for Cursor
- [x] End-to-end testing (3 complete workflows)
- [x] Complete documentation

**Implemented Features:**
- Create and manage investment portfolios
- Record buy/sell transactions with automatic cost basis
- Calculate portfolio and position-level performance
- Research watchlist management
- Investment thesis tracking (bull/bear cases)
- What-if scenario analysis (buy/sell impact modeling)
- Comprehensive learning prompts and knowledge base

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x LTS or higher
- pnpm 9.x or higher
- Docker and Docker Compose (for database)
- Alpha Vantage API key (free tier: [Get one here](https://www.alphavantage.co/support/#api-key))
- Cursor IDE (for MCP integration)

### Installation

1. **Clone and install dependencies:**

```bash
cd finx
pnpm install  # Installs all workspace packages
```

This installs:
- Root dev dependencies (TypeScript, Vitest, etc.)
- Market Data server dependencies
- Portfolio server dependencies

2. **Configure environment:**

```bash
cp env.example .env
# Edit .env and add:
# - Your Alpha Vantage API key
# - Database credentials (if changing defaults)
```

3. **Start the database:**

```bash
docker compose up -d mariadb
```

Verify it's running:
```bash
docker compose ps
```

See [docs/DATABASE.md](./docs/DATABASE.md) for detailed database documentation.

4. **Build all servers:**

```bash
pnpm build
```

This builds:
- Market Data MCP Server (`mcp-market-data/dist/`)
- Portfolio MCP Server (`mcp-portfolio/dist/`)

5. **Configure MCP in Cursor:**

Add to your Cursor MCP configuration (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "finx-market-data": {
      "command": "node",
      "args": [
        "/absolute/path/to/finx/mcp-market-data/dist/index.js"
      ],
      "env": {
        "ALPHA_VANTAGE_API_KEY": "your_key_here"
      }
    },
    "finx-portfolio": {
      "command": "node",
      "args": [
        "/absolute/path/to/finx/mcp-portfolio/dist/index.js"
      ],
      "env": {
        "DB_HOST": "localhost",
        "DB_PORT": "3306",
        "DB_NAME": "finx",
        "DB_USER": "finx_user",
        "DB_PASSWORD": "finx_password"
      }
    }
  }
}
```

**⚠️ Important:** Replace `/absolute/path/to/finx` with your actual installation path.

6. **Restart Cursor** to load the MCP servers

## 🎮 Testing & Development

### Run Tests

```bash
# All unit tests
pnpm test

# Watch mode for development  
pnpm test:watch

# With coverage
pnpm test:coverage

# Integration tests
pnpm test:market-data    # Market Data server
pnpm test:portfolio      # Portfolio server core
pnpm test:portfolio-learning  # Learning features
pnpm test:e2e            # End-to-end workflows
```

### Development Mode

```bash
# Run MCP servers in watch mode
pnpm dev:market-data     # Auto-reload Market Data server
pnpm dev:portfolio       # Auto-reload Portfolio server
```

## 📚 Learning Path

### Phase 1a: Market Data & Fundamentals ✅

**What You Learn:**
- Reading stock quotes and understanding market data
- Company fundamentals and financial metrics
- Sector comparisons and peer analysis
- Key financial ratios (P/E, ROE, profit margins, etc.)

**Available Tools:**
- `get_quote` - Current price and metrics
- `get_historical_data` - Price history
- `get_company_info` - Comprehensive fundamentals
- `search_symbol` - Find ticker symbols
- `explain_fundamental` - Learn about specific metrics
- `compare_peers` - Side-by-side company comparisons

**Learning Prompts:**
- `learn-concept.md` - Deep dive into financial metrics
- `decode-financials.md` - Understand a company
- `compare-stocks.md` - Learn by comparison

### Phase 1b: Portfolio Management ✅

**What You Learn:**
- Building and tracking investment portfolios
- Recording transactions and cost basis
- Calculating returns and performance
- Investment thesis development
- What-if scenario analysis
- Portfolio rebalancing strategies

**Available Tools:**
- `create_portfolio` - Start tracking investments
- `add_transaction` - Record buy/sell transactions
- `get_holdings` - View all positions
- `calculate_performance` - Analyze returns
- `add_to_watchlist` - Track research candidates
- `create_thesis` - Document investment rationale
- `analyze_what_if` - Model transaction scenarios
- Plus 11 more portfolio management tools

**Learning Prompts:**
- `analyze-portfolio.md` - Comprehensive portfolio review
- `evaluate-position.md` - Deep dive on individual holdings
- `plan-transaction.md` - Systematic transaction planning

### Phase 2: Financial Statement Analysis (Future)
**Learn:** Balance sheet, income statement, cash flow analysis, valuation models

### Phase 3: Risk & Portfolio Theory (Future)
**Learn:** Diversification, correlation, risk-adjusted returns, modern portfolio theory

**Recommended Reading:**
- "The Intelligent Investor" by Benjamin Graham
- "A Random Walk Down Wall Street" by Burton Malkiel
- "Common Stocks and Uncommon Profits" by Philip Fisher
- "One Up On Wall Street" by Peter Lynch

## 🛠️ Technology Stack

- **Runtime:** Node.js 22.x LTS
- **Language:** TypeScript 5.7.x
- **Package Manager:** pnpm 9.x
- **MCP SDK:** @modelcontextprotocol/sdk
- **Market Data:** Alpha Vantage + Yahoo Finance (fallback)
- **Database:** MariaDB 11.8 (Phase 1b)

## 📖 Documentation

### Quick Start Guides
- **[USAGE.md](./docs/USAGE.md)** - Complete usage guide with real-world examples
- **[LEARNING.md](./docs/LEARNING.md)** - How to use this system for financial education
- **[QUICKSTART.md](./docs/QUICKSTART.md)** - Interactive guide to explore tools

### Technical Documentation
- **[MONOREPO.md](./docs/MONOREPO.md)** - Monorepo structure and workspace management
- **[DATABASE.md](./docs/DATABASE.md)** - Database setup, schema, and management
- **[.cursorrules](./.cursorrules)** - AI behavior guidelines for learning
- **[.cursor/prompts/](./cursor/prompts/)** - Structured learning prompts

### Knowledge Base
- **[.cursor/knowledge/](./cursor/knowledge/)** - Your personal financial knowledge base
- **[concepts/](./cursor/knowledge/concepts/)** - Financial concept documentation
- **[journal/](./cursor/knowledge/journal/)** - Investment decision log
- **[frameworks/](./cursor/knowledge/frameworks/)** - Investment frameworks

## 🤝 Contributing

This is a personal learning project. Feel free to fork and adapt to your needs.

## ⚠️ Disclaimer

This software is for educational purposes only. It is not financial advice. Always consult with a qualified financial advisor before making investment decisions. Past performance does not guarantee future results.

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Useful Resources

- [Investopedia](https://www.investopedia.com/) - Financial concepts reference
- [SEC EDGAR](https://www.sec.gov/edgar/searchedgar/companysearch.html) - Company filings
- [FINRA](https://www.finra.org/) - Regulatory information
- [Khan Academy Finance](https://www.khanacademy.org/economics-finance-domain) - Free courses

