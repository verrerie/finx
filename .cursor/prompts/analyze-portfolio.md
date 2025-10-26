# Portfolio Analysis Prompt

## Purpose
Conduct a comprehensive analysis of your investment portfolio to understand its performance, composition, and areas for improvement.

## How to Use
1. Have your portfolio ID ready
2. Run this prompt
3. Review the analysis and recommendations
4. Document findings in `.cursor/knowledge/journal/`

## Analysis Checklist

### 📊 Current State
- [ ] List all holdings with current values
- [ ] Calculate portfolio performance metrics
- [ ] Identify position weights and concentration
- [ ] Review transaction history (last 10)

### 🎯 Composition Analysis
- [ ] **Sector Allocation**: What sectors am I exposed to?
- [ ] **Position Sizing**: Are any positions too large/small?
- [ ] **Concentration Risk**: Do I have adequate diversification?
- [ ] **Currency Exposure**: What's my USD/international split?

### 💰 Performance Review
- [ ] **Total Return**: What's my overall gain/loss?
- [ ] **Best Performers**: Which positions are up the most?
- [ ] **Worst Performers**: Which positions are down?
- [ ] **Cost Basis**: Where's my average entry price?

### 📈 Position-Level Analysis
For each major holding (>5% of portfolio):
- [ ] Current value vs cost basis
- [ ] Unrealized gain/loss
- [ ] % of portfolio
- [ ] Review investment thesis (if exists)
- [ ] Check if still aligns with strategy

### ⚠️ Risk Assessment
- [ ] **Overconcentration**: Any position >20%?
- [ ] **Sector Exposure**: Too much in one sector?
- [ ] **Volatility**: High-risk positions identified?
- [ ] **Correlation**: Are holdings too similar?

### 🔍 Opportunities
- [ ] **Rebalancing**: What needs adjusting?
- [ ] **Tax Loss Harvesting**: Any losses to realize?
- [ ] **Watchlist Review**: Ready to buy anything?
- [ ] **Thesis Review**: Any theses need updating?

## Analysis Questions

### Understanding Performance
1. **Why** are my best performers doing well?
   - Was it thesis validation or luck?
   - Can I learn patterns to replicate?
   
2. **Why** are my worst performers down?
   - Did the thesis break?
   - Is it temporary or structural?
   - Should I exit or average down?

3. **How** does my portfolio compare to benchmarks?
   - vs S&P 500 return
   - vs sector averages
   - Risk-adjusted returns

### Strategic Questions
1. **Diversification**: Do I have too many eggs in one basket?
2. **Allocation**: Does current allocation match my target?
3. **Risk Tolerance**: Is portfolio risk aligned with my goals?
4. **Time Horizon**: Do positions match my investment timeline?

### Action Items
1. **Rebalance**: What trades would improve allocation?
2. **Research**: Which positions need deeper analysis?
3. **Documentation**: What theses should I create/update?
4. **Learning**: What concepts do I need to understand better?

## Output Format

Create a structured analysis document:

```
# Portfolio Analysis - [DATE]

## Executive Summary
- Total Portfolio Value: $XX,XXX
- Total Return: $X,XXX (+/-X.X%)
- Number of Holdings: X
- Top 3 Positions: X%, X%, X%

## Holdings Breakdown
[Table of all positions with values, weights, gains]

## Performance Metrics
- Best Performer: [SYMBOL] +X%
- Worst Performer: [SYMBOL] -X%
- Realized Gains: $X,XXX
- Unrealized Gains: $X,XXX

## Risk Analysis
- Concentration Risk: [Assessment]
- Sector Exposure: [Breakdown]
- Diversification Score: [Assessment]

## Action Items
1. [Specific action]
2. [Specific action]
3. [Specific action]

## Learning Points
- [Key insight from analysis]
- [Pattern observed]
- [Concept to study further]
```

## Follow-Up Actions

After analysis:
1. **Document**: Save analysis to `.cursor/knowledge/journal/YYYY-MM-DD-portfolio-review.md`
2. **Update Theses**: Revise investment theses as needed
3. **Plan Trades**: Use what-if analysis for any proposed changes
4. **Set Reminders**: Note when to review again

## Tips for Deep Analysis

### Compare Against Goals
- What was my original strategy?
- Am I sticking to my plan?
- Do I need to adjust my approach?

### Look for Patterns
- Do winning positions share characteristics?
- What can I learn from losers?
- Am I making emotional decisions?

### Be Honest
- Did I follow my thesis?
- Am I holding losers too long?
- Am I chasing performance?

### Think Long-Term
- Short-term volatility vs long-term conviction
- Market conditions vs company fundamentals
- Noise vs signal

## Educational Focus

Use this analysis to learn:
- **Portfolio Construction**: How to build balanced portfolios
- **Risk Management**: Identifying and mitigating risks
- **Performance Attribution**: Understanding what drives returns
- **Behavioral Finance**: Recognizing biases in decisions

## Remember

**This is not financial advice.** This is a learning exercise to help you:
- Understand your portfolio composition
- Think critically about your investments
- Document your decision-making process
- Learn from both successes and failures

For significant portfolio decisions, consider consulting with a financial advisor.

