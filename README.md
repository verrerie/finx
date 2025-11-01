# FinX - Financial AI Agent System

![CI](https://github.com/verrerie/finx/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/verrerie/finx/branch/main/graph/badge.svg)](https://codecov.io/gh/verrerie/finx)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)
![pnpm Version](https://img.shields.io/badge/pnpm-%3E%3D9.0.0-orange)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A learning-focused financial AI agent system built with MCP (Model Context Protocol) servers. Designed to help you learn investment concepts through hands-on portfolio management and market analysis.

## 🎯 Philosophy

**Learn by Doing** - This is not just an investment tool; it's an educational platform that helps you understand financial concepts by applying them to real data and your actual portfolio.

## ✨ What You Can Do

FinX provides two powerful MCP servers that integrate seamlessly with Cursor to help you learn investing:

### 📊 Market Data Server
- **Get real-time quotes** - Current prices, market metrics, and daily performance
- **Explore historical data** - Analyze price trends and volatility over any time period
- **Research companies** - Comprehensive fundamentals, financial ratios, and business insights
- **Learn financial concepts** - Educational explanations of metrics like P/E ratio, ROE, profit margins
- **Compare companies** - Side-by-side analysis of peers in the same sector

### 💼 Portfolio Management Server
- **Track your investments** - Create portfolios and record buy/sell transactions
- **Calculate performance** - See returns, gains/losses, and position-level analytics
- **Manage watchlists** - Track companies you're researching before investing
- **Document your thesis** - Record bull and bear cases for each investment decision
- **Run what-if scenarios** - Model how transactions would impact your portfolio
- **Analyze holdings** - Deep dive into individual positions and overall portfolio health

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
pnpm install
```

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


## 📚 Learning Path

FinX guides you through investment concepts progressively, from basics to advanced analysis.

### Stage 1: Market Data & Fundamentals

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

### Stage 2: Portfolio Management

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

### Stage 3: Financial Statement Analysis

**What You Learn:**
- Balance sheet analysis
- Income statement interpretation
- Cash flow analysis
- Valuation models and methodologies
- Ratio calculations with educational context
- Industry and sector analysis frameworks

**Learning Prompts:**
- Advanced financial statement analysis prompts
- Valuation model guides
- Sector-specific analysis frameworks

### Future Features: Risk & Portfolio Theory

**Coming Soon:**
- Diversification metrics and optimization
- Correlation analysis
- Risk-adjusted returns (Sharpe, Sortino ratios)
- Modern portfolio theory concepts

**Recommended Reading:**
- "The Intelligent Investor" by Benjamin Graham
- "A Random Walk Down Wall Street" by Burton Malkiel
- "Common Stocks and Uncommon Profits" by Philip Fisher
- "One Up On Wall Street" by Peter Lynch

## 🛠️ Technology Stack

- **Runtime:** Node.js 22.x LTS
- **Package Manager:** pnpm 9.x
- **Market Data:** Alpha Vantage + Yahoo Finance (fallback)
- **Database:** MariaDB 11.8 (for portfolio data)

## 📖 Documentation

### Quick Start Guides
- **[USAGE.md](./docs/USAGE.md)** - Complete usage guide with real-world examples
- **[LEARNING.md](./docs/LEARNING.md)** - How to use this system for financial education
- **[QUICKSTART.md](./docs/QUICKSTART.md)** - Interactive guide to explore tools

### Technical Documentation
- **[MONOREPO.md](./docs/MONOREPO.md)** - Monorepo structure and workspace management (for developers)
- **[DATABASE.md](./docs/DATABASE.md)** - Database setup, schema, and management
- **[.cursorrules](./.cursorrules)** - AI behavior guidelines for learning
- **[.cursor/prompts/](./cursor/prompts/)** - Structured learning prompts

### Knowledge Base
- **[.cursor/knowledge/](./cursor/knowledge/)** - Your personal financial knowledge base
- **[concepts/](./cursor/knowledge/concepts/)** - Financial concept documentation
- **[journal/](./cursor/knowledge/journal/)** - Investment decision log
- **[frameworks/](./cursor/knowledge/frameworks/)** - Investment frameworks

## 🎮 For Developers

### Testing

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage
pnpm test:e2e          # End-to-end workflows
```

### Development

```bash
pnpm dev:market-data   # Watch mode for Market Data server
pnpm dev:portfolio     # Watch mode for Portfolio server
```

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

