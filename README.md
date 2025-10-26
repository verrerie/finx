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

**Phase 1b: Portfolio Management** ⚙️ In Progress

- [x] Database infrastructure (Docker Compose + MariaDB 11.8)
- [ ] Portfolio MCP Server core tools
- [ ] Portfolio learning features
- [ ] End-to-end testing
- [ ] Complete documentation

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

4. **Configure MCP in Cursor:**

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

5. **Build and start the server:**

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

- [MONOREPO.md](./docs/MONOREPO.md) - **Monorepo structure and workspace management**
- [LEARNING.md](./docs/LEARNING.md) - How to use this system for financial education
- [QUICKSTART.md](./docs/QUICKSTART.md) - Interactive guide to explore Market Data tools
- [USAGE.md](./docs/USAGE.md) - Detailed usage guide and workflows
- [DATABASE.md](./docs/DATABASE.md) - Database setup, schema, and management
- [TEST_FEATURES.md](./docs/TEST_FEATURES.md) - Comprehensive testing guide for learning features
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

