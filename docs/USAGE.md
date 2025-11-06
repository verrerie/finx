# FinX Usage Guide

Complete reference for all FinX MCP tools with essential examples.

## 📖 Table of Contents

- [Market Data Tools](#market-data-tools)
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

## Learning & Research Tools

---

## Complete Workflows

### Workflow 1: Research

1. **Find Symbol:** `search_symbol("Nvidia")` → NVDA
2. **Quick Overview:** `get_quote("NVDA")` → Price, P/E
3. **Deep Research:** `get_company_info("NVDA")` → All metrics
4. **Compare:** `compare_peers("NVDA")` → vs competitors
5. **Learn:** `explain_fundamental("peg_ratio")` → Understand metrics
6. **Document:** Update journal in `.cursor/knowledge/journal/`

---

## Best Practices

### General Principles

1. **Document Everything:** Every decision needs written rationale, use notes fields, maintain theses
2. **Review Regularly:** Weekly (watchlist), Monthly (performance), Quarterly (theses)
3. **Learn from Everything:** Winners (what worked?), Losers (what missed?), Market moves

### Research Best Practices

1. **Start Broad, Then Go Deep:** Quick look → Full picture → Context → Learning
2. **Always Compare:** Never analyze in isolation, compare to peers/history
3. **Question Everything:** High margin (why? sustainable?), Fast growth (from where?), Low valuation (what's wrong?)


### Learning Best Practices

1. **Concepts Before Companies:** Understand metrics first, then apply to companies
2. **Depth Over Breadth:** 3 companies deeply > 30 superficially
3. **Document Your Journey:** Track learning, note insights, review past analyses
4. **Embrace Mistakes:** You will be wrong, that's how you learn, document why

---

## Getting Help

1. **Use Learning Prompts:** `.cursor/prompts/learn-concept.md`, `decode-financials.md`
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