/**
 * Educational Content for Financial Metrics
 * 
 * Provides detailed explanations of financial metrics and concepts
 * to help users learn while analyzing stocks.
 */

export interface MetricExplanation {
    name: string;
    definition: string;
    whatItMeans: string;
    howToInterpret: string;
    goodVsBad: string;
    example: string;
    relatedMetrics: string[];
    furtherReading: string;
}

/**
 * Comprehensive explanations of financial metrics
 */
export const METRIC_EXPLANATIONS: Record<string, MetricExplanation> = {
    pe_ratio: {
        name: 'P/E Ratio (Price-to-Earnings)',
        definition: 'The Price-to-Earnings ratio is calculated by dividing the stock price by earnings per share (EPS). Formula: P/E = Stock Price / EPS',
        whatItMeans: 'The P/E ratio tells you how much investors are willing to pay for each dollar of a company\'s earnings. A P/E of 25 means you\'re paying $25 for every $1 of annual earnings.',
        howToInterpret: 'Compare the P/E to: (1) The company\'s historical P/E, (2) Industry peers, (3) The broader market (S&P 500 avg ~15-20). Higher P/E suggests growth expectations or potential overvaluation; lower P/E may indicate value or concerns about future growth.',
        goodVsBad: 'There\'s no universal "good" or "bad" P/E. High-growth tech companies often have P/E ratios of 30-50+, while mature industries like utilities might have P/E ratios of 10-15. Context is everything!',
        example: 'If Apple trades at $150 with EPS of $6, its P/E is 25 ($150 ÷ $6). If the tech sector average is 28, Apple might be reasonably valued or slightly undervalued relative to peers.',
        relatedMetrics: ['PEG Ratio', 'Forward P/E', 'EPS', 'Earnings Yield'],
        furtherReading: 'Consider documenting this in knowledge/concepts/pe-ratio.md with examples from your research.'
    },
    peg_ratio: {
        name: 'PEG Ratio (Price/Earnings-to-Growth)',
        definition: 'The PEG ratio adjusts the P/E ratio for expected earnings growth. Formula: PEG = (P/E Ratio) / (Annual EPS Growth Rate %)',
        whatItMeans: 'PEG ratio helps you determine if a high P/E ratio is justified by growth. A PEG of 1.0 suggests the P/E ratio equals the growth rate, which many consider "fairly valued."',
        howToInterpret: 'PEG < 1.0 may indicate undervaluation (growth potential not fully priced in), PEG > 2.0 may suggest overvaluation (high P/E not justified by growth). PEG between 1-2 is often considered reasonable.',
        goodVsBad: 'Lower is generally better, but beware: PEG relies on future growth estimates, which can be wrong. It works best for comparing companies in the same industry with similar growth profiles.',
        example: 'A company with P/E of 30 and 30% expected earnings growth has a PEG of 1.0 (30/30), suggesting fair value despite the high P/E. Another company with P/E of 15 but only 5% growth has a PEG of 3.0, potentially overvalued.',
        relatedMetrics: ['P/E Ratio', 'EPS Growth Rate', 'Forward P/E'],
        furtherReading: 'Track PEG ratios in your stock research journal to see which thresholds work for your strategy.'
    },
    market_cap: {
        name: 'Market Capitalization',
        definition: 'Market cap is the total value of all a company\'s outstanding shares. Formula: Market Cap = Share Price × Total Shares Outstanding',
        whatItMeans: 'Market cap represents what the entire company is worth according to the stock market. It\'s how much you\'d theoretically need to buy every share of the company.',
        howToInterpret: 'Large-cap (>$10B): Established companies, lower risk, slower growth. Mid-cap ($2B-$10B): Growth potential with moderate risk. Small-cap (<$2B): Higher growth potential but more volatile and risky.',
        goodVsBad: 'Bigger isn\'t "better" - it depends on your strategy. Large-caps offer stability, small-caps offer growth potential. Diversifying across market caps is a common strategy.',
        example: 'Apple with ~16 billion shares at $150/share has a market cap of ~$2.4 trillion, making it a mega-cap stock. A startup with 10 million shares at $20/share has a $200 million market cap (small-cap).',
        relatedMetrics: ['Enterprise Value', 'Float', 'Shares Outstanding'],
        furtherReading: 'Document your market cap preferences and risk tolerance in knowledge/frameworks/investment-strategy.md'
    },
    eps: {
        name: 'EPS (Earnings Per Share)',
        definition: 'Earnings Per Share represents the company\'s profit divided by the number of outstanding shares. Formula: EPS = (Net Income - Preferred Dividends) / Weighted Average Shares Outstanding',
        whatItMeans: 'EPS tells you how much profit the company makes for each share of stock. It\'s a key metric for profitability and is used to calculate P/E ratio.',
        howToInterpret: 'Look at EPS growth over time - consistent growth is positive. Compare to analyst estimates (earnings "beats" or "misses"). Higher EPS is generally better, but context matters (is it sustainable? One-time gains?).',
        goodVsBad: 'Positive and growing EPS is good. Negative EPS means losses. Watch for: (1) Diluted vs Basic EPS, (2) One-time items that inflate EPS, (3) EPS growth rate vs peers.',
        example: 'If a company earns $1 billion with 100 million shares, EPS is $10. If EPS grows from $8 to $10 to $12 over three years, that\'s healthy 25% YoY growth.',
        relatedMetrics: ['P/E Ratio', 'EPS Growth Rate', 'Diluted EPS', 'Net Income'],
        furtherReading: 'Track EPS trends in knowledge/journal/[company]-analysis.md to understand earnings quality.'
    },
    dividend_yield: {
        name: 'Dividend Yield',
        definition: 'Dividend yield shows the annual dividend payment as a percentage of the stock price. Formula: Dividend Yield = (Annual Dividends Per Share / Stock Price) × 100',
        whatItMeans: 'Dividend yield tells you how much cash return you get annually just from dividends, expressed as a percentage. It\'s like the "interest rate" you earn on your stock investment.',
        howToInterpret: 'Compare to: (1) Risk-free rate (10-year Treasury yield), (2) S&P 500 average (~1.5-2%), (3) Sector averages. High yield (>4%) can signal value or distress; low/zero yield is common in growth stocks.',
        goodVsBad: 'Higher isn\'t always better! Very high yields (>6-7%) might indicate: (1) Dividend at risk of being cut, (2) Stock price crashed, (3) Mature/slow-growth company. Balance yield with dividend safety and growth.',
        example: 'A stock at $100/share paying $4/year in dividends has a 4% yield. If the price drops to $80 (but dividend stays at $4), yield rises to 5% - higher yield but due to price decline, not necessarily good!',
        relatedMetrics: ['Dividend Payout Ratio', 'Dividend Growth Rate', 'Total Return'],
        furtherReading: 'For dividend investing, track payout ratios and dividend history in your knowledge base.'
    },
    roe: {
        name: 'ROE (Return on Equity)',
        definition: 'Return on Equity measures how efficiently a company generates profit from shareholders\' equity. Formula: ROE = (Net Income / Shareholders\' Equity) × 100',
        whatItMeans: 'ROE shows how much profit a company generates for every dollar of equity (the owners\' stake). A ROE of 15% means the company generates $0.15 in profit for each $1 of equity.',
        howToInterpret: 'Generally, ROE > 15% is considered good, > 20% is excellent. Compare to: (1) Company\'s historical ROE, (2) Industry peers, (3) Cost of equity. Consistent ROE over time suggests sustainable competitive advantage.',
        goodVsBad: 'Higher is better, but beware: High leverage (debt) can artificially inflate ROE. Look at the DuPont analysis to understand if high ROE comes from profitability, asset efficiency, or just leverage.',
        example: 'Company A: $500M net income, $2.5B equity → 20% ROE (strong). Company B: $500M income, $10B equity → 5% ROE (weak capital efficiency). Warren Buffett targets companies with consistently high ROE.',
        relatedMetrics: ['ROA (Return on Assets)', 'ROIC (Return on Invested Capital)', 'Profit Margin', 'Asset Turnover'],
        furtherReading: 'Study the DuPont analysis to decompose ROE into its components: Profit Margin × Asset Turnover × Equity Multiplier.'
    },
    debt_to_equity: {
        name: 'Debt-to-Equity Ratio',
        definition: 'This ratio compares total debt to shareholders\' equity, measuring financial leverage. Formula: D/E = Total Debt / Shareholders\' Equity',
        whatItMeans: 'D/E shows how much debt a company uses to finance operations relative to equity. A D/E of 1.0 means equal debt and equity; 2.0 means twice as much debt as equity.',
        howToInterpret: 'What\'s "good" varies by industry. Capital-intensive industries (utilities, telecom) often have D/E > 1.0. Tech companies often have D/E < 0.5. Compare to sector averages and historical trends.',
        goodVsBad: 'Lower is generally safer (less bankruptcy risk), but some debt is good (leverage can boost returns). Too high (>2.0 for most industries) increases financial risk, especially in downturns. Zero debt means no leverage benefits.',
        example: 'Company with $2B debt and $5B equity has D/E of 0.4 (conservative). Company with $10B debt and $3B equity has D/E of 3.3 (highly leveraged, risky in recession).',
        relatedMetrics: ['Interest Coverage Ratio', 'Debt-to-Assets', 'Current Ratio', 'Free Cash Flow'],
        furtherReading: 'Learn about optimal capital structure and how leverage amplifies both gains and losses.'
    },
    revenue: {
        name: 'Revenue (Sales)',
        definition: 'Revenue is the total income from business activities before any expenses are deducted. Also called "top line" or "sales."',
        whatItMeans: 'Revenue shows how much money flows into the company from selling products/services. It\'s the starting point of the income statement, before subtracting costs to get profit.',
        howToInterpret: 'Look for: (1) Consistent revenue growth (5-15%+ annually is healthy), (2) Accelerating vs decelerating growth, (3) Revenue quality (recurring vs one-time?), (4) Revenue per employee (efficiency).',
        goodVsBad: 'Growing revenue is essential, but not sufficient - must also be profitable (or have a path to profitability). Declining revenue is a red flag. Compare growth rate to industry and GDP growth.',
        example: 'A SaaS company growing revenue 40% annually (high growth) vs a utility growing 2% annually (mature). Amazon prioritized revenue growth over profits for years during expansion phase.',
        relatedMetrics: ['Revenue Growth Rate', 'Gross Margin', 'Operating Margin', 'Profit Margin'],
        furtherReading: 'Study different business models: recurring revenue (SaaS) vs transactional vs licensing to understand revenue quality.'
    },
    profit_margin: {
        name: 'Net Profit Margin',
        definition: 'Net profit margin shows what percentage of revenue becomes profit after all expenses. Formula: Profit Margin = (Net Income / Revenue) × 100',
        whatItMeans: 'This tells you how much profit a company keeps from each dollar of sales. A 15% margin means the company keeps $0.15 in profit for every $1 of revenue.',
        howToInterpret: 'Compare to: (1) Historical margins (improving or declining?), (2) Industry averages (software ~20-30%, retail ~2-5%, banking ~15-25%). Expanding margins suggest improving efficiency or pricing power.',
        goodVsBad: 'Higher is generally better, but varies by industry. Low margins (<5%) require high volume and tight cost control. High margins (>20%) suggest strong competitive advantage or pricing power. Watch for margin compression (shrinking margins).',
        example: 'Apple with 25% margins (premium pricing, strong brand) vs Walmart with 2.5% margins (low prices, high volume). Both are successful but different strategies.',
        relatedMetrics: ['Gross Margin', 'Operating Margin', 'EBITDA Margin', 'Return on Sales'],
        furtherReading: 'Study the income statement progression: Gross Margin → Operating Margin → Net Margin to understand where costs impact profitability.'
    },
    book_value: {
        name: 'Book Value (Per Share)',
        definition: 'Book value is the net asset value of a company from the balance sheet. Formula: Book Value Per Share = (Total Assets - Total Liabilities - Preferred Stock) / Shares Outstanding',
        whatItMeans: 'Book value represents what shareholders would theoretically receive if the company was liquidated today and all assets sold at balance sheet values. It\'s the "accounting value" of equity per share.',
        howToInterpret: 'Compare stock price to book value using P/B ratio. P/B < 1.0 means trading below book value (potential value or distressed company). P/B > 3.0 means market values the business well above assets (growth expectations or strong intangibles).',
        goodVsBad: 'Book value is most relevant for asset-heavy businesses (banks, real estate). Less useful for asset-light businesses (software, services) where value comes from intangibles not on balance sheet (brand, IP, talent).',
        example: 'Bank with $100B assets, $95B liabilities → $5B book value. If 1B shares outstanding, book value per share is $5. If stock trades at $7, P/B = 1.4 (reasonable for banks).',
        relatedMetrics: ['P/B Ratio (Price-to-Book)', 'Tangible Book Value', 'ROE', 'Assets'],
        furtherReading: 'Study Benjamin Graham\'s value investing approach which emphasized buying stocks below book value for a "margin of safety."'
    }
};

/**
 * Get explanation for a specific metric
 */
export function getMetricExplanation(metric: string): MetricExplanation | null {
    const normalizedMetric = metric.toLowerCase().replace(/[_\s-]/g, '_');
    return METRIC_EXPLANATIONS[normalizedMetric] || null;
}

/**
 * Get list of all available metric explanations
 */
export function listAvailableMetrics(): string[] {
    return Object.keys(METRIC_EXPLANATIONS).map(key => 
        METRIC_EXPLANATIONS[key].name
    );
}

/**
 * Format metric explanation for user display
 */
export function formatMetricExplanation(explanation: MetricExplanation, symbol?: string): string {
    const symbolContext = symbol ? ` for ${symbol}` : '';
    
    return `
# ${explanation.name}${symbolContext}

## Definition
${explanation.definition}

## What It Means
${explanation.whatItMeans}

## How to Interpret
${explanation.howToInterpret}

## Good vs Bad
${explanation.goodVsBad}

## Example
${explanation.example}

## Related Metrics to Explore
${explanation.relatedMetrics.map(m => `- ${m}`).join('\n')}

## Next Steps
${explanation.furtherReading}

---
*Remember: This is educational information, not financial advice. Always consider multiple factors and your personal situation when making investment decisions.*
`.trim();
}

/**
 * Sector/Industry peer groups for comparison
 */
export const SECTOR_PEER_GROUPS: Record<string, string[]> = {
    'Technology': ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA', 'ORCL', 'CSCO', 'INTC', 'AMD', 'CRM'],
    'Financial Services': ['JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'BLK', 'SCHW', 'AXP', 'USB'],
    'Healthcare': ['JNJ', 'UNH', 'PFE', 'ABT', 'TMO', 'MRK', 'DHR', 'ABBV', 'LLY', 'BMY'],
    'Consumer Cyclical': ['AMZN', 'TSLA', 'HD', 'NKE', 'MCD', 'SBUX', 'TGT', 'LOW', 'TJX', 'BKNG'],
    'Consumer Defensive': ['WMT', 'PG', 'KO', 'PEP', 'COST', 'PM', 'MDLZ', 'CL', 'KHC', 'GIS'],
    'Industrials': ['BA', 'HON', 'UNP', 'UPS', 'RTX', 'CAT', 'LMT', 'GE', 'MMM', 'DE'],
    'Energy': ['XOM', 'CVX', 'COP', 'SLB', 'EOG', 'MPC', 'PSX', 'VLO', 'OXY', 'HAL'],
    'Utilities': ['NEE', 'DUK', 'SO', 'D', 'AEP', 'EXC', 'SRE', 'PEG', 'XEL', 'ED'],
    'Real Estate': ['PLD', 'AMT', 'CCI', 'EQIX', 'PSA', 'SPG', 'WELL', 'AVB', 'EQR', 'DLR'],
    'Communication Services': ['GOOGL', 'META', 'DIS', 'CMCSA', 'VZ', 'T', 'NFLX', 'TMUS', 'CHTR', 'EA'],
    'Basic Materials': ['LIN', 'APD', 'SHW', 'ECL', 'NEM', 'FCX', 'DOW', 'DD', 'NUE', 'VMC']
};

/**
 * Get peer companies for a given sector
 */
export function getPeersBySector(sector: string): string[] {
    return SECTOR_PEER_GROUPS[sector] || [];
}

/**
 * Find sector from company symbol (basic mapping - in reality would need API lookup)
 */
export function findSectorFromSymbol(symbol: string): string | null {
    const upperSymbol = symbol.toUpperCase();
    for (const [sector, symbols] of Object.entries(SECTOR_PEER_GROUPS)) {
        if (symbols.includes(upperSymbol)) {
            return sector;
        }
    }
    return null;
}

/**
 * Get available sectors
 */
export function listAvailableSectors(): string[] {
    return Object.keys(SECTOR_PEER_GROUPS);
}

