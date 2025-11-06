import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

let mockServer: Server;
let mockTransport: StdioServerTransport;
let mockMarketDataService: any;
let mockEducationalService: any;

describe('Market Data MCP Server', () => {

    beforeEach(async () => {
        vi.clearAllMocks();

        // Import SDK modules dynamically within beforeEach
        const { Server, StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/index.js');
        const { CallToolRequestSchema, ListToolsRequestSchema } = await import('@modelcontextprotocol/sdk/types.js');

        // Mock Server and StdioServerTransport
        mockServer = new Server({ name: 'test', version: '1.0.0' }, {});
        mockServer.connect = vi.fn().mockResolvedValue(undefined);
        mockServer.setRequestHandler = vi.fn();

        mockTransport = new StdioServerTransport();

        // Mock services
        mockMarketDataService = {
            getQuote: vi.fn().mockResolvedValue({ data: { price: 100 }, cached: false, source: 'mock', rateLimitInfo: 'none' }),
            getHistoricalData: vi.fn().mockResolvedValue({ data: [], metadata: 'mock' }),
            searchSymbol: vi.fn().mockResolvedValue({ data: [], metadata: 'mock', rateLimitInfo: 'none' }),
            getCompanyInfo: vi.fn().mockResolvedValue({ data: {}, cached: false, source: 'mock', rateLimitInfo: 'none' }),
        };
        mockEducationalService = {
            explainFundamental: vi.fn().mockResolvedValue({ explanation: 'mock explanation', contextData: '' }),
            comparePeers: vi.fn().mockResolvedValue({ comparison: 'mock comparison' }),
        };

        // Import the module under test *after* all mocks are set up
        const { startMarketDataServer } = await import('./index.js');
        await startMarketDataServer(mockServer, mockTransport);
    });


// Mock external dependencies
vi.mock('./cache.js');
vi.mock('./rate-limiter.js');
vi.mock('./factories/provider.factory.js', () => ({
    createProviders: vi.fn(() => ({
        primary: { getQuote: vi.fn(), getHistoricalData: vi.fn(), searchSymbol: vi.fn(), getCompanyInfo: vi.fn(), getSupportedMetrics: vi.fn(), getCompanyPeers: vi.fn() },
        fallback: { getQuote: vi.fn(), getHistoricalData: vi.fn(), searchSymbol: vi.fn(), getCompanyInfo: vi.fn(), getSupportedMetrics: vi.fn(), getCompanyPeers: vi.fn() },
    })),
}));
vi.mock('@modelcontextprotocol/sdk/server/index.js', () => ({
    Server: vi.fn(() => mockServer),
    StdioServerTransport: vi.fn(() => mockTransport),
}));

vi.mock('./services/market-data.service.js', () => ({
    MarketDataService: vi.fn(() => mockMarketDataService),
}));
vi.mock('./services/educational.service.js', () => ({
    EducationalService: vi.fn(() => mockEducationalService),
}));

vi.mock('./tools/tool-definitions.js', () => ({
    TOOL_DEFINITIONS: [
        {
            name: 'get_quote',
            description: 'Get current stock quote',
            inputSchema: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] },
        },
        {
            name: 'explain_fundamental',
            description: 'Explain a financial metric',
            inputSchema: { type: 'object', properties: { metric: { type: 'string' } }, required: ['metric'] },
        },
        {
            name: 'get_historical_data',
            description: 'Get historical data',
            inputSchema: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] },
        },
        {
            name: 'search_symbol',
            description: 'Search symbol',
            inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
        },
        {
            name: 'get_company_info',
            description: 'Get company info',
            inputSchema: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] },
        },
        {
            name: 'compare_peers',
            description: 'Compare peers',
            inputSchema: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] },
        },
    ],
}));



// Mock dotenv config to prevent actual file loading
vi.mock('dotenv', () => ({
    default: {
        config: vi.fn(),
    },
}));

    it('should set up ListToolsRequestSchema handler', async () => {
        expect(mockServer.setRequestHandler).toHaveBeenCalledWith(
            ListToolsRequestSchema,
            expect.any(Function)
        );

        const listToolsHandler = mockServer.setRequestHandler.mock.calls.find(
            (call: any) => call[0] === ListToolsRequestSchema
        )[1];

        const response = await listToolsHandler();
        expect(response).toEqual({ tools: expect.any(Array) });
        expect(response.tools[0].name).toBe('get_quote');
    });

    it('should handle get_quote tool call', async () => {
        const callToolHandler = mockServer.setRequestHandler.mock.calls.find(
            (call: any) => call[0] === CallToolRequestSchema
        )[1];

        const request = {
            params: {
                name: 'get_quote',
                arguments: { symbol: 'AAPL' },
            },
        };

        const response = await callToolHandler(request);

        expect(mockMarketDataService.getQuote).toHaveBeenCalledWith('AAPL');
        expect(response.content[0].text).toContain('"price": 100');
    });

    it('should handle get_historical_data tool call', async () => {
        const callToolHandler = mockServer.setRequestHandler.mock.calls.find(
            (call: any) => call[0] === CallToolRequestSchema
        )[1];

        const request = {
            params: {
                name: 'get_historical_data',
                arguments: { symbol: 'AAPL', period: '1y' },
            },
        };

        const response = await callToolHandler(request);

        expect(mockMarketDataService.getHistoricalData).toHaveBeenCalledWith('AAPL', '1y');
        expect(response.content[0].text).toContain('[]');
    });

    it('should handle search_symbol tool call', async () => {
        const callToolHandler = mockServer.setRequestHandler.mock.calls.find(
            (call: any) => call[0] === CallToolRequestSchema
        )[1];

        const request = {
            params: {
                name: 'search_symbol',
                arguments: { query: 'Apple' },
            },
        };

        const response = await callToolHandler(request);

        expect(mockMarketDataService.searchSymbol).toHaveBeenCalledWith('Apple');
        expect(response.content[0].text).toContain('[]');
    });

    it('should handle get_company_info tool call', async () => {
        const callToolHandler = mockServer.setRequestHandler.mock.calls.find(
            (call: any) => call[0] === CallToolRequestSchema
        )[1];

        const request = {
            params: {
                name: 'get_company_info',
                arguments: { symbol: 'AAPL' },
            },
        };

        const response = await callToolHandler(request);

        expect(mockMarketDataService.getCompanyInfo).toHaveBeenCalledWith('AAPL');
        expect(response.content[0].text).toContain('{}');
    });

    it('should handle explain_fundamental tool call', async () => {
        const callToolHandler = mockServer.setRequestHandler.mock.calls.find(
            (call: any) => call[0] === CallToolRequestSchema
        )[1];

        const request = {
            params: {
                name: 'explain_fundamental',
                arguments: { metric: 'pe_ratio' },
            },
        };

        const response = await callToolHandler(request);

        expect(mockEducationalService.explainFundamental).toHaveBeenCalledWith('pe_ratio', undefined);
        expect(response.content[0].text).toContain('mock explanation');
    });

    it('should handle compare_peers tool call', async () => {
        const callToolHandler = mockServer.setRequestHandler.mock.calls.find(
            (call: any) => call[0] === CallToolRequestSchema
        )[1];

        const request = {
            params: {
                name: 'compare_peers',
                arguments: { symbol: 'AAPL' },
            },
        };

        const response = await callToolHandler(request);

        expect(mockEducationalService.comparePeers).toHaveBeenCalledWith('AAPL', undefined, undefined);
        expect(response.content[0].text).toContain('mock comparison');
    });

    it('should handle unknown tool call', async () => {
        const callToolHandler = mockServer.setRequestHandler.mock.calls.find(
            (call: any) => call[0] === CallToolRequestSchema
        )[1];

        const request = {
            params: {
                name: 'unknown_tool',
                arguments: {},
            },
        };

        const response = await callToolHandler(request);

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toContain('Unknown tool: unknown_tool');
    });

    it('should handle errors from service calls', async () => {
        mockMarketDataService.getQuote.mockRejectedValueOnce(new Error('Service failed'));

        const callToolHandler = mockServer.setRequestHandler.mock.calls.find(
            (call: any) => call[0] === CallToolRequestSchema
        )[1];

        const request = {
            params: {
                name: 'get_quote',
                arguments: { symbol: 'AAPL' },
            },
        };

        const response = await callToolHandler(request);

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toContain('Error: Service failed');
    });
});
