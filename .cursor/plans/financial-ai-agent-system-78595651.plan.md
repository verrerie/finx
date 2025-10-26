<!-- 78595651-e1b3-4fe7-850f-1b56d218f5bb a54a2489-8ddb-43c2-b80c-30a796099fe4 -->
# Financial AI Agent System - Phase 1 (Core + Learning)

## Architecture Overview

Start with the essential components focused on **learning by doing**:

- **Market Data MCP Server** - Get real-time quotes, historical data, company info with educational explanations
- **Portfolio Manager MCP Server** - Track holdings, transactions, performance with learning features
- **MariaDB Database** - Store portfolio data and learning journal locally
- **Financial Knowledge Base** - Document concepts and insights as you learn
- **Learning-Oriented Cursor Instructions** - Explains WHY, not just WHAT
- **Educational Prompts** - Guided learning workflows

## Phase 1 Components

### 1. Infrastructure Setup

**Database** (`docker-compose.yml`, `db/schema.sql`)

- Docker Compose with MariaDB 11.8
- Tables: `holdings`, `transactions`, `assets` (metadata cache)
- NEW: `journal_entries` (investment insights), `theses` (track predictions)
- Simple migration script

**Configuration** (`.env.example`, `config/`)

- Database connection settings
- API keys (Alpha Vantage, optional others)
- Learning preferences (explanation detail level)

**Financial Knowledge Base** (`.cursor/knowledge/`)

```
knowledge/
├── concepts/           # Financial concepts you learn
│   ├── README.md
│   └── (add as you learn)
├── frameworks/         # Investment frameworks
│   └── README.md
├── journal/           # Investment journal entries
│   └── README.md
└── glossary.md        # Financial terms dictionary
```

### 2. Market Data MCP Server (`mcp-market-data/`)

**Core Tools:**

- `get_quote(symbol)` - Current price and basic metrics
- `get_historical_data(symbol, period)` - Historical prices
- `search_symbol(query)` - Find ticker symbols
- `get_company_info(symbol)` - Fundamentals and company details
- **NEW:** `explain_fundamental(symbol, metric)` - Educational explanation of a specific metric
- **NEW:** `compare_peers(symbol, sector)` - Learn by comparing similar companies

**Data Sources:**

- Primary: Alpha Vantage (free tier: 25 calls/day)
- Fallback: yfinance (Yahoo Finance, unlimited but less reliable)

**Features:**

- Simple in-memory caching (5-minute TTL for quotes)
- Rate limit handling with queue
- Error fallback between sources
- **Learning mode**: Adds context and explanations to responses

### 3. Portfolio Manager MCP Server (`mcp-portfolio/`)

**Core Tools:**

- `add_holding(symbol, quantity, cost_basis, date)` - Add/update position
- `record_transaction(type, symbol, quantity, price, date)` - Log buy/sell
- `get_portfolio_summary()` - Current holdings with current values
- `calculate_performance(period?)` - Returns, gains/losses
- `get_allocation()` - Asset allocation breakdown
- **NEW:** `explain_metric(metric_name)` - Explain what a metric means for YOUR portfolio
- **NEW:** `suggest_analysis()` - Suggest next analysis based on portfolio
- **NEW:** `what_if(scenario)` - Scenario analysis for learning
- **NEW:** `record_insight(symbol, insight)` - Save investment thoughts
- **NEW:** `track_thesis(symbol, thesis)` - Track investment theses

**Features:**

- FIFO cost basis calculation
- Realized vs unrealized gains
- Integration with Market Data server for current prices
- **Learning journal integration** - Track your reasoning and learn from outcomes

### 4. Cursor Configuration

**Financial Analysis Instructions** (`.cursorrules`)

- Always explain WHY a metric matters, not just WHAT it is
- Link to `/knowledge/` docs when referencing concepts
- Suggest follow-up questions for deeper learning
- Compare multiple investment frameworks/approaches
- Highlight when professional advice is needed
- Educational tone: teach concepts while analyzing

**Learning Prompts** (`.cursor/prompts/`)

- `analyze-portfolio.md` - Portfolio review with educational explanations
- `learn-concept.md` - Deep dive into a financial concept with examples
- `decode-financials.md` - Walk through understanding company financials
- `compare-stocks.md` - Learn by comparing companies side-by-side
- `what-if-scenario.md` - Explore "what if" scenarios for learning

### 5. Documentation

**README.md**

- Quick start guide
- Database setup
- MCP server configuration in Cursor
- Example learning workflows
- **NEW:** Recommended learning resources (books, courses, blogs)

**LEARNING.md** (NEW)

- How to use the system for financial education
- Suggested learning path (beginner → intermediate → advanced)
- How to document concepts in knowledge base
- Using the journal for reflection and improvement

**USAGE.md**

- How to add transactions
- How to run portfolio analysis
- How to research investments
- How to track your investment theses

## Implementation Steps

**NOTE:** Each step requires your explicit validation before proceeding to the next.

### Phase 1a: Market Data Foundation (Build & Learn First)

1. **Project Setup** - Initialize repo, folder structure, basic docs, knowledge base → **VALIDATE**
2. **Market Data MCP Core** - Build server, implement core tools (quote, historical, search, company info) → **VALIDATE**
3. **Market Data Learning Features** - Add explain_fundamental, compare_peers → **VALIDATE**
4. **Cursor Integration (Market Data)** - Add financial learning instructions and stock research prompts → **VALIDATE**
5. **Knowledge Base Setup** - Create initial structure with market data concepts → **VALIDATE**
6. **Test Market Data** - Explore stocks, learn fundamentals, document concepts → **CHECKPOINT VALIDATION**
7. **Documentation (Phase 1a)** - README for Market Data server, learning examples → **VALIDATE BEFORE PHASE 1b**

**Checkpoint: Market Data working, learned basic fundamentals, ready for portfolio tracking**

### Phase 1b: Portfolio Management (After Phase 1a Validated)

8. **Database Setup** - Docker Compose, schema (holdings, transactions, journal), migrations → **VALIDATE**
9. **Portfolio MCP Core** - Build server, implement core tools (holdings, transactions, performance) → **VALIDATE**
10. **Portfolio Learning Features** - Add journal, theses tracking, what-if scenarios → **VALIDATE**
11. **Cursor Integration (Portfolio)** - Add portfolio analysis prompts → **VALIDATE**
12. **End-to-End Test** - Add real portfolio, run complete analysis workflows → **CHECKPOINT VALIDATION**
13. **Documentation (Complete)** - Finalize README, LEARNING.md, USAGE.md with full examples → **FINAL VALIDATION**

## Technology Stack

- **Runtime**: Node.js 22.x LTS (latest stable release)
- **Package Manager**: pnpm 9.x (faster, more efficient than npm)
- **TypeScript**: 5.7.x with ES2022 target
- **MCP SDK**: `@modelcontextprotocol/sdk` latest (lock version after initial testing)
- **Database**: 
  - MariaDB 11.8 (Docker image: `mariadb:11.8`)
  - Driver: `mariadb` ^3.4.5 (official MariaDB Connector/Node.js, not mysql2)
  - Reason: Official driver with better performance, native Promises, full MariaDB feature support
- **Market Data Libraries**: 
  - `alphavantage` ^2.5.0 (Alpha Vantage API wrapper)
  - `yahoo-finance2` latest (Yahoo Finance fallback)
- **Build Tools**: `tsx` for running TypeScript directly during development
- **Testing**: Manual testing with real workflows initially, Vitest latest for future unit tests

## Phase 1 Deliverables

After Phase 1, you will be able to:

1. ✅ Track your portfolio in a local database
2. ✅ Add/remove holdings and record transactions
3. ✅ Get real-time quotes and historical data for any stock
4. ✅ Run portfolio analysis in Cursor with educational explanations
5. ✅ Calculate performance, gains/losses, and allocation
6. ✅ **Learn financial concepts** through hands-on analysis
7. ✅ **Document insights** and build your personal financial knowledge base
8. ✅ **Track investment theses** and learn from outcomes
9. ✅ **Run "what-if" scenarios** to understand risk and diversification

## Future Phases (After Phase 1 Works)

**Phase 2:** Fundamental Analysis (Deep Learning Focus)

- Financial statement analysis tools
- Ratio calculations with educational context
- Valuation models (DCF, multiples) with step-by-step guides
- Industry/sector analysis frameworks

**Phase 3:** Risk & Portfolio Theory

- Volatility and correlation (learn modern portfolio theory)
- Risk-adjusted returns (Sharpe, Sortino ratios)
- Diversification metrics and optimization
- Stress testing and scenario analysis

**Phase 4:** Advanced Research

- News sentiment analysis
- SEC filings research tools
- Analyst ratings and consensus tracking
- Technical analysis (optional)

**Phase 5:** Advanced Features

- Watchlists and alerts
- Historical portfolio snapshots
- Performance benchmarking vs indices
- Tax lot optimization

## Why This Learning-Focused Approach

- **Learn by Doing**: Real portfolio = real learning
- **Document Growth**: Knowledge base grows with your understanding
- **Understand WHY**: Not just metrics, but what they mean
- **Track Reasoning**: Journal helps learn from successes AND mistakes
- **Iterative Learning**: Each phase teaches new financial concepts
- **No Black Box**: Build tools yourself = deeper understanding
- **Your Pace**: Progress as you learn, no pressure
- **Real Impact**: Apply learnings to actual investments

## Recommended Learning Resources

**Books to Read During Each Phase:**

- Phase 1: "The Intelligent Investor" (Benjamin Graham), "A Random Walk Down Wall Street" (Burton Malkiel)
- Phase 2: "The Interpretation of Financial Statements" (Benjamin Graham)
- Phase 3: "The Little Book of Common Sense Investing" (John Bogle)

**Online Resources:**

- Investopedia (concepts reference)
- SEC EDGAR (reading filings)
- FINRA (regulatory info)
- Khan Academy Finance courses

### To-dos

- [ ] Initialize project structure, README, LEARNING.md, folder structure, and knowledge base template
- [ ] Create Docker Compose for MariaDB 11.8, design schema including journal tables, setup migrations
- [ ] Build Market Data MCP Server with Alpha Vantage, yfinance, and learning features (explain_fundamental, compare_peers)
- [ ] Build Portfolio Manager MCP Server with MariaDB integration and learning tools (journal, theses, what-if)
- [ ] Create learning-oriented .cursorrules and educational prompts (learn-concept, decode-financials, etc.)
- [ ] Setup knowledge base structure with initial content and learning resources guide
- [ ] Test complete learning workflow: add portfolio, run analysis, use learning prompts, document insights
- [ ] Complete README, LEARNING.md, USAGE.md with real examples and learning paths