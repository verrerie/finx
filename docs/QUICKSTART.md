# Quick Start Guide

Get started exploring FinX market data tools in minutes.

## Prerequisites

1. **Build the servers** (one time):
   ```bash
   pnpm build
   ```

2. **Configure Cursor MCP** (see main [README.md](../README.md) for full setup)

3. **Restart Cursor** to load MCP servers

---

## Tool 1: Get Quote

Get current stock price, daily change, volume, and basic metrics.

**Try these:**
```
Get me a quote for Apple stock (AAPL)
Get quotes for AAPL, MSFT, and GOOGL
Get quotes for: AAPL (Tech), JPM (Finance), JNJ (Healthcare)
```

**What to look for:** Price, daily change, volume, P/E ratio, sector comparison

---

## Tool 2: Get Historical Data

Analyze price trends over any time period.

**Try these:**
```
Show me Apple's price history over the last week
Get historical data for MSFT over the past 6 months
Show me Tesla's price for the last month and year
```

**Periods:** `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `2y`, `5y`, `max`

---

## Tool 3: Search Symbol

Find ticker symbols by company name.

**Try these:**
```
What's the ticker symbol for Microsoft?
Search for companies with "Tesla" in the name
Search for companies named "Bank" or "Pharma"
```

**Useful for:** Finding correct tickers, discovering competitors, exploring industries

---

## Tool 4: Get Company Info

Comprehensive company fundamentals and financial metrics.

**Try these:**
```
Give me detailed information about Apple (AAPL)
What are Microsoft's key financial metrics?
Compare the fundamentals of AAPL, MSFT, and GOOGL
```

**Key metrics:**
- **Valuation:** P/E ratio, P/B ratio, dividend yield
- **Profitability:** Profit margin, operating margin, ROE, ROA
- **Financial Health:** Debt-to-equity, current ratio
- **Growth:** Revenue growth, earnings growth

**Investment styles:** Value (low P/E), Growth (high growth), Quality (strong fundamentals)

---

## Practice Exercises

### Exercise 1: Single Stock Analysis
1. Get quote for a stock (e.g., AAPL)
2. Get company info
3. Get 1-year historical data
4. Document findings in `.cursor/knowledge/journal/`

**Questions:** What does the company do? Is it expensive/cheap? What are the risks?

### Exercise 2: Sector Comparison
1. Search for 3-5 companies in a sector
2. Get quotes and company info for each
3. Compare metrics side-by-side

**Questions:** Best P/E? Most profitable? Fastest growth? Which would you choose?

### Exercise 3: Build Your Watchlist
Create `.cursor/knowledge/my-watchlist.md` with stocks you're researching.

---

## Learning Tips

**Start Small:** Focus on one metric at a time  
**Document Everything:** Write down what you learn in `.cursor/knowledge/`  
**Ask Questions:** Use `explain_fundamental()` to learn metrics  
**Compare:** Same sector different companies, same company different periods  
**Use Knowledge Base:** Document concepts, journal findings, build frameworks

---

## Common Queries

```
Get quotes for my watchlist: AAPL, MSFT, GOOGL, TSLA, NVDA
I'm interested in [COMPANY]. Give me quote, fundamentals, and 6-month history
Compare [COMPANY A] vs [COMPANY B] focusing on valuation and profitability
What does P/E ratio mean? Explain with an example using Apple
```

---

## Advanced Features

- `explain_fundamental()` - Educational explanations of metrics
- `compare_peers()` - Automated peer comparison analysis

## Troubleshooting

**Server not responding:** Run `pnpm build` to rebuild  
**API key issues:** Check `.env` file and restart Cursor  
**Rate limits:** Alpha Vantage free tier: 25 calls/day. System auto-falls back to Yahoo Finance.

See [USAGE.md](./USAGE.md) for complete documentation.

