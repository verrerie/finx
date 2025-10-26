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

- **Market Data MCP Server** - Real-time quotes, historical data, and company fundamentals with educational explanations
- **Portfolio Manager MCP Server** - Track holdings, transactions, and performance with learning features (Phase 1b)
- **MariaDB Database** - Local storage for portfolio data and learning journal (Phase 1b)
- **Knowledge Base** - Document financial concepts as you learn them
- **Cursor Integration** - Learning-oriented instructions and prompts

## 📋 Current Status

**Phase 1a: Market Data Foundation** ⚙️ In Progress

- [x] Project structure initialized
- [ ] Market Data MCP Server core tools
- [ ] Market Data learning features
- [ ] Cursor integration
- [ ] Knowledge base setup
- [ ] Testing and validation

**Phase 1b: Portfolio Management** 🔜 Upcoming

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
cp .env.example .env
# Edit .env and add your Alpha Vantage API key
```

3. **Configure MCP in Cursor:**

Add to your Cursor MCP configuration (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "finx-market-data": {
      "command": "node",
      "args": [
        "/Users/verrerie/git/finx/dist/mcp-market-data/src/index.js"
      ],
      "env": {
        "ALPHA_VANTAGE_API_KEY": "your_key_here"
      }
    }
  }
}
```

*(Update the path to match your installation location)*

4. **Build and start the server:**

```bash
# Development mode (auto-reload)
pnpm dev:market-data

# Production build
pnpm build:market-data
```

## 📚 Learning Path

### Phase 1: Market Data & Fundamentals
**Learn:** Stock quotes, historical data, company fundamentals, financial metrics

**Recommended Reading:**
- "The Intelligent Investor" by Benjamin Graham
- "A Random Walk Down Wall Street" by Burton Malkiel

**Practice:**
- Research different stocks
- Compare companies in the same sector
- Understand key financial ratios (P/E, P/B, ROE, etc.)
- Document concepts in your knowledge base

### Phase 2: Portfolio Management
**Learn:** Position sizing, cost basis, returns calculation, asset allocation

### Phase 3: Fundamental Analysis
**Learn:** Financial statement analysis, valuation models, ratio interpretation

### Phase 4: Risk & Portfolio Theory
**Learn:** Diversification, correlation, risk-adjusted returns, modern portfolio theory

## 🛠️ Technology Stack

- **Runtime:** Node.js 22.x LTS
- **Language:** TypeScript 5.7.x
- **Package Manager:** pnpm 9.x
- **MCP SDK:** @modelcontextprotocol/sdk
- **Market Data:** Alpha Vantage + Yahoo Finance (fallback)
- **Database:** MariaDB 11.8 (Phase 1b)

## 📖 Documentation

- [LEARNING.md](./LEARNING.md) - How to use this system for financial education
- [USAGE.md](./USAGE.md) - Detailed usage guide and workflows
- [.cursor/knowledge/](./cursor/knowledge/) - Your personal financial knowledge base

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

