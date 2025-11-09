# Phased Multi-Provider API Integration Plan

## Overview

Integrate three high-priority APIs (IEX Cloud, Financial Modeling Prep, FRED API) incrementally, with each phase being a complete, testable PR. Each phase will be verified and merged before moving to the next.

## Architecture Evolution

### Current Architecture
- Single primary provider (Alpha Vantage) with fallback (Yahoo Finance)
- Single rate limiter for Alpha Vantage
- Simple provider factory with primary/fallback pattern

### Final Architecture (After All Phases)
- Multi-provider system with intelligent routing
- Per-provider rate limiters
- Provider priority based on data type and availability
- Enhanced provider factory supporting multiple providers

---

## Phase 1: IEX Cloud Integration (PR #1)

**Goal:** Add IEX Cloud as an additional provider with better free tier limits

### Implementation Steps

**1.1 Create IEX Cloud Provider** (`mcp-market-data/src/providers/iex-cloud.ts`)
- Implement `IMarketDataProvider` interface
- Support: `getQuote()`, `getCompanyInfo()`, `getHistoricalData()`, `getNews()`
- API base: `https://cloud.iexapis.com/stable`
- Free tier: 50,000 messages/month
- Authentication: API key in query parameter (`token`)

**1.2 Add IEX Cloud Tests** (`mcp-market-data/src/providers/iex-cloud.test.ts`)
- Unit tests with mocked API responses
- Test all implemented methods
- Test error handling
- Test data transformation

**1.3 Update Configuration** (`mcp-market-data/src/config.ts`)
- Add `IEX_CLOUD_API_KEY` environment variable reading
- Add IEX Cloud rate limit config (50,000/month)
- Note: Rate limiter enhancement deferred to Phase 4

**1.4 Update Provider Factory** (`mcp-market-data/src/factories/provider.factory.ts`)
- Add IEX Cloud to provider creation
- Maintain backward compatibility (existing primary/fallback pattern)
- Add IEX Cloud as additional provider option
- Update `ProviderConfig` to include `iexCloud?: IMarketDataProvider`

**1.5 Update Market Data Service** (`mcp-market-data/src/services/market-data.service.ts`)
- Add IEX Cloud to provider chain
- Update `fetchWithCacheAndFallback` to try IEX Cloud before Alpha Vantage
- Provider priority: IEX Cloud → Alpha Vantage → Yahoo Finance
- Use existing rate limiter (will enhance in Phase 4)

**1.6 Update Environment Template** (`env.example`)
- Add `IEX_CLOUD_API_KEY` with documentation
- Include registration link and free tier info

**1.7 Update Documentation** (`README.md`, `mcp-market-data/README.md`)
- Document IEX Cloud provider
- Update setup instructions
- Document rate limits

**1.8 Update Index** (`mcp-market-data/src/index.ts`)
- Pass IEX Cloud API key to provider factory
- Initialize IEX Cloud provider if API key available

### Testing Requirements
- All existing tests must pass
- New IEX Cloud provider tests must pass
- Integration test: Verify IEX Cloud is used when available
- Verify fallback chain works correctly
- Test with and without IEX Cloud API key

### Success Criteria
- IEX Cloud provider implemented and tested
- Integrated into provider chain
- Backward compatible (works without IEX Cloud API key)
- All tests passing
- Documentation updated
- Ready for PR and merge

---

## Phase 2: Financial Modeling Prep Integration (PR #2)

**Goal:** Add Financial Modeling Prep for comprehensive financial statements

### Implementation Steps

**2.1 Add Financial Statement Types** (`mcp-market-data/src/types.ts`)
- `StatementType` enum: 'income', 'balance', 'cashflow'
- `IncomeStatement` interface
- `BalanceSheet` interface
- `CashFlowStatement` interface
- `FinancialStatement` union type

**2.2 Create Financial Modeling Prep Provider** (`mcp-market-data/src/providers/financial-modeling-prep.ts`)
- Implement `IMarketDataProvider` interface
- Support: `getCompanyInfo()`, `getFinancialStatements()`
- API base: `https://financialmodelingprep.com/api/v3`
- Free tier: 250 calls/day
- Authentication: API key in query parameter (`apikey`)

**2.3 Add Financial Statements Method to Interface** (`mcp-market-data/src/interfaces/market-data-provider.interface.ts`)
- Add optional `getFinancialStatements?(symbol: string, statementType: StatementType, period?: 'annual' | 'quarter'): Promise<FinancialStatement>`

**2.4 Add Financial Modeling Prep Tests** (`mcp-market-data/src/providers/financial-modeling-prep.test.ts`)
- Unit tests with mocked API responses
- Test financial statement parsing
- Test error handling

**2.5 Update Configuration** (`mcp-market-data/src/config.ts`)
- Add `FMP_API_KEY` environment variable reading
- Add Financial Modeling Prep rate limit config (250/day)
- Add cache TTL for financial statements

**2.6 Update Provider Factory** (`mcp-market-data/src/factories/provider.factory.ts`)
- Add Financial Modeling Prep to provider creation
- Add to `ProviderConfig` interface

**2.7 Update Market Data Service** (`mcp-market-data/src/services/market-data.service.ts`)
- Add `getFinancialStatements()` method
- Use Financial Modeling Prep as primary source
- Fallback to IEX Cloud if available, then error

**2.8 Add New MCP Tool** (`mcp-market-data/src/tools/tool-definitions.ts`)
- Add `get_financial_statements` tool definition
- Parameters: symbol, statementType, period (optional)

**2.9 Update Tool Handler** (`mcp-market-data/src/index.ts`)
- Add handler for `get_financial_statements` tool
- Route to market data service

**2.10 Update Environment Template** (`env.example`)
- Add `FMP_API_KEY` with documentation

**2.11 Update Documentation**
- Document Financial Modeling Prep provider
- Document new financial statements tool
- Add usage examples

### Testing Requirements
- All existing tests must pass
- New Financial Modeling Prep tests must pass
- Test financial statements retrieval
- Test fallback behavior
- Integration test for new tool

### Success Criteria
- Financial Modeling Prep provider implemented and tested
- Financial statements types added
- New MCP tool available and working
- All tests passing
- Documentation updated
- Ready for PR and merge

---

## Phase 3: FRED API Integration (PR #3)

**Goal:** Add FRED API for economic indicators and macro data

### Implementation Steps

**3.1 Add Economic Data Types** (`mcp-market-data/src/types.ts`)
- `EconomicIndicator` interface
- `EconomicDataPoint` interface
- Common indicator series IDs constants (GDP, CPI, UNRATE, etc.)

**3.2 Create FRED Provider** (`mcp-market-data/src/providers/fred.ts`)
- Implement `IMarketDataProvider` interface (minimal - FRED doesn't do stock data)
- Focus: `getEconomicIndicator()` method
- API base: `https://api.stlouisfed.org/fred`
- Free tier: Unlimited (rate-limited to 10 requests/second)
- Authentication: API key in query parameter (`api_key`)

**3.3 Add Economic Indicator Method to Interface** (`mcp-market-data/src/interfaces/market-data-provider.interface.ts`)
- Add optional `getEconomicIndicator?(seriesId: string, startDate?: string, endDate?: string): Promise<EconomicIndicator>`

**3.4 Add FRED Tests** (`mcp-market-data/src/providers/fred.test.ts`)
- Unit tests with mocked API responses
- Test economic data parsing
- Test date range handling

**3.5 Update Configuration** (`mcp-market-data/src/config.ts`)
- Add `FRED_API_KEY` environment variable reading
- Add FRED rate limit config (10/second)
- Add cache TTL for economic data

**3.6 Update Provider Factory** (`mcp-market-data/src/factories/provider.factory.ts`)
- Add FRED to provider creation
- Add to `ProviderConfig` interface

**3.7 Update Market Data Service** (`mcp-market-data/src/services/market-data.service.ts`)
- Add `getEconomicIndicator()` method
- Use FRED as primary source
- Handle rate limiting (10/second)

**3.8 Add New MCP Tool** (`mcp-market-data/src/tools/tool-definitions.ts`)
- Add `get_economic_indicator` tool definition
- Parameters: seriesId, startDate (optional), endDate (optional)
- Include common series IDs in description

**3.9 Update Tool Handler** (`mcp-market-data/src/index.ts`)
- Add handler for `get_economic_indicator` tool
- Route to market data service

**3.10 Update Environment Template** (`env.example`)
- Add `FRED_API_KEY` with documentation

**3.11 Update Documentation**
- Document FRED provider
- Document new economic indicator tool
- List common economic indicators
- Add usage examples

### Testing Requirements
- All existing tests must pass
- New FRED tests must pass
- Test economic indicator retrieval
- Test rate limiting (10/second)
- Integration test for new tool

### Success Criteria
- FRED provider implemented and tested
- Economic data types added
- New MCP tool available and working
- All tests passing
- Documentation updated
- Ready for PR and merge

---

## Phase 4: Rate Limiting & Provider Enhancements (PR #4)

**Goal:** Enhance rate limiting system to support per-provider limits and improve provider selection

### Implementation Steps

**4.1 Enhance Rate Limiter** (`mcp-market-data/src/rate-limiter.ts`)
- Support different limit types: per-minute, per-day, per-month
- Create `RateLimiterConfig` interface
- Support multiple rate limiters per provider
- Track usage per provider separately

**4.2 Create Rate Limiter Factory** (`mcp-market-data/src/rate-limiter.ts`)
- Factory function to create rate limiters with different configs
- Per-provider rate limiter instances

**4.3 Update Rate Limiter Configuration** (`mcp-market-data/src/config.ts`)
- Define rate limit configs for each provider:
  - IEX Cloud: 50,000/month
  - Financial Modeling Prep: 250/day
  - FRED: 10/second
  - Alpha Vantage: 25/day, 5/minute

**4.4 Update Provider Factory** (`mcp-market-data/src/factories/provider.factory.ts`)
- Create rate limiters for each provider
- Pass rate limiters to providers or service

**4.5 Update Market Data Service** (`mcp-market-data/src/services/market-data.service.ts`)
- Use per-provider rate limiters
- Track rate limit status per provider
- Improve provider selection based on rate limit availability
- Better error messages with rate limit info

**4.6 Add Provider Selection Logic**
- Smart provider selection based on:
  - Data type needed
  - Rate limit availability
  - Provider capabilities
- Log provider selection for debugging

**4.7 Update Tests**
- Test per-provider rate limiting
- Test provider selection logic
- Test rate limit tracking

**4.8 Update Documentation**
- Document rate limiting per provider
- Document provider selection logic
- Add troubleshooting guide

### Testing Requirements
- All existing tests must pass
- New rate limiting tests must pass
- Test provider selection logic
- Test rate limit tracking
- Integration tests for all scenarios

### Success Criteria
- Per-provider rate limiting implemented
- Provider selection logic working correctly
- All tests passing
- Documentation updated
- Ready for PR and merge

---

## General Considerations (All Phases)

- **Backward Compatibility**: Each phase must maintain backward compatibility
- **Testing**: All tests must pass before moving to next phase
- **Documentation**: Update docs in each phase
- **Error Handling**: Graceful fallback through provider chain
- **Caching**: Use appropriate cache TTLs for different data types
- **Cost Management**: Prefer free tiers, cache aggressively
- **Code Quality**: Follow SOLID principles, maintain existing patterns

## Success Criteria (Overall)

- All three providers integrated and functional
- Smart provider selection working correctly
- Per-provider rate limiting implemented
- New tools (financial statements, economic data) available
- Backward compatibility maintained
- All tests passing
- Documentation complete
- Each phase independently testable and mergeable

