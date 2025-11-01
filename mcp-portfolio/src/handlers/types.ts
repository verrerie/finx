import type { PortfolioService } from '../services/portfolio.service.js';
import type { LearningService } from '../services/learning.service.js';
import type { AssetService } from '../services/asset.service.js';

export type HandlerContext = {
  portfolioService: PortfolioService;
  learningService: LearningService;
  assetService: AssetService;
};

export type ToolArguments = Record<string, unknown> | undefined | null;

export type ToolResponse = {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
};

export type ToolHandler = (args: ToolArguments, ctx: HandlerContext) => Promise<ToolResponse>;


