# Learning Guide - FinX Financial AI Agent

## 🎓 Introduction

Welcome to FinX! This system is designed to help you learn investment and financial analysis concepts through hands-on practice. Unlike traditional learning where theory comes first, you'll learn by doing - analyzing real market data, tracking a real portfolio, and documenting your insights.

## 🧭 Learning Philosophy

### Learn by Doing
- Work with real market data
- Track actual investments
- Make predictions and learn from outcomes
- Build knowledge through experience

### Document Your Growth
- Keep a learning journal
- Build a personal financial knowledge base
- Track your investment theses
- Review and reflect on decisions

### Understand the "Why"
- Don't just calculate metrics - understand what they mean
- Learn multiple perspectives and frameworks
- Question assumptions
- Think critically about financial information

## 📚 Learning Path

### Phase 1: Market Data & Fundamentals (Current)

**Core Concepts to Learn:**
- Stock quotes and market data
- Company fundamentals (revenue, earnings, assets)
- Key financial ratios (P/E, P/B, ROE, ROA, Debt/Equity)
- Market capitalization and company size
- Industry sectors and classifications

**Activities:**
1. **Explore Individual Stocks**
   - Use `get_quote()` to see real-time data
   - Use `get_company_info()` to understand business fundamentals
   - Document what each metric means in `knowledge/concepts/`

2. **Compare Companies**
   - Use `compare_peers()` to see how similar companies differ
   - Understand why valuations vary
   - Learn to spot over/undervalued stocks

3. **Study Historical Trends**
   - Use `get_historical_data()` to see price movements
   - Correlate price changes with company news/events
   - Understand market cycles

**Recommended Reading:**
- "The Intelligent Investor" by Benjamin Graham (Chapters 8, 14, 20)
- "A Random Walk Down Wall Street" by Burton Malkiel (Chapters 1-4)
- Investopedia articles on key metrics

**Practice Exercises:**
1. Research 5 companies in the same industry
2. Document what makes a "good" vs "bad" investment
3. Create your first watchlist
4. Write a thesis for why you'd invest (or not) in a specific company

### Phase 2: Portfolio Management (Coming Soon)

**Core Concepts to Learn:**
- Position sizing and diversification
- Cost basis and returns calculation
- Time-weighted vs money-weighted returns
- Asset allocation strategies
- Rebalancing

**Activities:**
- Track your actual portfolio
- Record every transaction with reasoning
- Calculate performance metrics
- Analyze allocation by sector/asset type

### Phase 3: Fundamental Analysis (Future)

**Core Concepts to Learn:**
- Financial statement analysis
- Income statement, balance sheet, cash flow
- Ratio analysis and interpretation
- Valuation models (DCF, multiples)
- Industry/sector analysis

### Phase 4: Risk & Portfolio Theory (Future)

**Core Concepts to Learn:**
- Volatility and standard deviation
- Correlation and diversification benefits
- Risk-adjusted returns (Sharpe ratio, Sortino ratio)
- Modern Portfolio Theory
- Efficient frontier

## 📝 Using Your Knowledge Base

The `.cursor/knowledge/` directory is your personal financial encyclopedia. As you learn, document concepts here.

### Structure

```
knowledge/
├── concepts/           # Financial concepts you learn
├── frameworks/         # Investment frameworks and strategies  
├── journal/           # Your investment journal entries
└── glossary.md        # Financial terms dictionary
```

### How to Document Concepts

When you learn a new concept, create a markdown file:

**Example: `knowledge/concepts/price-to-earnings-ratio.md`**

```markdown
# Price-to-Earnings Ratio (P/E Ratio)

## What It Is
The P/E ratio measures how much investors are willing to pay for each dollar of a company's earnings.

## Formula
P/E Ratio = Stock Price / Earnings Per Share (EPS)

## What It Means
- **High P/E**: Market expects strong future growth, or stock is overvalued
- **Low P/E**: Market has low expectations, or stock is undervalued
- **Industry Context**: Tech stocks typically have higher P/E than utilities

## Example
If Apple trades at $180 and has EPS of $6, P/E = 180/6 = 30
This means investors pay $30 for every $1 of Apple's earnings.

## When I Learned This
2025-10-26 - Compared AAPL (P/E ~30) vs JPM (P/E ~12) and understood why growth stocks have higher P/E.

## Related Concepts
- PEG Ratio (P/E adjusted for growth)
- Forward P/E vs Trailing P/E
- Sector-specific P/E norms
```

## 📔 Investment Journal

Use the journal to track your thoughts and learn from outcomes.

**Example: `knowledge/journal/2025-10-26-apple-analysis.md`**

```markdown
# Apple (AAPL) - Initial Research

## Date
2025-10-26

## Thesis
Apple looks interesting because of strong iPhone 15 sales and services growth.

## Key Metrics
- P/E: 30.5 (vs sector avg: 28)
- Revenue Growth: 8% YoY
- Gross Margin: 44%

## My Questions
- Is P/E too high?
- How sustainable is services growth?
- What about competition from Android?

## Decision
Adding to watchlist. Need to understand competitive moat better.

## Follow-up
- Read last earnings call transcript
- Compare with Samsung, Google
- Understand Services breakdown
```

## 🤔 Asking Better Questions

The system works best when you ask thoughtful questions:

**Instead of:** "What's the price of AAPL?"
**Ask:** "What's AAPL's current valuation and how does it compare to historical averages?"

**Instead of:** "Is TSLA a good buy?"
**Ask:** "What are TSLA's fundamentals, how do they compare to traditional auto makers, and what's the market pricing in?"

**Instead of:** "Show me data"
**Ask:** "Help me understand why company X's P/E is higher than company Y despite similar growth rates"

## 🎯 Learning Goals by Phase

### Phase 1 Goals (Market Data)
- [ ] Understand what each financial ratio means
- [ ] Know how to compare companies in the same sector
- [ ] Read and interpret company fundamental data
- [ ] Build a watchlist with reasoning for each pick
- [ ] Document 10+ financial concepts in knowledge base

### Phase 2 Goals (Portfolio)
- [ ] Track actual portfolio performance
- [ ] Calculate returns accurately
- [ ] Understand asset allocation impact
- [ ] Journal investment theses and review outcomes
- [ ] Learn from both wins and losses

## 💡 Tips for Success

1. **Start Small** - Learn one concept thoroughly rather than many superficially
2. **Use Real Examples** - Apply concepts to actual stocks you're interested in
3. **Document Everything** - Your future self will thank you
4. **Question Assumptions** - If P/E is "good" or "bad", ask why
5. **Learn from Mistakes** - Track predictions and analyze what you got wrong
6. **Cross-Reference** - Use multiple sources (this tool + books + websites)
7. **Be Patient** - Financial literacy takes time to build

## 📚 Recommended Resources

### Books
- **Beginner:** "The Little Book of Common Sense Investing" - John Bogle
- **Intermediate:** "The Intelligent Investor" - Benjamin Graham  
- **Advanced:** "Security Analysis" - Graham & Dodd

### Websites
- **Investopedia** - Concept explanations with examples
- **SEC EDGAR** - Official company filings
- **FINRA** - Investor education and alerts
- **Khan Academy** - Free finance courses

### Podcasts
- "We Study Billionaires" - Investor perspectives
- "Planet Money" - Economic concepts explained
- "Motley Fool Money" - Weekly market analysis

## ⚠️ Important Reminders

1. **This is NOT Financial Advice** - You're learning, not getting recommendations
2. **Start with Paper Trading** - Practice before risking real money
3. **Diversification Matters** - Never put all eggs in one basket
4. **Know Your Risk Tolerance** - Invest based on your personal situation
5. **Professional Advice** - Consider consulting a financial advisor for serious decisions

## 🆘 When You're Stuck

1. **Review your notes** - Check `knowledge/` for concepts you've learned
2. **Ask simpler questions** - Break complex queries into smaller parts
3. **Use learning prompts** - Try `.cursor/prompts/learn-concept.md`
4. **External resources** - Investopedia is excellent for definitions
5. **Journal your confusion** - Sometimes writing helps clarify thinking

## 🚀 Next Steps

1. Complete Phase 1a Market Data exploration
2. Build your knowledge base with 10+ concepts
3. Create a watchlist of interesting stocks
4. Write investment theses for each watchlist stock
5. Review and learn before moving to Phase 1b

Remember: The goal isn't to become an expert overnight. It's to build solid foundational knowledge through hands-on practice. Take your time, document your learning, and enjoy the journey!

