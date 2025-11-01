# Quick Start Guide - Exploring FinX Market Data Tools

## Step-by-Step Tool Exploration

This guide will walk you through testing each of the 4 market data tools one by one.

---

## Prerequisites

1. **Build the server** (one time):
   ```bash
   pnpm build:market-data
   ```

2. **Configure Cursor MCP** (one time):
   
   Edit `~/.cursor/mcp.json` and add:
   ```json
   {
     "mcpServers": {
       "finx-market-data": {
         "command": "node",
         "args": [
           "/absolute/path/to/finx/dist/mcp-market-data/index.js"
         ],
         "env": {
           "ALPHA_VANTAGE_API_KEY": "YOUR_KEY_HERE"
         }
       }
     }
   }
   ```

   Or use the `.env` file approach (recommended):
   ```json
   {
     "mcpServers": {
       "finx-market-data": {
         "command": "npx",
         "args": [
           "tsx",
           "/absolute/path/to/finx/mcp-market-data/src/index.ts"
         ]
       }
     }
   }
   ```

3. **Restart Cursor** to load the MCP configuration

---

## Tool 1: Get Quote - Understanding Real-Time Prices

**What it does:** Fetches current stock price, daily change, volume, and basic metrics.

**Try these queries in Cursor:**

### Basic Usage
```
Get me a quote for Apple stock (AAPL)
```

**What to look for:**
- Current price
- Daily change ($ and %)
- Trading volume
- Market cap (if available)
- P/E ratio (if available)

### Learn by Comparing
```
Get quotes for AAPL, MSFT, and GOOGL
```

**Questions to explore:**
- Which stock moved more today (percentage)?
- How do their P/E ratios compare?
- What does the volume tell you about trading activity?

### Different Sectors
```
Get quotes for:
- Tech: AAPL
- Finance: JPM
- Healthcare: JNJ
- Energy: XOM
```

**Learning goals:**
- Understand sector differences
- Notice P/E ratio patterns by sector
- Compare volatility (daily changes)

---

## Tool 2: Get Historical Data - Analyzing Trends

**What it does:** Retrieves historical price data for trend analysis.

**Try these queries:**

### Short-term View
```
Show me Apple's price history over the last week
```

**What to look for:**
- Day-to-day price movement
- Trading volume patterns
- High/low ranges

### Medium-term Trends
```
Get historical data for MSFT over the past 6 months
```

**Questions to explore:**
- Is the stock trending up or down?
- Are there any major jumps or drops?
- How does volume correlate with price changes?

### Compare Time Periods
```
Show me Tesla's price for:
1. The last month
2. The last year
```

**Learning goals:**
- Understand short-term vs long-term trends
- Identify support/resistance levels
- Recognize volatility patterns

---

## Tool 3: Search Symbol - Finding Stocks

**What it does:** Finds ticker symbols by company name.

**Try these queries:**

### Find a Company
```
What's the ticker symbol for Microsoft?
```

### Discover Related Companies
```
Search for companies with "Tesla" in the name
```

**What you'll find:**
- Primary listing (e.g., TSLA on NASDAQ)
- International listings (e.g., Frankfurt, XETRA)
- Related companies

### Explore an Industry
```
Search for companies named:
- "Bank"
- "Oil"
- "Pharma"
```

**Learning goals:**
- Understand multiple listings
- Discover competitors
- Learn ticker symbol conventions

---

## Tool 4: Get Company Info - Deep Fundamental Analysis

**What it does:** Provides comprehensive company fundamentals and financial metrics.

**Try these queries:**

### Basic Company Overview
```
Give me detailed information about Apple (AAPL)
```

**What to look for:**
- Business description
- Sector and industry classification
- Market capitalization

### Financial Health Metrics
```
What are Microsoft's key financial metrics?
```

**Key metrics to understand:**

**Valuation:**
- **P/E Ratio**: Price-to-Earnings (what you pay for $1 of earnings)
- **P/B Ratio**: Price-to-Book (stock price vs book value)
- **Dividend Yield**: Annual dividend as % of stock price

**Profitability:**
- **Profit Margin**: Net income as % of revenue
- **Operating Margin**: Operating income as % of revenue
- **ROE**: Return on Equity (how well company uses shareholder money)
- **ROA**: Return on Assets (how efficiently company uses assets)

**Financial Health:**
- **Debt-to-Equity**: How much debt vs equity
- **Current Ratio**: Can company pay short-term obligations?

**Growth:**
- **Revenue Growth**: Year-over-year revenue increase
- **Earnings Growth**: Year-over-year earnings increase

### Compare Companies in Same Sector
```
Compare the fundamentals of:
1. Apple (AAPL)
2. Microsoft (MSFT)
3. Google (GOOGL)
```

**Questions to explore:**
- Who has the highest P/E ratio? Why?
- Who is most profitable (profit margin)?
- Who has the best ROE?
- Who is growing faster?

### Different Investment Styles

**Value Investing (look for low valuations):**
```
Get company info for JPM (bank with lower P/E)
```
Look for: Low P/E, high dividend yield, strong balance sheet

**Growth Investing (look for high growth):**
```
Get company info for NVDA (high-growth tech)
```
Look for: High revenue/earnings growth, high P/E might be justified

**Quality Investing (look for strong fundamentals):**
```
Get company info for JNJ (consistent quality)
```
Look for: High ROE, low debt, consistent margins

---

## Exploration Exercise: Build Your First Analysis

### Exercise 1: Single Stock Deep Dive

Pick a stock you're interested in (e.g., AAPL):

1. **Get current quote** → Understand current price and sentiment
2. **Get company info** → Understand the business and metrics
3. **Get historical data (1 year)** → See the trend
4. **Document your findings** in `.cursor/knowledge/journal/YYYY-MM-DD-[company]-analysis.md`

**Questions to answer:**
- What does the company do?
- Is it expensive or cheap compared to sector?
- Is it trending up or down?
- What are the key risks you see?
- Would you invest? Why or why not?

### Exercise 2: Sector Comparison

Pick a sector (e.g., Technology):

1. **Search for 3-5 companies** in that sector
2. **Get quotes** for each
3. **Get company info** for each
4. **Compare their metrics** side by side

**Questions to answer:**
- Which has the best P/E ratio?
- Which is most profitable?
- Which is growing fastest?
- Which would you choose and why?

### Exercise 3: Build Your Watchlist

Create a file: `.cursor/knowledge/my-watchlist.md`

For each stock you're interested in:
- Symbol and company name
- Why it interests you
- Key metrics you're watching
- What would make you buy/sell

---

## Tips for Learning

### 1. Start Small
- Don't try to understand everything at once
- Focus on one metric at a time
- Use Investopedia to look up unfamiliar terms

### 2. Document Everything
- Write down what you learn in `.cursor/knowledge/`
- Journal your thought process
- Track your predictions vs outcomes

### 3. Ask Questions
When you see a metric you don't understand, ask Cursor:
```
What does P/E ratio mean? Explain it with an example using Apple.
```

### 4. Compare and Contrast
The best way to learn is by comparison:
- Same sector, different companies
- Same company, different time periods
- Different sectors, same metric

### 5. Use the Knowledge Base
After each analysis session:
1. Document new concepts you learned
2. Add terms to your glossary
3. Journal interesting findings
4. Build your frameworks

---

## Common Queries to Try

### For Daily Market Check
```
Get quotes for my watchlist: AAPL, MSFT, GOOGL, TSLA, NVDA
```

### For Research
```
I'm interested in [COMPANY]. Give me:
1. Current quote
2. Company fundamentals
3. 6-month price history
```

### For Learning
```
Compare these two companies:
[COMPANY A] vs [COMPANY B]

Focus on:
- Valuation (P/E, P/B)
- Profitability (margins, ROE)
- Growth rates
```

### For Documentation
```
Help me document what I learned about P/E ratio today, 
with examples from Apple and Microsoft
```

---

## Next Steps After Exploration

Once you're comfortable with these tools:

1. ✅ You'll understand basic financial metrics
2. ✅ You'll have documented several concepts
3. ✅ You'll have a watchlist of interesting stocks
4. ✅ You're ready to use the advanced learning features

**Advanced features available:**
- `explain_fundamental()` - Get educational explanations of any metric
- `compare_peers()` - Automated peer comparison analysis

Explore and learn with these powerful tools! 🚀

---

## Troubleshooting

### Server Not Responding
```bash
# Check if server is running
pnpm dev:market-data

# If issues, rebuild
pnpm build:market-data
```

### API Key Issues
- Verify `.env` file has `ALPHA_VANTAGE_API_KEY=your_key`
- Restart Cursor after changing config
- Check stderr output for connection messages

### Rate Limits
- Alpha Vantage: 25 calls/day, 5/minute
- The system will automatically fall back to Yahoo Finance
- Cached data is reused for 5 minutes (quotes) or 24 hours (company info)

---

Happy exploring! 📈📊💡

