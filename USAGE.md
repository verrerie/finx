# Usage Guide - FinX Financial AI Agent

## 📖 Overview

This guide provides detailed instructions for using the FinX system. For learning philosophy and educational content, see [LEARNING.md](./LEARNING.md).

## 🏃 Getting Started

### Initial Setup

1. **Install dependencies:**
```bash
pnpm install
```

2. **Get Alpha Vantage API Key:**
   - Visit [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
   - Sign up for a free account
   - Copy your API key

3. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` and add your API key:
```
ALPHA_VANTAGE_API_KEY=YOUR_KEY_HERE
EXPLANATION_LEVEL=detailed
```

4. **Build the Market Data server:**
```bash
pnpm build:market-data
```

5. **Configure Cursor MCP:**

Edit `~/.cursor/mcp.json` (create if doesn't exist):
```json
{
  "mcpServers": {
    "finx-market-data": {
      "command": "node",
      "args": [
        "/Users/verrerie/git/finx/dist/mcp-market-data/src/index.js"
      ],
      "env": {
        "ALPHA_VANTAGE_API_KEY": "YOUR_KEY_HERE"
      }
    }
  }
}
```

6. **Restart Cursor** to load the MCP server.

## 🔧 Phase 1a: Market Data Tools

### Available Tools

#### `get_quote(symbol: string)`

Get current stock price and basic metrics.

**Example usage in Cursor:**
```
Get me a quote for Apple stock
```

or

```
What's the current price and P/E ratio for AAPL?
```

**Returns:**
- Current price
- Daily change ($ and %)
- Volume
- Market cap
- P/E ratio
- 52-week high/low

---

#### `get_historical_data(symbol: string, period: string)`

Get historical price data.

**Parameters:**
- `symbol`: Stock ticker (e.g., "AAPL")
- `period`: Time period - "1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "max"

**Example usage:**
```
Show me Apple's stock price over the last year
```

or

```
Get historical data for MSFT for the past 6 months
```

**Returns:**
- Date-by-date closing prices
- Volume data
- High/low ranges

---

#### `search_symbol(query: string)`

Search for stock ticker symbols.

**Example usage:**
```
What's the ticker symbol for Microsoft?
```

or

```
Find stock symbols for Tesla
```

**Returns:**
- Matching ticker symbols
- Company names
- Exchange information

---

#### `get_company_info(symbol: string)`

Get comprehensive company fundamentals.

**Example usage:**
```
Give me detailed information about Apple's fundamentals
```

or

```
What are the key financial metrics for TSLA?
```

**Returns:**
- Company description
- Sector and industry
- Market cap
- Revenue and earnings
- Financial ratios (P/E, P/B, ROE, ROA, etc.)
- Debt levels
- Dividend information
- 52-week range

---

#### `explain_fundamental(symbol: string, metric: string)`

Get an educational explanation of a specific financial metric for a company.

**Example usage:**
```
Explain Apple's P/E ratio to me
```

or

```
What does Tesla's debt-to-equity ratio mean?
```

**Returns:**
- What the metric is
- Current value for the company
- What it means in context
- Industry comparison
- Why it matters

---

#### `compare_peers(symbol: string, sector?: string)`

Compare a company with similar companies in its sector.

**Example usage:**
```
Compare Apple with other tech companies
```

or

```
Show me how Ford compares to other auto manufacturers
```

**Returns:**
- Side-by-side comparison of key metrics
- Sector averages
- Relative valuation analysis
- Educational context about differences

## 🎯 Common Workflows

### Workflow 1: Research a Single Stock

1. **Get basic info:**
```
Get me a quote for AAPL
```

2. **Deep dive into fundamentals:**
```
Give me detailed company information for AAPL
```

3. **Understand specific metrics:**
```
Explain Apple's P/E ratio
Explain Apple's ROE
```

4. **See historical performance:**
```
Show me AAPL's price history over the past year
```

5. **Document your learning:**
   - Create `knowledge/journal/2025-10-26-apple-research.md`
   - Note key findings and questions

### Workflow 2: Compare Companies

1. **Identify peers:**
```
Compare Apple with other tech companies
```

2. **Get details on interesting peers:**
```
Get company info for MSFT
Get company info for GOOGL
```

3. **Analyze differences:**
```
Why does Apple have a higher P/E ratio than Microsoft?
```

4. **Document insights:**
   - Add findings to `knowledge/concepts/`
   - Update your watchlist

### Workflow 3: Sector Analysis

1. **Pick a sector** (e.g., Technology)

2. **Research major players:**
```
Compare AAPL with tech sector
Get info on MSFT
Get info on GOOGL
Get info on META
```

3. **Understand sector characteristics:**
```
Why do tech stocks typically have high P/E ratios?
What's normal for gross margins in the tech sector?
```

4. **Document sector knowledge:**
   - Create `knowledge/frameworks/tech-sector-analysis.md`

### Workflow 4: Build a Watchlist

1. **Research multiple stocks in detail**

2. **For each stock, document:**
   - Why it's interesting
   - Key metrics
   - Concerns or questions
   - Investment thesis

3. **Create:**
```
knowledge/watchlist.md
```

Example content:
```markdown
# My Investment Watchlist

## Apple (AAPL)
- **Why interesting:** Strong brand, services growth
- **P/E:** 30.5 (high but justified by growth?)
- **Concerns:** High valuation, China dependency
- **Thesis:** Services segment underappreciated
- **Research date:** 2025-10-26

## Microsoft (MSFT)
...
```

## 💡 Using Cursor Prompts (Coming in Next Steps)

Once we add the `.cursor/prompts/`, you'll be able to use:

- **Research Stock Prompt** - Guided deep-dive into a company
- **Learn Concept Prompt** - Educational deep-dive into a financial concept
- **Compare Stocks Prompt** - Side-by-side comparison workflow
- **Decode Financials Prompt** - Step-by-step financial statement analysis

## 📊 Best Practices

### 1. Use Learning Mode
The system is designed for education. Always ask for explanations:

**Good:** "Explain Apple's P/E ratio and why it's higher than the sector average"
**Less Good:** "What's Apple's P/E?"

### 2. Document Everything
Your knowledge base is your most valuable asset:
- Journal every research session
- Document concepts as you learn them
- Build a glossary of terms
- Track your investment theses

### 3. Start Broad, Then Deep
- Begin with `get_quote()` for overview
- Move to `get_company_info()` for details
- Use `explain_fundamental()` for education
- End with `compare_peers()` for context

### 4. Question the Data
- Why is this metric high/low?
- How does it compare to competitors?
- What's the historical trend?
- What might change in the future?

### 5. Cross-Reference
Don't rely solely on this tool:
- Check company investor relations sites
- Read recent news
- Look at SEC filings
- Verify with multiple sources

## 🚨 Rate Limits & Quotas

### Alpha Vantage Free Tier
- **25 API calls per day**
- **5 API calls per minute**

The system implements:
- Automatic rate limiting
- In-memory caching (5 minutes for quotes)
- Fallback to Yahoo Finance when possible

**Tips to stay within limits:**
- Cache results locally for your research
- Use Yahoo Finance fallback when available
- Spread research across multiple days
- Consider upgrading to paid tier for heavy use

## 🔧 Troubleshooting

### MCP Server Not Connecting

1. **Check Cursor console:**
   - Open Cursor
   - View → Developer Tools → Console
   - Look for MCP connection errors

2. **Verify paths:**
   - Ensure `~/.cursor/mcp.json` has correct absolute paths
   - Check that `dist/` directory exists after build

3. **Rebuild:**
```bash
pnpm build:market-data
```

4. **Restart Cursor**

### API Key Issues

**Error: "Invalid API key"**
- Check `.env` file has correct key
- Verify `~/.cursor/mcp.json` has correct key in env section
- Restart Cursor after changes

**Error: "Rate limit exceeded"**
- You've hit daily/minute limits
- Wait and try again
- System will automatically use Yahoo Finance fallback

### Data Not Available

**Error: "Symbol not found"**
- Verify ticker symbol is correct
- Use `search_symbol()` to find correct symbol
- Some international stocks may not be available

**Error: "Data temporarily unavailable"**
- API service may be down
- System will try fallback source
- Try again in a few minutes

## 📱 Coming in Phase 1b

### Portfolio Management Tools

Once Phase 1b is complete, you'll be able to:

- Track actual holdings
- Record buy/sell transactions
- Calculate portfolio performance
- Analyze asset allocation
- Journal investment decisions
- Track investment theses over time
- Run "what-if" scenarios

## 🆘 Getting Help

1. **Check documentation:**
   - README.md - Overview and setup
   - LEARNING.md - Educational guidance
   - This file - Detailed usage

2. **Review your knowledge base:**
   - Check if you've documented this before
   - Review similar concepts

3. **Consult external resources:**
   - Investopedia for concept definitions
   - SEC EDGAR for official filings
   - Company investor relations sites

## ⚠️ Important Disclaimers

- **Not Financial Advice:** This tool is for education only
- **Do Your Own Research:** Always verify information from multiple sources
- **Risk Warning:** All investments carry risk
- **Consult Professionals:** Consider talking to a financial advisor for serious decisions
- **Data Accuracy:** Market data may have delays or errors

## 🚀 Next Steps

1. Complete initial setup above
2. Research 3-5 stocks you're interested in
3. Document learnings in `knowledge/`
4. Build your watchlist
5. Move to Phase 1b when ready

Happy learning! 📈

