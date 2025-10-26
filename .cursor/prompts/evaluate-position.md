# Position Evaluation Prompt

## Purpose
Deep dive into a single position to evaluate its performance, review your investment thesis, and decide on next steps (hold, buy more, or sell).

## How to Use
1. Choose a position to evaluate (symbol)
2. Have portfolio ID and current market prices ready
3. Run through this prompt
4. Document conclusions and update thesis if needed

## Evaluation Framework

### 📈 Current Position Details
- [ ] Symbol and company name
- [ ] Quantity held
- [ ] Average cost basis
- [ ] Current market price
- [ ] Position value
- [ ] Unrealized gain/loss
- [ ] % of total portfolio

### 🎯 Original Thesis Review
- [ ] **What was my original thesis?**
  - Why did I buy this?
  - What was the investment case?
  - What timeline did I have in mind?

- [ ] **Has the thesis held up?**
  - ✅ Thesis intact
  - ⚠️ Partially validated
  - ❌ Thesis broken

- [ ] **What's changed since I bought?**
  - Company developments
  - Market conditions
  - My understanding

### 💡 Current Analysis
- [ ] **Company Fundamentals** (use market data tools)
  - Revenue growth
  - Profitability
  - Valuation metrics (P/E, P/S, etc.)
  - Balance sheet health

- [ ] **Competitive Position**
  - Market share trends
  - Competitive advantages
  - Industry dynamics

- [ ] **Recent Developments**
  - Earnings results
  - Product launches
  - Management changes
  - Regulatory impacts

### 📊 Performance Assessment
- [ ] **Absolute Performance**
  - Total return: $XXX (+/-X%)
  - Annualized return: X%
  - Time held: X months

- [ ] **Relative Performance**
  - vs S&P 500
  - vs sector peers
  - vs my expectations

- [ ] **Risk-Adjusted Returns**
  - Has volatility been acceptable?
  - Drawdown analysis
  - Risk vs reward

### 🤔 Critical Questions

#### Bull Case Review
1. **What's going RIGHT?**
   - Strengths playing out as expected
   - Positive surprises
   - Competitive advantages solidifying

2. **What's the UPSIDE?**
   - Growth catalysts ahead
   - Multiple expansion potential
   - New opportunities

3. **Why should I HOLD or BUY MORE?**
   - Thesis getting stronger
   - Undervalued relative to potential
   - New developments support case

#### Bear Case Review
1. **What's going WRONG?**
   - Weaknesses materializing
   - Negative surprises
   - Competitive threats

2. **What's the DOWNSIDE?**
   - Risk factors ahead
   - Multiple compression risk
   - Deteriorating fundamentals

3. **Why should I SELL or REDUCE?**
   - Thesis invalidated
   - Better opportunities elsewhere
   - Risk/reward no longer attractive

### 🔍 Position Sizing Analysis
- [ ] **Is this the right size?**
  - Current weight: X%
  - Target weight: X%
  - Overweight or underweight?

- [ ] **Should I adjust?**
  - Trim if overweight
  - Add if underweight
  - What's the right allocation?

### 💰 What-If Scenarios

Use the `analyze_what_if` tool to model:

#### Scenario 1: Add to Position
```
If I buy [quantity] shares at $[price]:
- New average cost: $XXX
- New position size: X shares
- New portfolio weight: X%
- Cash required: $X,XXX
```

#### Scenario 2: Trim Position
```
If I sell [quantity] shares at $[price]:
- Realized gain/loss: $XXX
- Tax impact (est): $XXX
- Remaining position: X shares
- New portfolio weight: X%
```

#### Scenario 3: Full Exit
```
If I sell entire position at $[price]:
- Total proceeds: $X,XXX
- Realized gain/loss: $XXX
- Tax impact (est): $XXX
- Cash to redeploy: $X,XXX
```

## Decision Framework

### HOLD Decision Criteria
✅ Hold if:
- Thesis remains intact
- Valuation still attractive
- No better opportunities
- Long-term conviction strong
- Size appropriate for portfolio

### BUY MORE Decision Criteria
✅ Buy more if:
- Thesis strengthening
- Price pullback creates opportunity
- Underweight relative to conviction
- Cash available to deploy
- Risk/reward improved

### SELL Decision Criteria
✅ Sell if:
- Thesis broken
- Better opportunities elsewhere
- Overvalued significantly
- Risk profile changed
- Need to rebalance

⚠️ **Avoid Emotional Decisions:**
- Don't sell just because it's down
- Don't buy more just to "average down"
- Don't hold losing positions out of hope
- Don't sell winners too early

## Action Items

Based on evaluation, choose one:

### 1. HOLD (No Action)
- [x] Update thesis with current view
- [x] Set next review date
- [x] Document why holding

### 2. BUY MORE
- [x] Model with what-if analysis
- [x] Determine quantity and price target
- [x] Update thesis with increased conviction
- [x] Document reasoning

### 3. TRIM / SELL
- [x] Model with what-if analysis
- [x] Determine quantity and price target
- [x] Consider tax implications
- [x] Document reasoning
- [x] Plan for redeployment of capital

## Output Format

Create a position evaluation document:

```
# Position Evaluation: [SYMBOL] - [DATE]

## Position Summary
- Company: [Name]
- Quantity: X shares
- Average Cost: $XXX
- Current Price: $XXX
- Position Value: $X,XXX
- Gain/Loss: $XXX (+/-X.X%)
- Portfolio Weight: X.X%

## Thesis Review
### Original Thesis
[Why I bought this]

### Thesis Status: ✅ INTACT / ⚠️ MONITORING / ❌ BROKEN
[Explanation]

### Key Changes Since Purchase
- [Change 1]
- [Change 2]

## Current Analysis
### Bull Case
- [Positive factor 1]
- [Positive factor 2]

### Bear Case
- [Risk factor 1]
- [Risk factor 2]

### Valuation Assessment
[Current valuation vs historical/peers]

## Performance Review
- Total Return: X.X%
- vs S&P 500: X.X%
- vs Sector: X.X%

## Decision: HOLD / BUY / SELL
**Reasoning:**
[Detailed explanation]

**Action Plan:**
1. [Specific next step]
2. [Timeline]
3. [Success metrics]

## Learning Points
- [What I learned from this position]
- [Patterns to remember]
- [Concepts to study further]
```

## Follow-Up Actions

After evaluation:
1. **Update Thesis**: Use `update_thesis` tool
2. **Execute Decision**: Plan transaction if needed
3. **Document**: Save to `.cursor/knowledge/journal/YYYY-MM-DD-[SYMBOL]-evaluation.md`
4. **Set Review**: When to re-evaluate?

## Educational Focus

Learn from this evaluation:
- **Thesis Validation**: How to assess if investment rationale holds
- **Valuation Analysis**: Understanding if price is right
- **Risk Management**: When to cut losses vs hold
- **Position Sizing**: Optimal allocation for conviction level

## Remember

**This is not financial advice.** This is a learning exercise to help you:
- Think critically about individual investments
- Separate facts from emotions
- Make informed decisions
- Learn from both wins and losses

Consider consulting with a financial advisor for significant investment decisions, especially regarding tax implications.

