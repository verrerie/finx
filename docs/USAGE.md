# FinX Usage Guide

Complete reference for using all FinX MCP tools with real-world examples and workflows.

## 📖 Table of Contents

- [Market Data Tools](#market-data-tools)
- [Portfolio Management Tools](#portfolio-management-tools)
- [Learning & Research Tools](#learning--research-tools)
- [Complete Workflows](#complete-workflows)
- [Best Practices](#best-practices)

---

## Market Data Tools

### 1. `get_quote` - Get Current Stock Quote

**Purpose:** Retrieve current price and key metrics for a stock.

**When to Use:**
- Quick price lookups
- Checking daily performance
- Getting basic valuation metrics

**Example Usage:**
```typescript
get_quote({ symbol: "AAPL" })
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "price": 185.50,
    "change": 2.50,
    "change_percent": 1.37,
    "volume": 52847103,
    "market_cap": 2895000000000,
    "pe_ratio": 30.25,
    "day_high": 186.20,
    "day_low": 183.15,
    "year_high": 199.62,
    "year_low": 124.17,
    "updated_at": "2025-01-15T16:00:00Z"
  }
}
```

**What to Look For:**
- **Price vs 52-week range**: Is it near highs or lows?
- **P/E ratio**: Compared to historical average and peers
- **Volume**: Is trading activity normal or unusual?
- **Percent change**: Daily volatility context

**Real-World Example:**
```
"What's Apple's current stock price and how does it compare to its yearly range?"

AI uses get_quote("AAPL") and explains:
- Current price: $185.50
- Near middle of 52-week range ($124-$200)
- P/E of 30.25 is above historical average
- Volume suggests normal trading day
```

---

### 2. `get_historical_data` - Price History

**Purpose:** Retrieve historical price data for trend analysis.

**When to Use:**
- Analyzing price trends
- Understanding volatility
- Comparing performance periods
- Creating charts

**Example Usage:**
```typescript
get_historical_data({ 
  symbol: "MSFT", 
  period: "1y"  // 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, max
})
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "MSFT",
    "period": "1y",
    "data_points": 252,
    "prices": [
      {
        "date": "2024-01-15",
        "open": 367.50,
        "high": 370.25,
        "low": 365.10,
        "close": 368.75,
        "volume": 21500000
      },
      // ... more data points
    ],
    "summary": {
      "start_price": 368.75,
      "end_price": 395.20,
      "return_percent": 7.17,
      "high": 420.50,
      "low": 325.10
    }
  }
}
```

**What to Analyze:**
- **Trend**: Is price generally rising, falling, or flat?
- **Volatility**: How much does it fluctuate?
- **Support/Resistance**: Price levels it tends to bounce from
- **Volume patterns**: When do people trade most?

**Real-World Example:**
```
"Show me Microsoft's performance over the last year and analyze the trend"

AI uses get_historical_data("MSFT", "1y") and provides:
- Up 7.17% over the period
- High volatility in Q2 2024
- Strong uptrend since October
- Price currently near 52-week high
```

---

### 3. `search_symbol` - Find Stock Tickers

**Purpose:** Search for company ticker symbols by name.

**When to Use:**
- Don't know the ticker symbol
- Finding international stocks
- Checking multiple share classes

**Example Usage:**
```typescript
search_symbol({ query: "Tesla" })
```

**Example Response:**
```json
{
  "success": true,
  "results": [
    {
      "symbol": "TSLA",
      "name": "Tesla, Inc.",
      "type": "Equity",
      "region": "United States",
      "currency": "USD",
      "match_score": 1.0
    }
  ]
}
```

**Tips:**
- Search by company name or partial ticker
- Pay attention to region (US vs international)
- Check currency for international stocks
- Some companies have multiple share classes (e.g., GOOGL vs GOOG)

---

### 4. `get_company_info` - Comprehensive Fundamentals

**Purpose:** Get detailed financial metrics and company information.

**When to Use:**
- Deep company research
- Fundamental analysis
- Comparing multiple metrics
- Understanding business model

**Example Usage:**
```typescript
get_company_info({ symbol: "NVDA" })
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "NVDA",
    "company_name": "NVIDIA Corporation",
    "sector": "Technology",
    "industry": "Semiconductors",
    "description": "NVIDIA Corporation designs graphics processing units...",
    
    "market_metrics": {
      "market_cap": 1250000000000,
      "enterprise_value": 1225000000000,
      "shares_outstanding": 2480000000,
      "float_shares": 2450000000
    },
    
    "valuation": {
      "pe_ratio": 65.5,
      "forward_pe": 45.2,
      "peg_ratio": 1.8,
      "price_to_book": 22.5,
      "price_to_sales": 28.5,
      "ev_to_ebitda": 55.3
    },
    
    "profitability": {
      "profit_margin": 48.5,
      "operating_margin": 54.2,
      "return_on_equity": 98.5,
      "return_on_assets": 67.3
    },
    
    "growth": {
      "revenue_growth": 206.0,
      "earnings_growth": 462.0,
      "revenue_per_share": 25.60
    },
    
    "financial_health": {
      "current_ratio": 4.5,
      "debt_to_equity": 0.15,
      "quick_ratio": 3.8
    },
    
    "dividends": {
      "dividend_yield": 0.03,
      "payout_ratio": 2.5,
      "ex_dividend_date": "2024-12-15"
    }
  }
}
```

**How to Analyze:**

**1. Valuation (Is it expensive?)**
- **P/E of 65.5**: Very high, suggests high growth expectations
- **PEG of 1.8**: Reasonable given 462% earnings growth
- **P/S of 28.5**: Expensive on revenue basis

**2. Profitability (Is it a good business?)**
- **Profit margin of 48.5%**: Exceptional! Most companies are 5-15%
- **ROE of 98.5%**: Outstanding capital efficiency
- **Operating margin of 54.2%**: Shows pricing power

**3. Growth (Is it growing?)**
- **Revenue growth of 206%**: Explosive growth (AI boom)
- **Earnings growth of 462%**: Even faster profit growth

**4. Financial Health (Is it safe?)**
- **Current ratio of 4.5**: Very strong liquidity
- **Debt-to-equity of 0.15**: Minimal debt
- **Quick ratio of 3.8**: Can easily pay short-term obligations

**Real-World Analysis:**
```
"Analyze NVIDIA's financials and tell me if it's a quality business"

AI uses get_company_info("NVDA") and explains:
- World-class profitability (48.5% margins)
- Explosive growth driven by AI demand
- Strong balance sheet with minimal debt
- Very expensive valuation (P/E of 65.5)
- Conclusion: High-quality business, but priced for perfection
```

---

### 5. `explain_fundamental` - Learn Financial Metrics

**Purpose:** Educational explanations of financial metrics.

**When to Use:**
- Learning what a metric means
- Understanding how to interpret values
- Seeing metric in context

**Example Usage:**
```typescript
explain_fundamental({ metric: "pe_ratio" })
```

**Example Response:**
```json
{
  "success": true,
  "explanation": {
    "metric": "pe_ratio",
    "name": "Price-to-Earnings Ratio (P/E)",
    "definition": "The P/E ratio measures how much investors are willing to pay for each dollar of a company's earnings...",
    "formula": "P/E Ratio = Stock Price / Earnings Per Share",
    "interpretation": {
      "high_pe": "Indicates high growth expectations or overvaluation",
      "low_pe": "May indicate undervaluation or low growth expectations",
      "context": "Must compare to historical average, sector, and growth rate"
    },
    "typical_ranges": {
      "tech": "20-40",
      "utilities": "12-18",
      "sp500_average": "15-20"
    },
    "red_flags": [
      "P/E above 100 without strong growth justification",
      "Negative P/E (company losing money)",
      "P/E much higher than peers without clear reason"
    ],
    "related_metrics": ["peg_ratio", "forward_pe", "earnings_yield"]
  }
}
```

**Available Metrics:**
- `pe_ratio` - Price-to-Earnings
- `roe` - Return on Equity
- `profit_margin` - Net Profit Margin
- `debt_to_equity` - Debt-to-Equity Ratio
- `dividend_yield` - Dividend Yield
- `market_cap` - Market Capitalization
- Plus 20+ more metrics

**Real-World Example:**
```
"I keep seeing 'ROE' but don't understand what it means. Can you explain?"

AI uses explain_fundamental("roe") and teaches:
- Definition: How efficiently company uses equity
- Formula: Net Income / Shareholder Equity
- High ROE (>15%) generally good
- But check if using too much debt
- Provides real examples from companies
```

---

### 6. `compare_peers` - Side-by-Side Comparison

**Purpose:** Compare companies within the same sector.

**When to Use:**
- Understanding competitive positioning
- Finding industry leaders
- Spotting outliers
- Learning industry norms

**Example Usage:**
```typescript
compare_peers({ 
  symbol: "KO", 
  metrics: ["market_cap", "pe_ratio", "profit_margin", "revenue_growth"]
})
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "sector": "Consumer Defensive",
    "comparison": [
      {
        "symbol": "KO",
        "name": "Coca-Cola",
        "market_cap": 267000000000,
        "pe_ratio": 24.5,
        "profit_margin": 22.8,
        "revenue_growth": 8.2
      },
      {
        "symbol": "PEP",
        "name": "PepsiCo",
        "market_cap": 235000000000,
        "pe_ratio": 25.8,
        "profit_margin": 10.5,
        "revenue_growth": 6.7
      },
      {
        "symbol": "MNST",
        "name": "Monster Beverage",
        "market_cap": 57000000000,
        "pe_ratio": 35.2,
        "profit_margin": 25.4,
        "revenue_growth": 11.9
      }
    ],
    "insights": {
      "leader_by_profitability": "MNST (25.4% margin)",
      "leader_by_growth": "MNST (11.9%)",
      "most_expensive": "MNST (P/E 35.2)",
      "largest": "KO ($267B market cap)"
    }
  }
}
```

**How to Analyze Peer Comparisons:**

1. **Look for Patterns:**
   - Why does Monster have higher margins? (Focused product line)
   - Why does Pepsi have lower margins? (Diversified, includes Frito-Lay)

2. **Understand Trade-offs:**
   - Monster grows faster but is smaller and more expensive
   - Coca-Cola is larger, more stable, cheaper valuation

3. **Ask Questions:**
   - "Why is X more profitable than Y?"
   - "What advantages does the leader have?"
   - "Are differences sustainable or temporary?"

**Real-World Example:**
```
"Compare Coca-Cola to its competitors and help me understand which is best"

AI uses compare_peers("KO") and discusses:
- KO has strong brand and profitability
- MNST growing faster but much smaller
- PEP more diversified but lower margins
- "Best" depends on your goals:
  - Growth: Monster
  - Stability: Coca-Cola
  - Diversification: PepsiCo
```

---

## Portfolio Management Tools

### 7. `create_portfolio` - Start Tracking

**Purpose:** Create a new investment portfolio to track.

**Example Usage:**
```typescript
create_portfolio({
  name: "Growth Portfolio",
  description: "Long-term growth focused on technology and healthcare",
  currency: "USD"
})
```

**Example Response:**
```json
{
  "success": true,
  "portfolio": {
    "id": "abc123...",
    "name": "Growth Portfolio",
    "description": "Long-term growth focused on technology and healthcare",
    "currency": "USD",
    "created_at": "2025-01-15T10:00:00Z"
  },
  "message": "Portfolio 'Growth Portfolio' created successfully!"
}
```

**Tips:**
- Choose a meaningful name
- Document your strategy in the description
- You can have multiple portfolios (e.g., "Dividend Income", "Tech Growth", "Value")

---

### 8. `list_portfolios` - View All Portfolios

**Purpose:** See all your portfolios with summary stats.

**Example Usage:**
```typescript
list_portfolios()
```

**Example Response:**
```json
{
  "success": true,
  "portfolios": [
    {
      "id": "abc123...",
      "name": "Growth Portfolio",
      "description": "Long-term growth focused on technology",
      "currency": "USD",
      "holdings_count": 8,
      "total_cost": 95000.00,
      "created_at": "2025-01-15T10:00:00Z"
    },
    {
      "id": "def456...",
      "name": "Dividend Income",
      "description": "Income-focused portfolio",
      "currency": "USD",
      "holdings_count": 12,
      "total_cost": 125000.00,
      "created_at": "2024-12-01T10:00:00Z"
    }
  ],
  "count": 2
}
```

---

### 9. `get_portfolio` - Portfolio Details

**Purpose:** Get detailed information about a specific portfolio.

**Example Usage:**
```typescript
get_portfolio({ portfolio_id: "abc123..." })
```

**Example Response:**
```json
{
  "success": true,
  "portfolio": {
    "id": "abc123...",
    "name": "Growth Portfolio",
    "description": "Long-term growth focused on technology",
    "currency": "USD",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-20T14:30:00Z"
  }
}
```

---

### 10. `get_holdings` - View All Positions

**Purpose:** See all current holdings in a portfolio.

**Example Usage:**
```typescript
get_holdings({ portfolio_id: "abc123..." })
```

**Example Response:**
```json
{
  "success": true,
  "holdings": [
    {
      "symbol": "AAPL",
      "quantity": 50.00,
      "average_cost": 150.25,
      "total_cost": 7512.50,
      "first_purchase_date": "2024-06-15",
      "last_transaction_date": "2024-12-01"
    },
    {
      "symbol": "MSFT",
      "quantity": 25.00,
      "average_cost": 380.50,
      "total_cost": 9512.50,
      "first_purchase_date": "2024-07-01",
      "last_transaction_date": "2024-07-01"
    }
  ],
  "count": 2
}
```

**Key Information:**
- **Quantity**: Total shares owned
- **Average Cost**: Your cost basis (for tax purposes)
- **Total Cost**: Total invested in this position
- **Dates**: When you started and last added to position

---

### 11. `add_transaction` - Record Buy/Sell

**Purpose:** Record investment transactions (automatically updates holdings).

**Transaction Types:**
- `BUY` - Purchase shares
- `SELL` - Sell shares
- `DIVIDEND` - Dividend received
- `SPLIT` - Stock split
- `TRANSFER_IN` - Transfer from another account
- `TRANSFER_OUT` - Transfer to another account

**Example: Buy Transaction**
```typescript
add_transaction({
  portfolio_id: "abc123...",
  symbol: "NVDA",
  type: "BUY",
  quantity: 10,
  price: 475.00,
  fees: 0,
  currency: "USD",
  transaction_date: "2025-01-15",
  notes: "Initial position - AI growth thesis"
})
```

**Example Response:**
```json
{
  "success": true,
  "transaction": {
    "id": "tx789...",
    "portfolio_id": "abc123...",
    "symbol": "NVDA",
    "type": "BUY",
    "quantity": 10.00,
    "price": 475.00,
    "fees": 0.00,
    "total_amount": 4750.00,
    "transaction_date": "2025-01-15",
    "notes": "Initial position - AI growth thesis"
  },
  "holding": {
    "symbol": "NVDA",
    "quantity": 10.00,
    "average_cost": 475.00,
    "total_cost": 4750.00
  },
  "message": "Transaction recorded: Bought 10 shares of NVDA @ $475.00"
}
```

**Example: Sell Transaction**
```typescript
add_transaction({
  portfolio_id: "abc123...",
  symbol: "NVDA",
  type: "SELL",
  quantity: 5,
  price: 500.00,
  fees: 0,
  transaction_date: "2025-02-01",
  notes: "Trimming position - reached target weight"
})
```

**Response shows:**
- Realized gain/loss: $125 ((500-475) * 5)
- Remaining position: 5 shares at $475 average cost

**Important Notes:**
- Average cost is calculated automatically using FIFO (First-In, First-Out)
- Fees are added to cost basis for buys, subtracted from proceeds for sells
- Total amount is always (quantity * price) ± fees

---

### 12. `get_transactions` - Transaction History

**Purpose:** View transaction history for a portfolio.

**Example Usage:**
```typescript
get_transactions({ 
  portfolio_id: "abc123...", 
  limit: 50 
})
```

**Example Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "tx790...",
      "symbol": "NVDA",
      "type": "SELL",
      "quantity": 5.00,
      "price": 500.00,
      "total_amount": 2500.00,
      "transaction_date": "2025-02-01",
      "notes": "Trimming position"
    },
    {
      "id": "tx789...",
      "symbol": "NVDA",
      "type": "BUY",
      "quantity": 10.00,
      "price": 475.00,
      "total_amount": 4750.00,
      "transaction_date": "2025-01-15",
      "notes": "Initial position"
    }
  ],
  "count": 2
}
```

**Use Cases:**
- Tax reporting (capital gains/losses)
- Performance attribution (what drove returns)
- Learning from past decisions
- Audit trail for your decision-making

---

### 13. `calculate_performance` - Portfolio Returns

**Purpose:** Calculate portfolio and position-level performance.

**Example Usage:**
```typescript
calculate_performance({
  portfolio_id: "abc123...",
  current_prices: {
    "AAPL": 185.50,
    "MSFT": 395.20,
    "NVDA": 485.00
  }
})
```

**Example Response:**
```json
{
  "success": true,
  "performance": {
    "portfolio_summary": {
      "total_cost": 21775.00,
      "total_current_value": 23275.00,
      "total_gain_loss": 1500.00,
      "total_gain_loss_percent": 6.89
    },
    "positions": [
      {
        "symbol": "AAPL",
        "quantity": 50.00,
        "average_cost": 150.25,
        "current_price": 185.50,
        "cost_basis": 7512.50,
        "current_value": 9275.00,
        "unrealized_gain_loss": 1762.50,
        "unrealized_gain_loss_percent": 23.46,
        "portfolio_weight": 39.87
      },
      {
        "symbol": "MSFT",
        "quantity": 25.00,
        "average_cost": 380.50,
        "current_price": 395.20,
        "cost_basis": 9512.50,
        "current_value": 9880.00,
        "unrealized_gain_loss": 367.50,
        "unrealized_gain_loss_percent": 3.86,
        "portfolio_weight": 42.44
      },
      {
        "symbol": "NVDA",
        "quantity": 10.00,
        "average_cost": 475.00,
        "current_price": 485.00,
        "cost_basis": 4750.00,
        "current_value": 4850.00,
        "unrealized_gain_loss": 100.00,
        "unrealized_gain_loss_percent": 2.11,
        "portfolio_weight": 20.84
      }
    ]
  }
}
```

**Key Metrics to Review:**
- **Total Return**: Overall portfolio performance (6.89%)
- **Best Performer**: AAPL at +23.46%
- **Worst Performer**: NVDA at +2.11% (still positive!)
- **Portfolio Weights**: Ensure no overconcentration
- **Unrealized Gains**: Tax planning considerations

**Analysis Questions:**
- Is portfolio performance meeting expectations?
- Any positions significantly over/underweight?
- Which positions are driving returns?
- Any positions need rebalancing?

---

### 14. `delete_portfolio` - Remove Portfolio

**Purpose:** Delete a portfolio and all related data.

**⚠️ Warning:** This action cannot be undone!

**Example Usage:**
```typescript
delete_portfolio({ portfolio_id: "abc123..." })
```

---

## Learning & Research Tools

### 15. `add_to_watchlist` - Track Research Candidates

**Purpose:** Add stocks to your watchlist for monitoring and research.

**When to Use:**
- Found interesting company but not ready to buy
- Want to track price movements
- Setting target buy prices
- Organizing research pipeline

**Example Usage:**
```typescript
add_to_watchlist({
  portfolio_id: "abc123...",
  symbol: "TSLA",
  notes: "Monitoring for entry below $200. Strong EV market position but high valuation.",
  target_price: 180.00,
  priority: "HIGH"
})
```

**Example Response:**
```json
{
  "success": true,
  "watchlist_item": {
    "id": "watch123...",
    "portfolio_id": "abc123...",
    "symbol": "TSLA",
    "notes": "Monitoring for entry below $200...",
    "target_price": 180.00,
    "priority": "HIGH",
    "created_at": "2025-01-15T10:00:00Z"
  },
  "message": "TSLA added to watchlist"
}
```

**Priorities:**
- `HIGH` - Top candidates, check daily
- `MEDIUM` - Interesting, check weekly
- `LOW` - Long-term monitoring

**Best Practices:**
- Document WHY you're watching
- Set specific price targets
- Include thesis or concerns
- Review watchlist weekly
- Remove if thesis breaks

---

### 16. `get_watchlist` - View Watchlist

**Purpose:** See all stocks you're monitoring.

**Example Usage:**
```typescript
get_watchlist({ portfolio_id: "abc123..." })
```

**Example Response:**
```json
{
  "success": true,
  "watchlist": [
    {
      "symbol": "TSLA",
      "notes": "Monitoring for entry below $200...",
      "target_price": 180.00,
      "priority": "HIGH",
      "created_at": "2025-01-15"
    },
    {
      "symbol": "AMD",
      "notes": "AI chip opportunity, waiting for pullback",
      "target_price": 120.00,
      "priority": "MEDIUM",
      "created_at": "2025-01-10"
    }
  ],
  "count": 2
}
```

---

### 17. `update_watchlist_item` - Update Notes/Targets

**Purpose:** Update your research notes or target prices as you learn more.

**Example Usage:**
```typescript
update_watchlist_item({
  portfolio_id: "abc123...",
  symbol: "TSLA",
  notes: "Updated: Q4 earnings strong, but valuation still concerns. Raising target to $200.",
  target_price: 200.00,
  priority: "MEDIUM"
})
```

---

### 18. `remove_from_watchlist` - Remove Stock

**Purpose:** Remove stock from watchlist (thesis broken or purchased).

**Example Usage:**
```typescript
remove_from_watchlist({
  portfolio_id: "abc123...",
  symbol: "TSLA"
})
```

---

### 19. `create_thesis` - Document Investment Rationale

**Purpose:** Formally document why you own (or want to own) a stock.

**When to Use:**
- Before making a purchase
- To clarify your thinking
- To review later
- To avoid emotional decisions

**Example Usage:**
```typescript
create_thesis({
  portfolio_id: "abc123...",
  symbol: "NVDA",
  thesis: "NVIDIA dominates the AI chip market with 80%+ market share in GPUs for AI training. Data center revenue growing 200%+ YoY driven by enterprise AI adoption.",
  bull_case: "- Market leader with technological moat\\n- Data center TAM expanding rapidly\\n- New product launches (Grace CPU, networking)\\n- Software ecosystem lock-in (CUDA)",
  bear_case: "- Very high valuation (P/E >60)\\n- Competition from AMD, Intel, custom chips\\n- Cyclical semiconductor business\\n- Concentration risk (few large customers)",
  target_allocation: 10,
  review_date: "2025-04-15"
})
```

**Example Response:**
```json
{
  "success": true,
  "thesis": {
    "id": "thesis123...",
    "portfolio_id": "abc123...",
    "symbol": "NVDA",
    "thesis": "NVIDIA dominates the AI chip market...",
    "bull_case": "- Market leader with technological moat...",
    "bear_case": "- Very high valuation...",
    "target_allocation": 10.00,
    "review_date": "2025-04-15",
    "status": "ACTIVE",
    "created_at": "2025-01-15T10:00:00Z"
  },
  "message": "Investment thesis for NVDA created"
}
```

**Thesis Components:**

**1. Thesis (2-3 sentences):**
- WHAT the company does
- WHY you think it will succeed
- Your timeframe

**2. Bull Case (3-5 points):**
- Reasons stock could outperform
- Competitive advantages
- Growth catalysts
- Tailwinds

**3. Bear Case (3-5 points):**
- Risks and concerns
- Competitive threats
- Valuation concerns
- What could go wrong

**4. Target Allocation:**
- What % of portfolio should this be?
- Based on conviction and risk

**5. Review Date:**
- When should you reassess the thesis?
- Typically quarterly or after major events

---

### 20. `get_theses` - View All Investment Theses

**Purpose:** See all your documented investment rationales.

**Example Usage:**
```typescript
get_theses({ portfolio_id: "abc123..." })
```

**Example Response:**
```json
{
  "success": true,
  "theses": [
    {
      "symbol": "NVDA",
      "thesis": "NVIDIA dominates the AI chip market...",
      "target_allocation": 10.00,
      "status": "ACTIVE",
      "review_date": "2025-04-15"
    },
    {
      "symbol": "AAPL",
      "thesis": "Transition to services business with high margins...",
      "target_allocation": 15.00,
      "status": "MONITORING",
      "review_date": "2025-03-01"
    }
  ],
  "count": 2
}
```

**Thesis Statuses:**
- `ACTIVE` - Thesis intact, holding/buying
- `MONITORING` - Watching for changes
- `EXITED` - Sold position
- `INVALIDATED` - Thesis broke, need to exit

---

### 21. `get_thesis` - View Specific Thesis

**Purpose:** Get detailed thesis for a single stock.

**Example Usage:**
```typescript
get_thesis({
  portfolio_id: "abc123...",
  symbol: "NVDA"
})
```

---

### 22. `update_thesis` - Revise as You Learn

**Purpose:** Update thesis as market conditions or your understanding changes.

**Example Usage:**
```typescript
update_thesis({
  portfolio_id: "abc123...",
  symbol: "NVDA",
  thesis: "Updated: NVIDIA expanding beyond training to inference chips. Networking acquisition expanding TAM.",
  target_allocation: 12,
  status: "MONITORING",
  review_date: "2025-07-01"
})
```

**When to Update:**
- Quarterly reviews
- After earnings reports
- Major company announcements
- Significant price movements
- Competitive landscape changes

---

### 23. `delete_thesis` - Remove Thesis

**Purpose:** Delete thesis (usually after exiting position).

**Example Usage:**
```typescript
delete_thesis({
  portfolio_id: "abc123...",
  symbol: "NVDA"
})
```

---

### 24. `analyze_what_if` - Scenario Analysis

**Purpose:** Model the impact of a trade BEFORE executing it.

**When to Use:**
- Before buying or selling
- To understand portfolio impact
- For tax planning
- To avoid surprises

**Example: What if I BUY?**
```typescript
analyze_what_if({
  portfolio_id: "abc123...",
  symbol: "AMD",
  action: "BUY",
  quantity: 20,
  price: 145.00,
  current_prices: {
    "AAPL": 185.50,
    "MSFT": 395.20,
    "NVDA": 485.00,
    "AMD": 150.00
  }
})
```

**Example Response:**
```json
{
  "success": true,
  "analysis": {
    "symbol": "AMD",
    "action": "BUY",
    
    "current_position": {
      "quantity": 0,
      "average_cost": 0,
      "total_cost": 0
    },
    
    "after_purchase": {
      "new_quantity": 20.00,
      "new_average_cost": 145.00,
      "new_total_cost": 2900.00,
      "additional_investment": 2900.00
    },
    
    "portfolio_impact": {
      "current_total_value": 23275.00,
      "new_total_value": 26175.00,
      "position_weight_before": 0.00,
      "position_weight_after": 11.07,
      "cash_required": 2900.00
    }
  },
  "message": "What-if analysis complete for BUY AMD"
}
```

**Analysis Shows:**
- Would need $2,900 cash
- AMD would be 11.07% of portfolio
- Portfolio grows to $26,175
- No existing position to average into

**Example: What if I SELL?**
```typescript
analyze_what_if({
  portfolio_id: "abc123...",
  symbol: "NVDA",
  action: "SELL",
  quantity: 10,  // Selling all shares
  price: 500.00,
  current_prices: {
    "AAPL": 185.50,
    "MSFT": 395.20,
    "NVDA": 485.00
  }
})
```

**Example Response:**
```json
{
  "success": true,
  "analysis": {
    "symbol": "NVDA",
    "action": "SELL",
    
    "current_position": {
      "quantity": 10.00,
      "average_cost": 475.00,
      "total_cost": 4750.00,
      "current_value": 4850.00,
      "unrealized_gain_loss": 100.00,
      "unrealized_gain_loss_percent": 2.11
    },
    
    "after_sale": {
      "realized_gain_loss": 250.00,
      "realized_gain_loss_percent": 5.26,
      "proceeds": 5000.00,
      "tax_impact_estimate": 37.50
    },
    
    "portfolio_impact": {
      "current_total_value": 23275.00,
      "new_total_value": 23375.00,
      "position_weight_before": 20.84,
      "position_weight_after": 0.00,
      "cash_increase": 5000.00
    }
  }
}
```

**Analysis Shows:**
- Would realize $250 gain
- Tax impact ~$37.50 (15% capital gains)
- Net proceeds: $4,962.50
- Reduces portfolio concentration
- Frees up cash for other opportunities

**Key Insights from What-If:**
- **Before**: See exact portfolio impact
- **During**: Make informed decision
- **After**: No surprises

---

## Complete Workflows

### Workflow 1: Research → Invest

**Scenario:** You heard about a company and want to research it properly before investing.

**Step-by-Step:**

```
1. Find the Symbol
   search_symbol({ query: "Nvidia" })
   → Returns: NVDA

2. Get Quick Overview
   get_quote({ symbol: "NVDA" })
   → Price: $485, P/E: 65.5, looks expensive

3. Deep Fundamental Research
   get_company_info({ symbol: "NVDA" })
   → Revenue growth: 206%, Profit margin: 48.5%
   → Conclusion: High quality, but priced for perfection

4. Compare to Competitors
   compare_peers({ 
     symbol: "NVDA",
     metrics: ["market_cap", "pe_ratio", "profit_margin", "revenue_growth"]
   })
   → NVDA has highest margins and growth
   → But also highest valuation

5. Learn About Confusing Metrics
   explain_fundamental({ metric: "peg_ratio" })
   → PEG of 1.8 is reasonable given growth

6. Add to Watchlist
   add_to_watchlist({
     portfolio_id: "abc123...",
     symbol: "NVDA",
     notes: "Strong fundamentals, waiting for pullback below $450",
     target_price: 450.00,
     priority: "HIGH"
   })

7. Document Investment Thesis
   create_thesis({
     portfolio_id: "abc123...",
     symbol: "NVDA",
     thesis: "AI chip market leader with 80%+ share...",
     bull_case: "Data center growth, new products, CUDA moat",
     bear_case: "High valuation, competition, cyclical",
     target_allocation: 10
   })

8. Wait for Entry Price...
   [Weekly: Check watchlist and update notes]

9. When Price Reaches Target
   analyze_what_if({
     portfolio_id: "abc123...",
     symbol: "NVDA",
     action: "BUY",
     quantity: 10,
     price: 450.00,
     current_prices: {...}
   })
   → Reviews portfolio impact
   → Confirms allocation is reasonable

10. Execute Purchase
    add_transaction({
      portfolio_id: "abc123...",
      symbol: "NVDA",
      type: "BUY",
      quantity: 10,
      price: 450.00,
      transaction_date: "2025-02-01",
      notes: "Bought at target price, thesis documented"
    })

11. Document Decision
    [Update journal in .cursor/knowledge/journal/]
    - Why I bought at this price
    - What I expect to happen
    - When I'll review the thesis
```

---

### Workflow 2: Monthly Portfolio Review

**Scenario:** End of month, time to review portfolio performance and decisions.

**Step-by-Step:**

```
1. Get Current Positions
   get_holdings({ portfolio_id: "abc123..." })
   → See all holdings and cost basis

2. Calculate Performance
   calculate_performance({
     portfolio_id: "abc123...",
     current_prices: {
       "AAPL": 185.50,
       "MSFT": 395.20,
       "NVDA": 485.00
     }
   })
   → Portfolio up 6.89%
   → AAPL best performer (+23.46%)
   → NVDA worst performer (+2.11%)

3. Review Investment Theses
   get_theses({ portfolio_id: "abc123..." })
   → Check if any theses need updating
   → Note review dates approaching

4. Check Watchlist
   get_watchlist({ portfolio_id: "abc123..." })
   → Any stocks hit target prices?
   → Update notes based on new information

5. Review Recent Transactions
   get_transactions({ portfolio_id: "abc123...", limit: 10 })
   → What did I buy/sell this month?
   → Why did I make those decisions?

6. Document Insights
   [Create monthly review in .cursor/knowledge/journal/]
   
   # Portfolio Review - January 2025
   
   ## Performance
   - Total Return: +6.89%
   - vs S&P 500: TBD (compare manually)
   - Best: AAPL +23.46%
   - Worst: NVDA +2.11%
   
   ## Decisions This Month
   - Bought NVDA at $450 (thesis: AI growth)
   - Trimmed AAPL at $185 (reached target weight)
   
   ## Thesis Reviews
   - NVDA: Thesis intact, Q4 earnings strong
   - AAPL: Services growth slower, monitoring
   
   ## Action Items for Next Month
   - Review AAPL thesis after earnings
   - Research AMD as NVDA alternative
   - Rebalance if any position >25%
   
   ## Learning This Month
   - Learned about PEG ratios
   - Better understanding of semiconductor cycle
   - Need to study cash flow analysis next
```

---

### Workflow 3: Position Evaluation (Should I Sell?)

**Scenario:** One of your holdings is down 20%. Should you sell, hold, or buy more?

**Step-by-Step:**

```
1. Review Current Position
   get_holdings({ portfolio_id: "abc123..." })
   → Find the position
   → Current loss: -20%

2. Check Current Fundamentals
   get_company_info({ symbol: "XYZ" })
   → Review all metrics
   → Compare to when you bought

3. Review Your Original Thesis
   get_thesis({
     portfolio_id: "abc123...",
     symbol: "XYZ"
   })
   → Why did I buy this?
   → Is the thesis still valid?

4. Compare to Peers
   compare_peers({ symbol: "XYZ" })
   → Is company underperforming peers?
   → Is entire sector down?

5. Analyze Different Scenarios

   A. What if I sell now?
   analyze_what_if({
     portfolio_id: "abc123...",
     symbol: "XYZ",
     action: "SELL",
     quantity: <all shares>,
     price: <current price>,
     current_prices: {...}
   })
   → Realize the loss
   → Free up capital
   → Tax loss harvesting benefit

   B. What if I average down?
   analyze_what_if({
     portfolio_id: "abc123...",
     symbol: "XYZ",
     action: "BUY",
     quantity: <additional shares>,
     price: <current price>,
     current_prices: {...}
   })
   → Lower average cost
   → Increase concentration
   → Requires fresh capital

6. Make Decision Based on Thesis

   Thesis Broken → SELL
   - Core business deteriorating
   - Competitive position weakening
   - Better opportunities elsewhere
   
   Thesis Intact → HOLD or BUY
   - Fundamentals still strong
   - Temporary setback
   - Price more attractive now

7. Document Decision
   [Update journal with detailed reasoning]
   
   # Position Evaluation: XYZ - Down 20%
   
   ## Situation
   - Bought at $100, now $80
   - Down 20%, portfolio weight dropped to 8%
   
   ## Thesis Check
   - Original: "Leader in cloud infrastructure"
   - Status: ✅ INTACT
   - Reason down: Sector rotation, not company-specific
   
   ## Fundamental Review
   - Revenue growth: Still 25%+ (unchanged)
   - Margins: Improving slightly
   - Competition: No major threats
   - Valuation: Now cheaper (P/S down 30%)
   
   ## Decision: BUY MORE
   - Thesis validated by recent results
   - Valuation more attractive
   - Averaging down from $100 to $90
   - Increasing weight from 8% to 12%
   
   ## What Would Change My Mind
   - Revenue growth slowing <15%
   - Major customer loss
   - Margin compression
   - New competitive threat

8. Execute if Buying More
   add_transaction({
     portfolio_id: "abc123...",
     symbol: "XYZ",
     type: "BUY",
     quantity: <shares>,
     price: 80.00,
     notes: "Averaging down - thesis intact, price more attractive"
   })

9. Update Thesis if Needed
   update_thesis({
     portfolio_id: "abc123...",
     symbol: "XYZ",
     notes: "2025-02-01: Averaged down at $80. Sector rotation created opportunity. Next review after Q1 earnings."
   })
```

---

## Best Practices

### General Principles

1. **Document Everything**
   - Every decision should have written rationale
   - Use the `notes` field in transactions
   - Maintain thesis documents
   - Keep a learning journal

2. **Use What-If Before Acting**
   - Never buy or sell without scenario analysis
   - Understand portfolio impact
   - Consider tax implications
   - No surprises

3. **Review Regularly**
   - Weekly: Check watchlist and holdings
   - Monthly: Portfolio performance review
   - Quarterly: Deep thesis reviews
   - Annually: Process and strategy review

4. **Learn from Everything**
   - Winners: What did I get right?
   - Losers: What did I miss?
   - Market moves: What am I learning?
   - Other investors: What perspectives am I missing?

5. **Stay Organized**
   - One portfolio per strategy
   - Clear naming conventions
   - Regular knowledge base updates
   - Clean up old watchlist items

### Research Best Practices

1. **Start Broad, Then Go Deep**
   - Quick look: `get_quote`
   - Full picture: `get_company_info`
   - Context: `compare_peers`
   - Learning: `explain_fundamental`

2. **Always Compare**
   - Never analyze in isolation
   - Compare to peers
   - Compare to historical averages
   - Compare to your portfolio

3. **Question Everything**
   - High margin: Why? Sustainable?
   - Fast growth: From where? Lasting?
   - Low valuation: What's wrong?
   - High valuation: What's priced in?

### Portfolio Management Best Practices

1. **Position Sizing**
   - No position >20% at entry
   - Top conviction: 10-15%
   - Medium conviction: 5-10%
   - Low conviction: 2-5%
   - Aim for 8-12 total positions

2. **Diversification**
   - Across sectors
   - Across company sizes
   - Across business models
   - Don't over-diversify (diminishing returns)

3. **Rebalancing**
   - When position >25% of portfolio
   - When thesis changes
   - When better opportunities arise
   - Not just for fun

4. **Tax Awareness**
   - Long-term > Short-term gains
   - Tax-loss harvesting
   - Consider timing of sales
   - Use `analyze_what_if` for tax estimates

### Learning Best Practices

1. **Concepts Before Companies**
   - Understand metrics first
   - Then apply to real companies
   - Use `explain_fundamental` liberally

2. **Depth Over Breadth**
   - 3 companies deeply > 30 superficially
   - Master one sector at a time
   - Quality of analysis matters

3. **Document Your Journey**
   - Track what you learn
   - Note "aha!" moments
   - Review past analyses
   - See your progress

4. **Embrace Mistakes**
   - You will be wrong
   - That's how you learn
   - Document why you were wrong
   - Don't repeat the same mistakes

---

## Getting Help

If you're stuck or have questions:

1. **Use the Learning Prompts**
   - `.cursor/prompts/learn-concept.md` - For metrics
   - `.cursor/prompts/decode-financials.md` - For companies
   - `.cursor/prompts/analyze-portfolio.md` - For portfolio review

2. **Ask the AI**
   - "Can you explain [concept] in simpler terms?"
   - "Why would [metric] be high for [company]?"
   - "What should I look for when analyzing [industry]?"

3. **Check the Knowledge Base**
   - Review `.cursor/knowledge/glossary.md`
   - Read example analyses in `journal/`
   - Study concept docs in `concepts/`

4. **Consult Professionals**
   - Tax questions → CPA
   - Financial planning → CFP
   - Large decisions → Financial Advisor

---

## Remember

**This is a learning tool, not a get-rich-quick scheme.**

- Focus on the process, not the outcome
- Build skills systematically
- Learn from both wins and losses
- Be patient with yourself
- Enjoy the journey of learning

**The goal is to become a better investor over time by developing good habits, systematic thinking, and deep understanding of businesses and markets.**

Good luck! 🚀📈
