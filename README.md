# FinX - Financial AI Agent System

![CI](https://github.com/verrerie/finx/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/verrerie/finx/branch/main/graph/badge.svg)](https://codecov.io/gh/verrerie/finx)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)
![pnpm Version](https://img.shields.io/badge/pnpm-%3E%3D9.0.0-orange)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A learning-focused financial AI agent system built with MCP (Model Context Protocol) servers. Designed to help you learn investment concepts through hands-on market analysis.

## 🎯 Philosophy

**Learn by Doing** - This is not just an investment tool; it's an educational platform that helps you understand financial concepts by applying them to real data.

## ✨ What You Can Do

FinX provides a powerful MCP server that integrates seamlessly with Cursor to help you learn investing:

### 📊 Market Data Server
- **Get real-time quotes** - Current prices, market metrics, and daily performance
- **Explore historical data** - Analyze price trends and volatility over any time period
- **Research companies** - Comprehensive fundamentals, financial ratios, and business insights
- **Learn financial concepts** - Educational explanations of metrics like P/E ratio, ROE, profit margins
- **Compare companies** - Side-by-side analysis of peers in the same sector

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x LTS or higher
- pnpm 9.x or higher
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
# - Your Alpha Vantage API key (required)
# - Your Financial Modeling Prep API key (optional, for financial statements)
# - Your FRED API key (optional, for economic indicators)
```

3. **Build the server:**

```bash
pnpm build
```

4. **Configure MCP in Cursor:**

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
        "ALPHA_VANTAGE_API_KEY": "your_key_here",
        "FMP_API_KEY": "your_fmp_key_here",
        "FRED_API_KEY": "your_fred_key_here"
      }
    }
  }
}
```

**⚠️ Important:** Replace `/absolute/path/to/finx` with your actual installation path.

5. **Restart Cursor** to load the MCP server


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

### Stage 2: Financial Statement Analysis

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

**Recommended Reading:**
- "The Intelligent Investor" by Benjamin Graham
- "A Random Walk Down Wall Street" by Burton Malkiel
- "Common Stocks and Uncommon Profits" by Philip Fisher
- "One Up On Wall Street" by Peter Lynch

## 🛠️ Technology Stack

- **Runtime:** Node.js 22.x LTS
- **Package Manager:** pnpm 9.x
- **Market Data:** Alpha Vantage + Yahoo Finance (fallback) + Financial Modeling Prep (financial statements) + FRED (economic indicators)

## 📖 Documentation

### Quick Start Guides
- **[USAGE.md](./docs/USAGE.md)** - Complete usage guide with real-world examples
- **[LEARNING.md](./docs/LEARNING.md)** - How to use this system for financial education
- **[QUICKSTART.md](./docs/QUICKSTART.md)** - Interactive guide to explore tools

### Technical Documentation
- **[MONOREPO.md](./docs/MONOREPO.md)** - Monorepo structure and workspace management (for developers)
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
pnpm test              # Run all unit tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage
pnpm test:e2e          # Integration tests (spawns MCP server, tests all tools)
```

### Development

```bash
pnpm dev:market-data   # Watch mode for Market Data server
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

