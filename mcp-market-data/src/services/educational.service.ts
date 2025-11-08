
import { Cache } from '../cache.js';
import { config } from '../config.js';
import {
    findSectorFromSymbol,
    formatMetricExplanation,
    getMetricExplanation,
    getPeersBySector,
    listAvailableMetrics,
    listAvailableSectors
} from '../educational.js';
import { IMarketDataProvider } from '../interfaces/market-data-provider.interface.js';
import { CompanyInfo } from '../types.js';

export interface ExplainFundamentalResult {
    explanation: string;
    contextData?: string;
}

export interface ComparePeersResult {
    comparison: string;
}

export class EducationalService {
  constructor(
    private cache: Cache,
    private fallbackProvider: IMarketDataProvider,
    private readonly providers: IMarketDataProvider[],
  ) {}

  /**
   * Get explanation for a financial metric
   */
  public async explainFundamental(metric: string, symbol?: string): Promise<ExplainFundamentalResult> {
    const explanation = getMetricExplanation(metric);

    if (!explanation) {
      const availableMetrics = listAvailableMetrics();
      throw new Error(
        `Metric "${metric}" not found.\n\nAvailable metrics:\n${availableMetrics.map((m) => `- ${m}`).join('\n')}\n\nUse any of these metric names (case-insensitive, underscores/spaces/hyphens are flexible).`
      );
    }

    const formattedExplanation = formatMetricExplanation(explanation, symbol);

    // If symbol is provided, try to fetch actual data for context
    let contextData: string | undefined;
    if (symbol) {
      try {
        const upperSymbol = symbol.toUpperCase();
        const cached = this.cache.get<CompanyInfo>(`company:${upperSymbol}`);
        if (cached) {
          contextData = `\n\n---\n## Current ${upperSymbol} Data Context\n\`\`\`json\n${JSON.stringify(cached, null, 2)}\n\`\`\`\n\nUse this data to practice interpreting the metric!`;
        }
      } catch (error) {
        // Silently fail if we can't get context data
      }
    }

    return {
      explanation: formattedExplanation,
      contextData,
    };
  }

  /**
   * Compare a stock against sector peers
   */
  public async comparePeers(symbol: string, sector?: string, metrics?: string[]): Promise<ComparePeersResult> {
    const upperSymbol = symbol.toUpperCase();

    // Determine sector
    let targetSector = sector;
    if (!targetSector) {
      const detectedSector = findSectorFromSymbol(upperSymbol);
      if (!detectedSector) {
        const availableSectors = listAvailableSectors();
        throw new Error(
          `Could not auto-detect sector for ${upperSymbol}. Please specify a sector:\n\n${availableSectors.map((s) => `- ${s}`).join('\n')}`
        );
      }
      targetSector = detectedSector;
    }

    // Get peer symbols
    const peers = getPeersBySector(targetSector);
    if (!peers || peers.length === 0) {
      throw new Error(`No peer data available for sector: ${targetSector}`);
    }

    // Fetch data for target company and peers (limit to 5 peers)
    const symbolsToCompare = [upperSymbol, ...peers.filter((p) => p !== upperSymbol).slice(0, 5)];

    let comparisonText = `# Peer Comparison: ${upperSymbol}\n\n`;
    comparisonText += `**Sector:** ${targetSector}\n`;
    comparisonText += `**Comparing against:** ${symbolsToCompare.slice(1).join(', ')}\n\n`;
    comparisonText += `---\n\n`;

    // Fetch company info for each symbol
    const companyDataPromises = symbolsToCompare.map(async (sym) => {
      try {
        // Check cache first
        const cached = this.cache.get<CompanyInfo>(`company:${sym}`);
        if (cached) {
          return { symbol: sym, data: cached, source: 'cache' };
        }

        // Use fallback provider for quick comparison
        const info = await this.fallbackProvider.getCompanyInfo(sym);
        this.cache.set(`company:${sym}`, info, config.CACHE_TTL.COMPANY_INFO);
        return { symbol: sym, data: info, source: this.fallbackProvider.name };
      } catch (error) {
        return { symbol: sym, data: null, error: String(error) };
      }
    });

    const results = await Promise.all(companyDataPromises);

    // Build comparison table
    comparisonText += `## Key Metrics Comparison\n\n`;
    comparisonText += `| Company | Market Cap | P/E Ratio | Revenue Growth | Profit Margin |\n`;
    comparisonText += `|---------|------------|-----------|----------------|---------------|\n`;

    for (const result of results) {
      if (result.data) {
        const d: any = result.data;
        const marketCap = d.marketCap ? `$${(d.marketCap / 1e9).toFixed(1)}B` : 'N/A';
        const pe = d.trailingPE ? d.trailingPE.toFixed(1) : 'N/A';
        const revenue = d.revenueGrowth ? `${(d.revenueGrowth * 100).toFixed(1)}%` : 'N/A';
        const margin = d.profitMargin ? `${(d.profitMargin * 100).toFixed(1)}%` : 'N/A';

        const highlight = result.symbol === upperSymbol ? '**' : '';
        comparisonText += `| ${highlight}${result.symbol}${highlight} | ${marketCap} | ${pe} | ${revenue} | ${margin} |\n`;
      } else {
        comparisonText += `| ${result.symbol} | Error | Error | Error | Error |\n`;
      }
    }

    comparisonText += `\n*Target company (${upperSymbol}) shown in bold*\n\n`;

    // Add learning insights
    comparisonText += `---\n\n## 💡 Learning Points\n\n`;
    comparisonText += `1. **Compare Valuations**: How does ${upperSymbol}'s P/E compare to peers? Higher P/E suggests market expects stronger growth.\n\n`;
    comparisonText += `2. **Profitability**: Which companies have the best profit margins? This often indicates competitive advantages.\n\n`;
    comparisonText += `3. **Growth Rates**: Compare revenue growth - who's growing fastest? Is it sustainable?\n\n`;
    comparisonText += `4. **Size Matters**: Market cap tells you company size. Larger doesn't mean better - consider growth potential vs stability.\n\n`;
    comparisonText += `5. **Deep Dive**: Use \`get_company_info\` on any peer to learn more. Use \`explain_fundamental\` to understand specific metrics.\n\n`;
    comparisonText += `---\n\n`;
    comparisonText += `*Remember: Peer comparison is just one tool. Consider qualitative factors: management, competitive moats, industry trends, and your investment goals.*`;

    return {
      comparison: comparisonText,
    };
  }
}
