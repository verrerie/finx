# Learning Prompts for Financial Analysis

This directory contains structured prompts to help you learn investment concepts through hands-on exploration with real market data.

## Available Prompts (Phase 1a)

### 1. `learn-concept.md` - Deep Dive into Financial Metrics

**Use when**: You want to thoroughly understand a specific financial concept or metric

**What you'll learn:**
- Clear definition and formula
- Why the metric matters
- How to calculate and interpret it
- Context and industry norms
- Common pitfalls to avoid
- Related concepts to explore next

**Example concepts to explore:**
- P/E Ratio, PEG Ratio, Market Cap
- ROE, ROA, ROIC
- Dividend Yield, Payout Ratio
- Debt-to-Equity, Interest Coverage
- Profit Margin, Operating Margin
- EPS, Revenue Growth, Free Cash Flow

**Typical session:**
```
"I want to learn about Return on Equity (ROE)"
→ Learn definition, formula, interpretation
→ See examples from 3-4 real companies
→ Practice analyzing a company's ROE
→ Document in knowledge/concepts/roe.md
→ Time: 15-30 minutes
```

### 2. `decode-financials.md` - Understand a Company

**Use when**: You want to deeply understand a specific company's financial health and business

**What you'll learn:**
- What the company does and how they make money
- Key financial metrics and what they mean
- How they compare to competitors
- Risks and red flags to watch
- Bull case and bear case for the stock
- What additional research you need

**Best for:**
- Before making an investment decision
- Building your knowledge base
- Developing your investment thesis
- Understanding a sector through a leading company

**Typical session:**
```
"I want to understand Microsoft's financial health and business fundamentals"
→ Learn about their business model
→ Review all key financial metrics
→ Compare to peers (Apple, Google)
→ Identify risks and opportunities
→ Document in knowledge/journal/YYYY-MM-DD-microsoft-analysis.md
→ Time: 30-60 minutes
```

### 3. `compare-stocks.md` - Learn by Comparison

**Use when**: You want to understand companies better by seeing them side-by-side

**What you'll learn:**
- How similar companies differ in strategy
- Trade-offs in business decisions
- What "good" looks like in different contexts
- How to choose between investment options
- Industry/sector dynamics and patterns

**Comparison types:**
- **Direct competitors**: Coca-Cola vs Pepsi, Nike vs Adidas
- **Value vs Growth**: Johnson & Johnson vs Tesla
- **Large vs Small**: Amazon vs Shopify
- **Same sector leaders**: Microsoft vs Apple vs Google

**Typical session:**
```
"I want to compare Apple and Microsoft"
→ Compare business models and strategies
→ Head-to-head financial metrics
→ Understand strengths/weaknesses
→ Learn which fits different investment goals
→ Document in knowledge/journal/YYYY-MM-DD-aapl-vs-msft.md
→ Time: 30-45 minutes
```

## How to Use These Prompts

### In Cursor

1. **Open the prompt file** you want to use
2. **Copy the prompt** section into Cursor chat
3. **Fill in the placeholders** (like [COMPANY] or [CONCEPT])
4. **Let the AI guide you** through the learning process
5. **Ask follow-up questions** as they come up
6. **Document what you learn** using the provided templates

### Learning Workflow

**Beginner Path** (Start here if new to investing):
1. Use `learn-concept.md` for basic metrics (P/E ratio, market cap, revenue)
2. Use `decode-financials.md` for a large, well-known company (Apple, Microsoft)
3. Use `compare-stocks.md` to compare two familiar companies

**Intermediate Path** (After understanding basics):
1. Use `learn-concept.md` for advanced metrics (ROE, ROIC, FCF yield)
2. Use `decode-financials.md` for companies in new sectors
3. Use `compare-stocks.md` to understand sector dynamics

**Research Workflow** (When considering an investment):
1. Start with `decode-financials.md` for the target company
2. Use `compare-stocks.md` to compare to 2-3 peers
3. Use `learn-concept.md` if you need to understand specific metrics better
4. Document your thesis in knowledge/journal/
5. Review your analysis before making decisions

## Integration with MCP Tools

These prompts work seamlessly with your Market Data MCP Server:

**Available tools:**
- `get_quote` - Get current price and metrics
- `get_historical_data` - See price history
- `search_symbol` - Find ticker symbols
- `get_company_info` - Get comprehensive financial data
- `explain_fundamental` - Learn about specific metrics
- `compare_peers` - Side-by-side company comparisons

**The AI will automatically use these tools** when you use the prompts!

## Documentation Templates

Each prompt includes templates for documenting your learning:

- **Concepts**: `knowledge/concepts/[concept-name].md`
- **Company Analysis**: `knowledge/journal/YYYY-MM-DD-[company]-analysis.md`
- **Comparisons**: `knowledge/journal/YYYY-MM-DD-[company1]-vs-[company2].md`

**Why document?**
- Solidifies learning (writing = thinking)
- Build your personal knowledge base
- Review your reasoning over time
- Learn from successes AND mistakes
- Track how your understanding evolves

## Tips for Effective Learning

### 1. Start Small
- One concept at a time
- One company per session
- Compare only 2-3 companies initially
- Build depth before breadth

### 2. Use Real Examples
- Always use actual companies, not hypotheticals
- Compare real data, not textbook examples
- Your money (theoretical or real) on the line = better learning

### 3. Ask "Why"
- Don't just accept the numbers
- Understand WHY metrics are what they are
- Ask: "What business decisions led to these results?"

### 4. Document Everything
- Write down what you learn
- Note questions that arise
- Track your reasoning
- Review past analyses to see how you've grown

### 5. Be Patient
- Financial literacy is a journey, not a destination
- Understanding deeply > knowing superficially
- Quality of analysis > quantity of stocks researched
- It's okay to say "I don't understand this yet"

### 6. Question Your Assumptions
- Play devil's advocate to your own analysis
- Consider the bear case, not just the bull case
- Ask: "What would change my mind?"
- Remember: No investment is a "sure thing"

## Learning Progression

### Phase 1a (Current): Fundamentals
**Focus**: Understanding financial metrics and company analysis
**Prompts**: All three prompts in this directory
**Goal**: Read financial data and understand what it means

### Phase 1b (Next): Portfolio Management
**New prompts** (coming soon):
- `analyze-portfolio.md` - Review your overall portfolio
- `what-if-scenario.md` - Explore scenarios and learn from them

**Goal**: Make informed decisions about your actual portfolio

### Future Phases
**Phase 2**: Financial statement deep dives and valuation
**Phase 3**: Risk analysis and portfolio theory
**Phase 4**: Advanced research tools

## Common Questions

**Q: Do I need to use all three prompts for every stock?**
A: No! Use what's helpful for your current learning goal. Sometimes just one prompt is enough.

**Q: How long should each session take?**
A: 15-60 minutes depending on depth. Quality > speed. It's better to understand one company deeply than to superficially analyze five.

**Q: What if I don't understand something?**
A: Perfect! Ask follow-up questions. The AI is here to teach, not just provide data. Questions like "Can you explain that differently?" or "Why does that matter?" are encouraged.

**Q: Should I analyze stocks I want to buy?**
A: Not necessarily! Analyzing well-known companies (even if you don't plan to buy them) is a great way to learn. You're building mental models that transfer to other companies.

**Q: How do I know if I'm learning?**
A: Try explaining a concept to someone else (or write it down). If you can teach it, you've learned it.

## Getting Help

If you're stuck or confused:
1. Ask clarifying questions in Cursor chat
2. Use the `learn-concept.md` prompt for specific metrics you don't understand
3. Review the `.cursorrules` file for examples of good explanations
4. Check your `knowledge/` directory for concepts you've already documented

## Remember

**This is NOT financial advice.** You are:
- ✅ Learning financial concepts and analysis skills
- ✅ Building critical thinking about investments
- ✅ Developing a systematic approach to research
- ✅ Creating a knowledge base for future decisions

**You are NOT:**
- ❌ Getting stock recommendations
- ❌ Receiving guarantees about returns
- ❌ Getting personalized financial planning
- ❌ Bypassing the need for professional advice when appropriate

---

**Happy Learning!** 🎓

The best investment you can make is in your own financial education.

