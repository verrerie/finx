# FinX Usage Guide

Complete reference for all FinX MCP tools with essential examples.

## 📖 Table of Contents

- [Market Data Tools](#market-data-tools)
- [Portfolio Management Tools](#portfolio-management-tools)
- [Learning & Research Tools](#learning--research-tools)
- [Complete Workflows](#complete-workflows)
- [Best Practices](#best-practices)

---

## Market Data Tools

### `get_quote` - Current Stock Quote

Get current price, daily change, volume, and basic metrics.

**Use when:** Quick price lookups, checking daily performance

**Example:**
```
Get quote for Apple (AAPL)
```

**Returns:** Price, change %, volume, market cap, P/E ratio, 52-week range

---

### `get_historical_data` - Price History

Retrieve historical price data for trend analysis.

**Use when:** Analyzing trends, understanding volatility, comparing periods

**Example:**
```
Get historical data for MSFT over the past year
```

**Periods:** `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `2y`, `5y`, `max`

**Returns:** Daily OHLC data, volume, summary statistics (return %, high, low)

---

### `search_symbol` - Find Ticker Symbols

Search for company ticker symbols by name.

**Use when:** Don't know ticker, finding international stocks, checking share classes

**Example:**
```
Search for Tesla ticker symbol
```

**Returns:** Symbol, company name, region, currency, match score

---

### `get_company_info` - Company Fundamentals

Get comprehensive financial metrics and company information.

**Use when:** Deep research, fundamental analysis, comparing metrics

**Example:**
```
Get company info for NVIDIA (NVDA)
```

**Returns:** 
- **Valuation:** P/E, P/B, PEG, dividend yield
- **Profitability:** Margins, ROE, ROA
- **Financial Health:** Debt-to-equity, current ratio
- **Growth:** Revenue/earnings growth rates

---

### `explain_fundamental` - Learn Financial Metrics

Educational explanations of financial metrics with examples.

**Use when:** Learning what a metric means, understanding interpretation

**Example:**
```
Explain what P/E ratio means with examples
```

**Available metrics:** `pe_ratio`, `roe`, `profit_margin`, `debt_to_equity`, `dividend_yield`, `market_cap`, and 20+ more

**Returns:** Definition, formula, interpretation guide, typical ranges, red flags, related metrics

---

### `compare_peers` - Peer Comparison

Compare companies within the same sector.

**Use when:** Understanding competitive positioning, finding industry leaders, spotting outliers

**Example:**
```
Compare Coca-Cola to its competitors in the beverage sector
```

**Returns:** Side-by-side comparison of key metrics with insights (leader by profitability, growth, etc.)

---

## Portfolio Management Tools

### `create_portfolio` - Create Portfolio

Create a new investment portfolio to track.

**Example:**
```
Create a portfolio named "Growth Portfolio" with description "Long-term tech focus"
```

**Returns:** Portfolio ID, name, description, currency, creation date

---

### `list_portfolios` - View All Portfolios

See all portfolios with summary statistics.

**Returns:** List of portfolios with holdings count, total cost, creation date

---

### `get_portfolio` - Portfolio Details

Get detailed information about a specific portfolio.

**Returns:** Portfolio metadata, creation/update dates

---

### `get_holdings` - View Positions

See all current holdings in a portfolio.

**Returns:** Symbol, quantity, average cost, total cost, purchase dates

**Key fields:**
- `quantity`: Total shares owned
- `average_cost`: Cost basis (for tax purposes)
- `total_cost`: Total invested

---

### `add_transaction` - Record Buy/Sell

Record investment transactions (automatically updates holdings).

**Transaction types:** `BUY`, `SELL`, `DIVIDEND`, `SPLIT`, `TRANSFER_IN`, `TRANSFER_OUT`

**Example (Buy):**
```
Add transaction: Buy 10 shares of NVDA @ $475.00 on 2025-01-15
```

**Example (Sell):**
```
Add transaction: Sell 5 shares of NVDA @ $500.00 on 2025-02-01
```

**Important:** Average cost calculated automatically using FIFO. Fees added to cost basis for buys, subtracted from proceeds for sells.

---

### `get_transactions` - Transaction History

View transaction history for a portfolio.

**Use cases:** Tax reporting, performance attribution, audit trail

**Returns:** Chronological list of all transactions with details

---

### `calculate_performance` - Portfolio Returns

Calculate portfolio and position-level performance.

**Example:**
```
Calculate performance for portfolio "abc123" with current prices:
- AAPL: $185.50
- MSFT: $395.20
- NVDA: $485.00
```

**Returns:**
- Portfolio summary: Total cost, current value, gain/loss ($ and %)
- Position details: Each holding with unrealized gains/losses, portfolio weight

**Key metrics:**
- Total return: Overall portfolio performance
- Position weights: Ensure no overconcentration
- Unrealized gains: Tax planning considerations

---

### `delete_portfolio` - Remove Portfolio

Delete a portfolio and all related data.

**⚠️ Warning:** This action cannot be undone!

---

## Learning & Research Tools

### `add_to_watchlist` - Track Research Candidates

Add stocks to watchlist for monitoring and research.

**Use when:** Found interesting company but not ready to buy, tracking prices, setting buy targets

**Example:**
```
Add TSLA to watchlist with target price $180, priority HIGH
```

**Priorities:** `HIGH` (check daily), `MEDIUM` (check weekly), `LOW` (long-term monitoring)

**Best practices:** Document WHY you're watching, set specific price targets, include thesis/concerns

---

### `get_watchlist` - View Watchlist

See all stocks you're monitoring.

**Returns:** Symbol, notes, target price, priority, creation date

---

### `update_watchlist_item` - Update Notes/Targets

Update research notes or target prices as you learn more.

**Use when:** Price targets change, thesis evolves, new information discovered

---

### `remove_from_watchlist` - Remove Stock

Remove stock from watchlist (thesis broken or purchased).

---

### `create_thesis` - Document Investment Rationale

Formally document why you own (or want to own) a stock.

**Use when:** Before making purchase, clarifying thinking, reviewing later

**Example:**
```
Create thesis for NVDA:
- Thesis: "AI chip market leader with 80%+ share, data center revenue growing 200%+"
- Bull case: Market leader, new products, CUDA moat
- Bear case: High valuation, competition, cyclical business
- Target allocation: 10%
- Review date: 2025-04-15
```

**Components:**
1. **Thesis** (2-3 sentences): What company does, why it will succeed, timeframe
2. **Bull Case** (3-5 points): Reasons to outperform, competitive advantages, catalysts
3. **Bear Case** (3-5 points): Risks, threats, valuation concerns
4. **Target Allocation**: What % of portfolio
5. **Review Date**: When to reassess

---

### `get_theses` - View All Theses

See all documented investment rationales.

**Statuses:** `ACTIVE` (holding/buying), `MONITORING` (watching), `EXITED` (sold), `INVALIDATED` (thesis broke)

---

### `get_thesis` - View Specific Thesis

Get detailed thesis for a single stock.

---

### `update_thesis` - Revise Thesis

Update thesis as market conditions or understanding changes.

**When to update:** Quarterly reviews, after earnings, major announcements, price movements, competitive changes

---

### `delete_thesis` - Remove Thesis

Delete thesis (usually after exiting position).

---

### `analyze_what_if` - Scenario Analysis

Model the impact of a trade BEFORE executing it.

**Use when:** Before buying/selling, understanding portfolio impact, tax planning

**Example (Buy):**
```
What if I buy 20 shares of AMD @ $145.00?
```

**Example (Sell):**
```
What if I sell all 10 shares of NVDA @ $500.00?
```

**Returns:**
- Current position details
- After-transaction impact (new quantities, costs, weights)
- Portfolio impact (cash required/available, position weights)
- Tax implications (for sells)

**Benefits:** See exact portfolio impact before acting, make informed decisions, avoid surprises

---

## Complete Workflows

### Workflow 1: Research → Invest

1. **Find Symbol:** `search_symbol("Nvidia")` → NVDA
2. **Quick Overview:** `get_quote("NVDA")` → Price, P/E
3. **Deep Research:** `get_company_info("NVDA")` → All metrics
4. **Compare:** `compare_peers("NVDA")` → vs competitors
5. **Learn:** `explain_fundamental("peg_ratio")` → Understand metrics
6. **Watchlist:** `add_to_watchlist()` → Track with target price
7. **Thesis:** `create_thesis()` → Document rationale
8. **What-If:** `analyze_what_if()` → Model purchase impact
9. **Execute:** `add_transaction()` → Record buy
10. **Document:** Update journal in `.cursor/knowledge/journal/`

---

### Workflow 2: Monthly Portfolio Review

1. **Get Holdings:** `get_holdings()` → See all positions
2. **Calculate Performance:** `calculate_performance()` → Returns, gains/losses
3. **Review Theses:** `get_theses()` → Check review dates
4. **Check Watchlist:** `get_watchlist()` → Any hit targets?
5. **Review Transactions:** `get_transactions()` → What did I buy/sell?
6. **Document:** Create monthly review in journal

---

### Workflow 3: Position Evaluation (Should I Sell?)

1. **Review Position:** `get_holdings()` → Current loss: -20%
2. **Check Fundamentals:** `get_company_info()` → Metrics still strong?
3. **Review Thesis:** `get_thesis()` → Is thesis intact?
4. **Compare Peers:** `compare_peers()` → Underperforming peers?
5. **Analyze Scenarios:**
   - `analyze_what_if("SELL")` → Impact of selling
   - `analyze_what_if("BUY")` → Impact of averaging down
6. **Make Decision:** Thesis broken → SELL, Thesis intact → HOLD/BUY
7. **Document:** Update journal with reasoning
8. **Execute:** `add_transaction()` if buying more
9. **Update Thesis:** `update_thesis()` if needed

---

## Best Practices

### General Principles

1. **Document Everything:** Every decision needs written rationale, use notes fields, maintain theses
2. **Use What-If Before Acting:** Never buy/sell without scenario analysis, understand impact
3. **Review Regularly:** Weekly (watchlist), Monthly (performance), Quarterly (theses)
4. **Learn from Everything:** Winners (what worked?), Losers (what missed?), Market moves
5. **Stay Organized:** One portfolio per strategy, clear naming, regular knowledge base updates

### Research Best Practices

1. **Start Broad, Then Go Deep:** Quick look → Full picture → Context → Learning
2. **Always Compare:** Never analyze in isolation, compare to peers/history/portfolio
3. **Question Everything:** High margin (why? sustainable?), Fast growth (from where?), Low valuation (what's wrong?)

### Portfolio Management

1. **Position Sizing:** No position >20% at entry, Top conviction: 10-15%, Medium: 5-10%, Low: 2-5%
2. **Diversification:** Across sectors, company sizes, business models (but don't over-diversify)
3. **Rebalancing:** When position >25%, when thesis changes, when better opportunities arise
4. **Tax Awareness:** Long-term > short-term gains, tax-loss harvesting, consider timing

### Learning Best Practices

1. **Concepts Before Companies:** Understand metrics first, then apply to companies
2. **Depth Over Breadth:** 3 companies deeply > 30 superficially
3. **Document Your Journey:** Track learning, note insights, review past analyses
4. **Embrace Mistakes:** You will be wrong, that's how you learn, document why

---

## Getting Help

1. **Use Learning Prompts:** `.cursor/prompts/learn-concept.md`, `decode-financials.md`, `analyze-portfolio.md`
2. **Ask the AI:** "Can you explain [concept]?", "Why would [metric] be high?", "What should I look for?"
3. **Check Knowledge Base:** Review `.cursor/knowledge/glossary.md`, example analyses, concept docs
4. **Consult Professionals:** Tax → CPA, Financial planning → CFP, Large decisions → Financial Advisor

---

## Remember

**This is a learning tool, not a get-rich-quick scheme.**

- Focus on process, not outcome
- Build skills systematically
- Learn from wins and losses
- Be patient with yourself
- Enjoy the journey

**The goal:** Become a better investor by developing good habits, systematic thinking, and deep understanding of businesses and markets.

Good luck! 🚀📈