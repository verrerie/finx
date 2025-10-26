# Transaction Planning Prompt

## Purpose
Systematically plan and analyze a buy or sell decision before executing, ensuring it aligns with your investment strategy and understanding the full impact on your portfolio.

## How to Use
1. Decide what you want to do (buy/sell) and why
2. Use what-if analysis to model the impact
3. Work through this checklist
4. Document your decision process
5. Execute only if all checks pass

## Pre-Transaction Checklist

### 🎯 Define the Transaction
- [ ] Action: BUY or SELL
- [ ] Symbol: ________
- [ ] Quantity: ________ shares
- [ ] Target Price: $________
- [ ] Estimated Total: $________
- [ ] Timeline: Execute by ________

### 💭 Understand Your WHY

#### For BUY Transactions
- [ ] **What's my investment thesis?**
  - Why this company?
  - Why now?
  - What's my timeframe?

- [ ] **Have I done my research?**
  - Analyzed fundamentals
  - Understood business model
  - Reviewed financial metrics
  - Compared to peers
  - Checked valuation

- [ ] **Is the price right?**
  - Historical valuation context
  - Compared to intrinsic value estimate
  - Entry price rationale
  - Margin of safety

#### For SELL Transactions
- [ ] **Why am I selling?**
  - ✅ Thesis broken
  - ✅ Better opportunity elsewhere
  - ✅ Overvalued significantly
  - ✅ Rebalancing portfolio
  - ✅ Tax loss harvesting
  - ❌ "Stock is down" (emotional)
  - ❌ "Need quick cash" (forced)
  - ❌ "Fear of further drop" (panic)

- [ ] **Have I reviewed the thesis?**
  - Did original reasoning hold?
  - What changed?
  - Am I being rational?

### 📊 Analyze the Impact

Use `analyze_what_if` tool to model:

#### Portfolio Impact Analysis
```
Current Portfolio:
- Total Value: $________
- Cash Available: $________
- Position Count: ________

After Transaction:
- Total Value: $________
- Cash: $________
- [SYMBOL] Weight: ___% → ___%
```

#### Position-Level Impact
For BUY:
- New quantity: ________ shares
- New average cost: $________
- Portfolio allocation: ____%

For SELL:
- Remaining quantity: ________ shares
- Realized gain/loss: $________
- Tax impact (est 15%): $________

### 💰 Financial Considerations
- [ ] **Can I afford this?** (for BUY)
  - Cash available
  - Emergency fund intact
  - Not using leverage

- [ ] **Tax implications understood?** (for SELL)
  - Short-term vs long-term capital gains
  - Tax cost of selling
  - Wash sale rules if buying back

- [ ] **Fees and costs considered?**
  - Trading fees
  - Bid-ask spread
  - Tax costs

### ⚖️ Portfolio Fit
- [ ] **How does this affect diversification?**
  - Sector allocation
  - Position concentration
  - Risk profile

- [ ] **Does it match my strategy?**
  - Growth vs value
  - Size (large/mid/small cap)
  - Geographic exposure

- [ ] **Position sizing appropriate?**
  - Not too concentrated (>20%)
  - Sized to conviction level
  - Risk-appropriate

### 🚨 Risk Assessment

#### For BUY
- [ ] **What could go wrong?**
  - Competitive threats
  - Regulatory risks
  - Market risks
  - Company-specific risks

- [ ] **What's my downside?**
  - Maximum loss acceptable
  - Stop-loss strategy
  - Position sizing to limit risk

- [ ] **Am I diversifying or concentrating?**
  - Adding to existing exposure
  - True diversification benefit

#### For SELL
- [ ] **What if I'm wrong?**
  - Opportunity cost if stock rises
  - Regret minimization
  - Rational vs emotional

- [ ] **Tax efficiency considered?**
  - Best time to realize gains/losses
  - Year-end tax planning
  - Holding period considerations

### 📝 Documentation Requirements
- [ ] **Created/updated investment thesis**
  - For BUY: Created new thesis
  - For SELL: Updated thesis with exit rationale

- [ ] **Documented decision process**
  - Why this transaction
  - What analysis was done
  - What alternatives were considered

- [ ] **Set success criteria**
  - What would validate decision
  - When to review
  - Exit strategy (for BUY)

## Decision Framework

### BUY Decision - Must Answer YES to ALL
- ✅ Have I researched thoroughly?
- ✅ Do I understand the business?
- ✅ Is my thesis documented?
- ✅ Is the valuation reasonable?
- ✅ Does it fit my portfolio?
- ✅ Can I afford the position?
- ✅ Am I comfortable with the risks?
- ✅ Is this better than alternatives?

### SELL Decision - Must Answer YES to ONE+
- ✅ Thesis fundamentally broken?
- ✅ Better opportunity elsewhere?
- ✅ Significantly overvalued?
- ✅ Rebalancing necessary?
- ✅ Tax strategy benefit?

❌ **RED FLAGS - Do NOT Proceed if:**
- Acting on emotion (fear/greed)
- Following "hot tips"
- FOMO (fear of missing out)
- Revenge trading
- Insufficient research
- Would blow up portfolio allocation
- Can't articulate clear thesis

## Execution Planning

### Order Strategy
- [ ] **Order type?**
  - Market order (immediate, less control)
  - Limit order (price control, may not fill)
  - Stop-loss order (risk management)

- [ ] **Timing?**
  - Market hours or after-hours
  - All at once or scale in/out
  - Any specific catalysts to wait for

- [ ] **Price target?**
  - Maximum buy price (for BUY)
  - Minimum sell price (for SELL)
  - Rationale for target

### After Execution
- [ ] Record transaction in portfolio
- [ ] Save thesis to knowledge base
- [ ] Set review date
- [ ] Update portfolio allocation tracking

## Output Format

Create a transaction plan document:

```
# Transaction Plan: [BUY/SELL] [SYMBOL] - [DATE]

## Transaction Details
- Action: [BUY/SELL]
- Symbol: [SYMBOL]
- Quantity: [X] shares
- Target Price: $[XXX]
- Total Amount: $[X,XXX]

## Investment Thesis
[For BUY: Your thesis]
[For SELL: Reason for exit]

## Analysis Summary
### What-If Impact
- Portfolio weight change: X% → X%
- [For BUY] New avg cost: $XXX
- [For SELL] Realized gain/loss: $XXX
- Tax impact: $XXX

### Rationale
1. [Key reason 1]
2. [Key reason 2]
3. [Key reason 3]

### Risks Considered
- [Risk 1 and mitigation]
- [Risk 2 and mitigation]

### Alternatives Considered
- [Alternative 1] - Why not chosen
- [Alternative 2] - Why not chosen

## Decision: PROCEED / WAIT / CANCEL
**Reasoning:**
[Final decision and why]

## Execution Plan
- Order Type: [Market/Limit]
- Price Limit: $[XXX]
- Timing: [When to execute]
- Review Date: [When to reassess]

## Success Criteria
This decision will be considered successful if:
1. [Criteria 1]
2. [Criteria 2]

I will review this decision on: [DATE]

## Learning Goals
From this transaction, I want to learn:
- [Learning goal 1]
- [Learning goal 2]
```

## After Transaction

Once executed:
1. **Record Transaction**: Use `add_transaction` tool
2. **Save Plan**: To `.cursor/knowledge/journal/YYYY-MM-DD-transaction-[SYMBOL]-[BUY/SELL].md`
3. **Update Thesis**: Ensure thesis is current
4. **Set Calendar**: Reminder to review decision
5. **Reflect**: What can I learn from this process?

## Educational Focus

Learn from this process:
- **Decision-Making**: Systematic vs emotional
- **Risk Management**: Sizing positions appropriately
- **Tax Efficiency**: Minimizing tax drag
- **Portfolio Construction**: Building diversified portfolio
- **Self-Awareness**: Recognizing biases

## Common Mistakes to Avoid

### Buying Mistakes
- ❌ Chasing momentum without thesis
- ❌ Buying all at once without scale-in plan
- ❌ Ignoring valuation because "I like the company"
- ❌ Position too large for portfolio
- ❌ Following tips without research

### Selling Mistakes
- ❌ Selling winners too early
- ❌ Holding losers too long
- ❌ Panic selling on volatility
- ❌ Selling for tax losses then buying back (wash sale)
- ❌ Not considering tax implications

### General Mistakes
- ❌ Trading too frequently
- ❌ Acting on emotions
- ❌ Not having a plan
- ❌ Failing to document reasoning
- ❌ Not learning from past decisions

## Remember

**This is not financial advice.** This is a learning exercise to help you:
- Make deliberate, not impulsive, decisions
- Consider all angles before acting
- Document your reasoning
- Learn from each transaction

The goal is to become a better investor over time by developing good habits and processes.

For significant transactions, consider consulting with:
- Financial advisor (investment strategy)
- Tax professional (tax implications)
- Estate planner (if applicable)

