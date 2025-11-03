# Portfolio Management Prompt

## Purpose
This prompt guides you through the process of creating, managing, and analyzing your investment portfolios. It helps you track your investments systematically and make informed decisions.

## How to Use
1.  Follow the workflows below for common portfolio management tasks.
2.  Use the checklists to ensure you're not skipping important steps.
3.  The AI will use the portfolio management tools to execute your requests.
4.  Document your portfolio structure and decisions in `.cursor/knowledge/journal/`.

---

## Workflow 1: Creating Your First Portfolio

This workflow helps you set up a new portfolio to start tracking your investments.

### 📋 Creation Checklist
- [ ] **Define a Name and Strategy**: Give your portfolio a meaningful name and a brief description of its investment strategy.
- [ ] **Choose a Currency**: Select the base currency for your portfolio.
- [ ] **Create the Portfolio**: Use the `create_portfolio` tool.

### 💡 Example Prompt
"I want to create a new portfolio for my long-term growth stocks. The currency should be USD. Please name it 'Growth Stocks' and add a description: 'A collection of high-growth technology and healthcare stocks for long-term capital appreciation.'"

---

## Workflow 2: Adding Assets and Transactions

Once your portfolio is created, you need to add your assets (stocks, etc.) and log transactions (buys, sells).

### 📋 Transaction Checklist
- [ ] **Create the Asset**: If the asset doesn't exist yet, create it using `create_asset`.
- [ ] **Get Portfolio and Asset IDs**: You'll need these to add a transaction.
- [ ] **Record the Transaction**: Use the `add_transaction` tool with all the details (type, quantity, price, date).

### 💡 Example Prompt
"I bought 10 shares of Apple (AAPL) on 2025-10-26 at $150.25 per share for my 'Growth Stocks' portfolio. Please add this transaction."

**(The AI will first need to create an asset for AAPL if it doesn't exist, then add the transaction to your portfolio.)**

---

## Workflow 3: Reviewing Your Portfolio

Regularly review your portfolio to understand its performance and composition.

### 📋 Review Checklist
- [ ] **List Portfolios**: See all your portfolios with `list_portfolios`.
- [ ] **Get Portfolio Details**: Select a portfolio and get its details with `get_portfolio`.
- [ ] **View Holdings**: See all positions in the portfolio with `get_holdings`.
- [ ] **Analyze Performance**: Use `calculate_performance` with current market prices to see your returns.

### 💡 Example Prompt
"Show me the current holdings and performance of my 'Growth Stocks' portfolio. I'll provide the current prices for the assets."

---

## Documentation Template

Document your portfolio's strategy and major changes in `.cursor/knowledge/journal/YYYY-MM-DD-portfolio-update.md`:

```markdown
# Portfolio Update - [Date]

## Portfolio: [Portfolio Name]
**ID**: [Portfolio ID]

## Strategic Goal
[Briefly describe the investment strategy for this portfolio, e.g., "Long-term growth", "Dividend income", "Speculative bets".]

## Recent Transactions
| Date       | Ticker | Type | Quantity | Price  | Notes                               |
|------------|--------|------|----------|--------|-------------------------------------|
| YYYY-MM-DD | AAPL   | BUY  | 10       | 150.25 | Initial position in Apple.          |
| YYYY-MM-DD | MSFT   | SELL | 5        | 400.00 | Taking some profits.                |

## Performance Summary
- **Total Value**: [Value]
- **Overall Return**: [Return % and $]
- **Key Observations**: [e.g., "Tech sector is performing well", "Over-concentrated in AAPL"]

## Action Items
- [ ] Research diversifying into the healthcare sector.
- [ ] Review the investment thesis for [Underperforming Stock].
```

## Educational Focus

Using these workflows helps you learn:
-   **Systematic Tracking**: The importance of keeping accurate records of your investments.
-   **Position Sizing**: How individual positions affect your overall portfolio.
-   **Performance Analysis**: How to measure and understand your investment returns.
-   **Disciplined Investing**: Following a process for buying, selling, and reviewing.

## Remember

**This is not financial advice.** This is a learning tool to help you:
-   Organize and track your investments.
-   Develop a systematic approach to portfolio management.
-   Learn from your investment decisions.

For significant financial decisions, always consider consulting with a qualified financial advisor.