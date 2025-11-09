# Sentiment Analysis Command

This command guides the AI agent through a comprehensive analysis of significant market movements or events, providing educational context and verified information.

## Core Principles

**Educational First**
- Always explain WHY, not just WHAT
- Provide context and background for every finding
- Verify information with multiple sources
- Link concepts to broader market dynamics
- Encourage critical thinking over blind acceptance

**Multiple Perspectives**
- Present different viewpoints and frameworks
- Show trade-offs and competing explanations
- Avoid dogmatic statements
- Acknowledge uncertainty and complexity
- Compare to historical precedents when relevant

**Verification Required**
- Always verify key facts with web searches
- Cross-reference multiple sources
- Distinguish between facts and opinions
- Note data limitations or delays
- Acknowledge when information is incomplete

**Tool Priority**
- **PRIMARY: Internet Search (`web_search`)** - Use as the main tool for gathering information, news, analysis, and context
- **SECONDARY: MCP Market Data Tools** - Use only for verifying specific data points or when search doesn't provide needed numbers
- **Rationale**: Internet search provides comprehensive information about market events, causes, and context, while MCP tools are better for specific data verification

## Workflow Steps

**Note:** Steps 2-4 are iterative - you may need to search again after quantifying, or verify after finding causes. Don't treat them as strictly sequential.

### 1. Identify the Market Movement or Event

**Action Required:**

1. **Parse User Query:**
   - Extract key information from user's question:
     - Market movement type (drop, surge, volatility spike, etc.)
     - Date range or specific date
     - Affected assets/sectors/companies
     - If information is missing, note what needs clarification

2. **Initial Search (PRIMARY: Internet Search):**
   - **If user query is clear**, immediately start searching:
     - Use the user's query keywords: `web_search("[user query keywords] [date]")`
     - Example: If user asks "Why did tech stocks drop November 1-8, 2025?"
       - Search: `web_search("tech stocks drop November 1-8 2025")`
   - **If user query is vague**, search broadly first:
     - Search: `web_search("[movement type] [date range] market")`
     - Example: If user asks "What happened to stocks last week?"
       - Search: `web_search("stock market movement last week")`
   - **Goal**: Get initial understanding of what happened

3. **Extract Key Details from Search Results:**
   - Review search results for reported numbers, dates, and context
   - Extract: specific movement type, affected assets/sectors, time period, magnitude, companies/indices
   - Cross-reference multiple sources for accuracy
   - Document findings in organized format

4. **If Information is Still Missing:**
   - Ask user for clarification: date range, companies/sectors, or what aspect to understand

**Tool Usage:**
- Use `web_search` tool (not bash command)
- Pass search query as string parameter: `web_search("query string")`
- Use MCP tools only if search doesn't provide needed data

**Example Tool Calls:**
```python
# Correct usage:
web_search("tech stocks decline November 2025")
web_search("Nvidia stock price November 7 2025")

# MCP tools (only if needed):
mcp_finx-market-data_get_historical_data("NVDA", "1mo")
mcp_finx-market-data_get_quote("NVDA")
```


### 2. Quantify the Movement

**Action Required:**

1. **Gather Quantitative Data (PRIMARY: Internet Search):**
   - Search for reported numbers: `web_search("[stock/sector] [movement] [date] percentage")`
   - Search for market indices: `web_search("[index] [date] [movement]")`
   - Search for specific stock movements: `web_search("[Company] stock price [date range]")`
   - Search for volume data: `web_search("[stock/sector] trading volume [date]")`
   - Search for volatility data: `web_search("VIX [date] volatility")`

2. **Extract Data from Search Results:**
   - Review search results for reported numbers, prices, and percentages
   - Extract: percentage changes (day/week/month), point movements, volume changes, volatility (VIX), sector performance, market breadth
   - Cross-reference multiple sources for accuracy
   - Note any discrepancies between sources

3. **Organize Data in Tables:**
   ```
   | Stock/Index | Start Price | End Price | Change | % Change | Volume |
   |-------------|-------------|-----------|--------|----------|--------|
   | [Name]     | $X.XX       | $Y.YY     | $Z.ZZ  | P%       | [Data] |
   ```

4. **Verify Numbers (if needed):**
   - **SECONDARY**: Use MCP tools to verify specific numbers if search results conflict
   - Cross-check numbers between search results and MCP data
   - Calculate percentage changes: `((end - start) / start) * 100` (if needed for verification)

**Note:** This step is iterative - you may need to search again after finding causes, or verify after quantifying.

### 3. Search for Root Causes (Primary: Internet Search)

**Action Required:**

1. **Start with Broad Searches:**
   - Search: `web_search("[movement] [date range]")`
   - Search: `web_search("[movement] [date range] [sector]")`
   - Goal: Get general understanding of what happened

2. **Narrow to Specific Causes:**
   - Company/sector: `web_search("[Company] stock [movement] [date]")`
   - Economic data: `web_search("[economic indicator] [date] market impact")`
   - News events: `web_search("[event] [date] market news")`
   - Policy: `web_search("[policy] [date] market impact")`

3. **Search for Multiple Perspectives:**
   - Analysis: `web_search("[event] [date] analysis")`
   - Commentary: `web_search("[event] [date] bullish bearish")`
   - Official statements: `web_search("[Fed/Company] statement [date]")`

4. **Verify Key Claims:**
   - Exact quotes: `web_search('"[exact quote]" [date]')`
   - Specific numbers: `web_search("[number] [date] [context]")`

**When to Stop Searching:**
- At least 2-3 sources confirm the same root causes
- Movement is quantified with specific numbers
- Key facts verified from multiple sources
- Official statements or authoritative sources found
- Additional searches not revealing new information

**Common Root Causes to Investigate:**
- **Valuation concerns** - P/E ratios, growth expectations, bubble fears
- **Economic data** - Employment, inflation, GDP, consumer sentiment
- **Monetary policy** - Fed rate decisions, policy statements
- **Geopolitical events** - Trade tensions, conflicts, elections
- **Sector-specific** - Industry trends, regulatory changes, competition
- **Company-specific** - Earnings, guidance, management changes, product launches
- **Technical factors** - Profit-taking, sector rotation, momentum shifts
- **External shocks** - Natural disasters, pandemics, major accidents

### 4. Verify Information (Primary: Internet Search)

**Action Required:**

1. **Verify Numbers:**
   - Search: `web_search("[stock] [percentage]% [date]")`
   - Search: `web_search("[index] [date] [movement]")`
   - Cross-check dates, prices, volume, volatility from multiple sources
   - **SECONDARY**: Use MCP tools only if search results conflict

2. **Verify Causes:**
   - Search: `web_search("[Fed/Company] statement [date]")`
   - Search: `web_search("[event] [date] before [market movement]")`
   - Find multiple sources confirming the same explanation
   - Distinguish correlation vs causation through analysis

3. **Verify Context:**
   - Historical: `web_search("[event] similar [historical event]")`
   - Sector averages: `web_search("[sector] average [metric] [date]")`
   - Economic data: `web_search("[economic indicator] [date] release")`
   - Policy: `web_search("[policy] announcement [date]")`

**When Sources Conflict:**
- Note the conflict explicitly
- Identify more authoritative sources (official vs. commentary)
- Present both viewpoints with attribution
- Explain why sources differ (timing, methodology, perspective)
- State what's agreed upon vs. what differs

**Verification Checklist:**
- [ ] Key numbers verified with at least 2 sources
- [ ] Root causes confirmed by multiple sources
- [ ] Dates and timing verified
- [ ] Economic data cross-checked
- [ ] Official statements reviewed
- [ ] Historical context provided
- [ ] Conflicting sources identified and explained

### 5. Analyze Impact

**Action Required:**

1. **Gather Impact Data (PRIMARY: Internet Search):**
   - Search for market indices performance: `web_search("[index] [date] performance")`
   - Search for sector rotation: `web_search("sector rotation [date] market")`
   - Search for volatility data: `web_search("VIX [date] volatility")`
   - Search for volume data: `web_search("trading volume [date] market")`
   - Search for market breadth: `web_search("market breadth [date] advancing declining")`

2. **Analyze Each Dimension:**

   **Immediate Impact:**
   - **Market indices**: Compare to historical averages, note significance
     - Search: `web_search("[index] [date] historical average")`
   - **Sector rotation**: Identify which sectors gained/lost, why
     - Search: `web_search("sector performance [date] winners losers")`
   - **Volatility**: Compare VIX to historical levels, note spikes
     - Search: `web_search("VIX [date] historical levels")`
   - **Volume**: Compare to average, note unusual activity
     - Search: `web_search("trading volume [date] average")`
   - **Market breadth**: Note if broad-based or isolated
     - Search: `web_search("market breadth [date]")`

   **Broader Implications:**
   - **Investor sentiment**: Did sentiment shift?
     - Search: `web_search("investor sentiment [date] market")`
   - **Valuation reassessment**: Are valuations being questioned?
     - Search: `web_search("valuation concerns [date] market")`
   - **Economic outlook**: What does this say about the economy?
     - Search: `web_search("economic outlook [date] market impact")`
   - **Policy implications**: Could this affect Fed/government policy?
     - Search: `web_search("Fed policy [date] market impact")`
   - **Sector trends**: Is this part of a larger trend?
     - Search: `web_search("[sector] trend [date range]")`
   - **Historical context**: How does this compare to past events?
     - Search: `web_search("[event] similar historical event")`

3. **Apply Analysis Framework:**
   - **Magnitude**: How significant is this movement? (Compare to historical norms)
   - **Scope**: How widespread is the impact? (Broad-based or isolated)
   - **Duration**: Is this a one-day event or ongoing trend? (Check if continuing)
   - **Precedents**: Has this happened before? What followed? (Search for similar events)
   - **Fundamentals**: Does this align with or contradict fundamentals? (Compare to company/sector fundamentals)

4. **Present Analysis:**
   - Use tables for quantitative data
   - Use bullet points for qualitative analysis
   - Include comparisons to historical norms
   - Note what's unusual or significant

### 6. Provide Educational Context

**Action Required:**

**Structure Your Response:**
1. **Start with "What Happened"** - Clear, concise summary
2. **Present "The Numbers"** - Quantified data in tables
3. **Explain "Root Causes"** - With evidence and context
4. **Provide "Why This Matters"** - Educational explanation
5. **Add "Historical Context"** - Comparisons to past events
6. **Present "Different Perspectives"** - Multiple viewpoints
7. **End with "What to Watch Next"** - Follow-up items

**When to Explain Concepts:**
- Always explain technical terms (VIX, P/E ratio, etc.)
- Explain why metrics matter, not just what they are
- Link to broader concepts when helpful
- Assume basic knowledge but explain advanced concepts

**Example Structure:**
```markdown
## What Happened
[Clear description of the movement]

## The Numbers
| Stock/Index | Start | End | Change | % Change |
|-------------|-------|-----|--------|----------|
| ... | ... | ... | ... | ... |

## Root Causes
1. [Cause 1] - [Explanation with context and evidence]
2. [Cause 2] - [Explanation with context and evidence]
...

## Why This Matters
[Educational explanation of significance]

## Historical Context
[Comparison to similar past events]

## Different Perspectives
- **Bullish**: [Viewpoint]
- **Bearish**: [Viewpoint]
- **Balanced**: [Viewpoint]

## What to Watch Next
- [Indicator 1]
- [Indicator 2]
- [Event 1]
- [Data release 1]
```

### 7. Create Journal Entry

After completing the analysis, offer to create a journal entry:

**Journal Entry Process:**

1. **Ask for Confirmation:**
   - Present a summary of what will be documented
   - Show the proposed filename
   - Ask: "Would you like me to create a journal entry for this analysis?"

2. **If Confirmed, Create Journal Entry:**

   **Naming Convention:**
   - Market events: `YYYY-MM-DD-[event-description].md`
   - Examples:
     - `2025-11-08-tech-market-decline.md`
     - `2025-10-20-ai-stock-surge.md`
     - `2025-09-15-volatility-spike.md`

   **Journal Entry Structure:**
   ```markdown
   # [Event Title] - [Date Range]

   ## Quick Summary
   - **Event**: [Brief description]
   - **Date Range**: [Start] to [End]
   - **Primary Impact**: [Sectors/assets affected]
   - **Magnitude**: [Key numbers]

   ## The Numbers
   [Quantified data with tables/charts]

   ## Root Causes
   [Detailed explanation of causes with evidence]

   ## Market Impact
   [Immediate and broader implications]

   ## Historical Context
   [Comparison to similar past events]

   ## Different Perspectives
   [Bullish, bearish, balanced views]

   ## What to Watch Next
   [Indicators, events, data to monitor]

   ## Key Learnings
   [Educational takeaways]

   ## Questions to Explore
   [Follow-up questions for deeper learning]

   ## Follow-Up Actions
   - [ ] [Action items]

   ## Updates
   [Add as situation evolves]
   ```

   **Content Guidelines:**
   - Include all verified numbers, root causes with evidence, educational context
   - Include multiple perspectives, what to monitor next, action items

3. **Save to Journal:**
   - Save file to `.cursor/knowledge/journal/`
   - Use appropriate filename based on naming convention
   - Ensure markdown formatting is correct

**If User Declines:**
- Acknowledge the decision
- Note that they can create journal entry later if needed

**Example Confirmation Prompt:**
```
I've completed the analysis of [event]. Would you like me to create a journal entry documenting this analysis?

The journal entry will include:
- Quantified data and performance metrics
- Verified root causes with evidence
- Market impact analysis
- Historical context and comparisons
- Multiple perspectives
- Key learnings and follow-up actions

Proposed filename: YYYY-MM-DD-[event-description].md
Location: .cursor/knowledge/journal/

Should I proceed with creating the journal entry?
```

### 8. Document Additional Findings

Consider documenting insights beyond the journal entry:
- Update `.cursor/knowledge/concepts/` for new concepts learned
- Create case studies in `.cursor/knowledge/frameworks/` for analysis frameworks
- Suggest: "This would be a good addition to your knowledge/concepts/[topic].md"

## Output Format

Use markdown formatting: tables for quantitative data, bullet points for lists, headers for sections, emphasis for key points.

**Structure:** What Happened → The Numbers → Root Causes → Why This Matters → Historical Context → Different Perspectives → What to Watch Next

## Examples

### Example 1: Market Decline Analysis

**User Query:** "Why did tech stocks drop significantly during November 1-8, 2025?"

**Detailed Workflow:**

1. **Identify:**
   - Parse query: movement=drop, sector=tech, date=Nov 1-8, 2025
   - Query is clear, proceed with search
   - Action: `web_search("tech stocks drop November 1-8 2025")`
   - Extract: Tech stock decline, Nov 1-8, 2025

2. **Quantify (Primary: Internet Search):**
   - **PRIMARY**: `web_search("tech stocks decline November 1-8 2025 percentage")`
   - **PRIMARY**: `web_search("Nasdaq S&P 500 November 7 2025 decline")`
   - **PRIMARY**: `web_search("Nvidia Tesla Microsoft stock price November 2025")`
   - From search results, extract: Nvidia -9%, Tesla -8.3%, Microsoft -3.9%
   - **SUPPLEMENTARY**: Use MCP tools to verify if search results conflict

3. **Search for Causes (Primary: Internet Search):**
   - **PRIMARY**: `web_search("tech stocks decline November 2025")`
   - **PRIMARY**: `web_search("Nvidia stock drop November 7 2025")`
   - **PRIMARY**: `web_search("government shutdown November 2025 market impact")`
   - **PRIMARY**: `web_search("October 2025 layoffs tech sector")`
   - **PRIMARY**: `web_search("AI valuation concerns November 2025")`
   - **PRIMARY**: `web_search("VIX volatility November 7 2025")`
   - Found causes: AI valuation concerns, government shutdown, layoffs, Fed policy

4. **Verify (Internet Search + MCP):**
   - Cross-check percentage changes from multiple search results
   - Verify government shutdown: `web_search("US government shutdown 38 days November 2025")`
   - Confirm layoff numbers: `web_search("153074 layoffs October 2025")`
   - Check VIX levels: `web_search("VIX 19.50 November 7 2025")`
   - Use MCP tools to verify specific stock prices if search results conflict

5. **Analyze Impact:**
   - Search: `web_search("sector rotation November 2025 defensive stocks")`
   - Search: `web_search("VIX spike November 7 2025 historical")`
   - Search: `web_search("valuation reassessment November 2025")`
   - Findings: Sector rotation to defensive stocks, volatility spike, valuation reassessment

6. **Educational Context:**
   - Explain why tech stocks are sensitive to rates
   - Explain valuation concerns
   - Compare to historical tech corrections
   - Discuss different investment perspectives

7. **Create Journal Entry:**
   - Ask: "Would you like me to create a journal entry for this analysis?"
   - If confirmed, create `2025-11-08-tech-market-decline.md`
   - Include all verified data, root causes, impact analysis, and learnings

### Example 2: Market Surge Analysis

**User Query:** "What caused the AI stock surge in late October 2025?"

**Detailed Workflow:**

1. **Identify:**
   - Parse query: movement=surge, sector=AI stocks, date=late October 2025
   - Query is clear, proceed with search
   - Action: `web_search("AI stock surge late October 2025")`
   - Extract: AI stock surge, late October 2025

2. **Quantify (Primary: Internet Search):**
   - **PRIMARY**: `web_search("AI stocks surge October 2025 percentage gains")`
   - **PRIMARY**: `web_search("Nvidia stock price October 2025 surge")`
   - **PRIMARY**: `web_search("AI stock volume October 2025")`
   - From search results, extract: Nvidia +15%, AI sector +12%
   - **SUPPLEMENTARY**: Use MCP tools to verify specific numbers if needed

3. **Search for Causes (Primary: Internet Search):**
   - **PRIMARY**: `web_search("AI stocks surge October 2025")`
   - **PRIMARY**: `web_search("Nvidia earnings October 2025")`
   - **PRIMARY**: `web_search("AI breakthrough October 2025")`
   - **PRIMARY**: `web_search("AI stock momentum October 2025")`
   - Found causes: Strong earnings, AI breakthrough announcement, momentum

4. **Verify (Internet Search):**
   - Verify earnings dates: `web_search("Nvidia earnings date October 2025")`
   - Check for major announcements: `web_search("AI announcement October 2025 market")`
   - Confirm percentage gains: `web_search("AI stock gains October 2025 percentage")`

5. **Analyze Impact:**
   - Search: `web_search("sector momentum October 2025 AI")`
   - Search: `web_search("valuation expansion October 2025 AI stocks")`
   - Search: `web_search("retail institutional participation October 2025 AI")`
   - Findings: Sector momentum, valuation expansion, retail participation

6. **Educational Context:**
   - Explain momentum investing
   - Discuss valuation vs growth
   - Explain FOMO (fear of missing out)
   - Discuss risks of momentum trades

7. **Create Journal Entry:**
   - Ask: "Would you like me to create a journal entry for this analysis?"
   - If confirmed, create `2025-10-20-ai-stock-surge.md`
   - Include all verified data, root causes, impact analysis, and learnings

### Example 3: Volatility Event Analysis

**User Query:** "Why did market volatility spike on November 7, 2025?"

**Detailed Workflow:**

1. **Identify:**
   - Parse query: movement=volatility spike, date=November 7, 2025
   - Query is clear, proceed with search
   - Action: `web_search("market volatility spike November 7 2025")`
   - Extract: VIX spike, November 7, 2025

2. **Quantify (Primary: Internet Search):**
   - **PRIMARY**: `web_search("VIX spike November 7 2025 level")`
   - **PRIMARY**: `web_search("market volatility November 7 2025 percentage")`
   - **PRIMARY**: `web_search("trading volume November 7 2025 market")`
   - From search results, extract: VIX rose to 19.50, up 8.3%
   - **SUPPLEMENTARY**: Use MCP tools to verify specific VIX levels if needed

3. **Search for Causes (Primary: Internet Search):**
   - **PRIMARY**: `web_search("VIX spike November 7 2025")`
   - **PRIMARY**: `web_search("market volatility November 7 2025 event")`
   - **PRIMARY**: `web_search("tech stock decline November 7 2025 market impact")`
   - **PRIMARY**: `web_search("fear gauge November 7 2025 market sentiment")`
   - Found causes: Tech stock decline, uncertainty, fear

4. **Verify (Internet Search):**
   - Verify VIX levels: `web_search("VIX 19.50 November 7 2025")`
   - Confirm event timing: `web_search("tech decline November 7 2025 timing")`
   - Check market movements: `web_search("stock market November 7 2025 decline surge")`

5. **Analyze Impact:**
   - Search: `web_search("options market activity November 7 2025")`
   - Search: `web_search("sector performance November 7 2025")`
   - Search: `web_search("investor behavior November 7 2025")`
   - Findings: Options market activity, sector performance, investor behavior

6. **Educational Context:**
   - Explain what VIX measures
   - Discuss volatility and risk
   - Explain options and hedging
   - Discuss market psychology

7. **Create Journal Entry:**
   - Ask: "Would you like me to create a journal entry for this analysis?"
   - If confirmed, create `2025-11-07-volatility-spike.md`
   - Include all verified data, root causes, impact analysis, and learnings

## Important Notes

**Always Remember:**
- ✅ This is educational analysis, not financial advice
- ✅ Verify all key facts with multiple sources
- ✅ Distinguish between facts and opinions
- ✅ Acknowledge uncertainty and limitations
- ✅ Provide multiple perspectives
- ✅ Explain concepts, don't just state facts

**Never:**
- ❌ Make investment recommendations
- ❌ Predict future market movements
- ❌ Present single-source information as fact
- ❌ Ignore contradictory evidence
- ❌ Use dogmatic language ("always", "never", "guaranteed")

**When Information is Limited:**
- Acknowledge data limitations
- Note when sources conflict
- Explain what we don't know
- Suggest what to monitor

## Error Handling

**If Data is Unavailable:**
- Acknowledge the limitation
- Use available data sources
- Note what information is missing

**If Movement is Unexplained:**
- Document what happened (quantify)
- List potential explanations
- Note that cause is unclear
- Suggest what to monitor
- Compare to similar unexplained movements

## Verification Checklist

Before presenting analysis, verify:
- [ ] All key numbers are accurate
- [ ] Percentage changes are calculated correctly
- [ ] Dates and timeframes are correct
- [ ] Root causes are verified by multiple sources
- [ ] Economic data is cross-checked
- [ ] Historical comparisons are accurate
- [ ] Educational explanations are clear
- [ ] Multiple perspectives are presented
- [ ] Limitations and uncertainties are acknowledged
- [ ] No investment advice is given

Before creating journal entry, verify:
- [ ] User has confirmed they want journal entry created
- [ ] Filename follows naming convention (YYYY-MM-DD-[event-description].md)
- [ ] All verified data is included
- [ ] Root causes are documented with evidence
- [ ] Educational context is provided
- [ ] Multiple perspectives are included
- [ ] Follow-up actions are listed
- [ ] File is saved to `.cursor/knowledge/journal/` directory

