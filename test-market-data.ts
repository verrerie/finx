#!/usr/bin/env node

/**
 * Test script for Market Data MCP Server
 * Refactored following SOLID principles
 */

import { ChildProcess, spawn } from 'child_process';
import { resolve } from 'path';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface MCPRequest {
    jsonrpc: string;
    id: number;
    method: string;
    params?: any;
}

interface MCPResponse {
    jsonrpc: string;
    id: number;
    result?: any;
    error?: any;
}

interface TestResult {
    passed: boolean;
    name: string;
    message: string;
    data?: any;
}

interface MCPClientConfig {
    serverPath: string;
    timeout: number;
}

// ============================================================================
// Message Buffer Management
// ============================================================================

class MessageBuffer {
    private buffer = '';

    append(chunk: string): string[] {
        this.buffer += chunk;
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';
        return lines.filter(line => line.trim());
    }

    clear(): void {
        this.buffer = '';
    }
}

// ============================================================================
// MCP Communication Protocol
// ============================================================================

class MCPClient {
    private process: ChildProcess;
    private requestId = 0;
    private pendingRequests = new Map<number, { resolve: Function; reject: Function }>();
    private messageBuffer: MessageBuffer;

    constructor(private config: MCPClientConfig) {
        this.messageBuffer = new MessageBuffer();
        this.process = this.startServer();
        this.setupResponseHandler();
    }

    private startServer(): ChildProcess {
        return spawn('npx', ['tsx', this.config.serverPath], {
            stdio: ['pipe', 'pipe', 'inherit'],
        });
    }

    private setupResponseHandler(): void {
        this.process.stdout?.on('data', (chunk) => {
            const lines = this.messageBuffer.append(chunk.toString());
            lines.forEach(line => this.processResponse(line));
        });
    }

    private processResponse(line: string): void {
        try {
            const response: MCPResponse = JSON.parse(line);
            const pending = this.pendingRequests.get(response.id);
            if (pending) {
                if (response.error) {
                    pending.reject(new Error(response.error.message || 'Unknown error'));
                } else {
                    pending.resolve(response.result);
                }
                this.pendingRequests.delete(response.id);
            }
        } catch (error) {
            console.error('Failed to parse response:', line);
        }
    }

    async request(method: string, params?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const id = ++this.requestId;
            this.pendingRequests.set(id, { resolve, reject });

            const request: MCPRequest = {
                jsonrpc: '2.0',
                id,
                method,
                params,
            };

            this.process.stdin?.write(JSON.stringify(request) + '\n');

            setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    reject(new Error('Request timeout'));
                }
            }, this.config.timeout);
        });
    }

    async listTools(): Promise<any> {
        return this.request('tools/list');
    }

    async callTool(name: string, args: any): Promise<any> {
        return this.request('tools/call', { name, arguments: args });
    }

    close(): void {
        this.process.kill();
        this.messageBuffer.clear();
    }
}

// ============================================================================
// Test Output Formatting
// ============================================================================

class TestReporter {
    private static readonly SEPARATOR = '='.repeat(60);
    private static readonly SUB_SEPARATOR = '-'.repeat(60);

    printHeader(title: string): void {
        console.log(`\n${title}\n${TestReporter.SEPARATOR}`);
    }

    printTestStart(testName: string): void {
        console.log(`\n${testName}`);
        console.log(TestReporter.SUB_SEPARATOR);
    }

    printSuccess(message: string): void {
        console.log(`✓ ${message}`);
    }

    printError(message: string): void {
        console.error(`✗ ${message}`);
    }

    printSummary(results: TestResult[]): void {
        const passed = results.filter(r => r.passed).length;
        const total = results.length;

        console.log(`\n${TestReporter.SEPARATOR}`);
        if (passed === total) {
            console.log('✅ All tests passed successfully!');
        } else {
            console.log(`❌ ${total - passed}/${total} tests failed`);
        }
        console.log(TestReporter.SEPARATOR);
    }

    printLearningNotes(): void {
        console.log('\n🎓 Learning Notes:');
        console.log('  - Market data is cached for 5 minutes to respect API limits');
        console.log('  - Alpha Vantage provides richer fundamental data');
        console.log('  - Yahoo Finance is used as fallback for reliability');
        console.log('  - Check API usage in responses to manage daily limits (25/day)');
        console.log('\n📚 Next Steps:');
        console.log('  1. Use explain_fundamental to learn about financial metrics');
        console.log('  2. Use compare_peers to see how companies stack up');
        console.log('  3. Explore different stocks to learn about sectors');
        console.log('  4. Document findings in .cursor/knowledge/journal/');
        console.log('  5. Start building your investment knowledge base!');
    }
}

// ============================================================================
// Individual Test Cases
// ============================================================================

class MarketDataTests {
    constructor(
        private client: MCPClient,
        private reporter: TestReporter
    ) { }

    async testListTools(): Promise<TestResult> {
        this.reporter.printTestStart('📋 Test 1: List Available Tools');

        try {
            const tools = await this.client.listTools();
            this.reporter.printSuccess(`Found ${tools.tools.length} tools:`);
            tools.tools.forEach((tool: any) => {
                console.log(`  - ${tool.name}: ${tool.description.substring(0, 60)}...`);
            });

            return {
                passed: true,
                name: 'List Tools',
                message: `Found ${tools.tools.length} tools`,
                data: tools
            };
        } catch (error) {
            this.reporter.printError(`Failed: ${error}`);
            return {
                passed: false,
                name: 'List Tools',
                message: String(error)
            };
        }
    }

    async testGetQuote(): Promise<TestResult> {
        this.reporter.printTestStart('💰 Test 2: Get Quote (AAPL)');

        try {
            const quote = await this.client.callTool('get_quote', { symbol: 'AAPL' });
            const quoteData = JSON.parse(quote.content[0].text.split('\n\n')[0]);

            this.reporter.printSuccess(`Symbol: ${quoteData.symbol}`);
            this.reporter.printSuccess(`Price: $${quoteData.price.toFixed(2)}`);
            this.reporter.printSuccess(`Change: ${quoteData.change >= 0 ? '+' : ''}${quoteData.change.toFixed(2)} (${quoteData.changePercent.toFixed(2)}%)`);
            this.reporter.printSuccess(`Volume: ${quoteData.volume.toLocaleString()}`);

            if (quoteData.marketCap) {
                this.reporter.printSuccess(`Market Cap: $${(quoteData.marketCap / 1e9).toFixed(2)}B`);
            }
            if (quoteData.peRatio) {
                this.reporter.printSuccess(`P/E Ratio: ${quoteData.peRatio.toFixed(2)}`);
            }

            return {
                passed: true,
                name: 'Get Quote',
                message: 'Quote retrieved successfully',
                data: quoteData
            };
        } catch (error) {
            this.reporter.printError(`Failed: ${error}`);
            return {
                passed: false,
                name: 'Get Quote',
                message: String(error)
            };
        }
    }

    async testGetCompanyInfo(): Promise<TestResult> {
        this.reporter.printTestStart('🏢 Test 3: Get Company Info (MSFT)');

        try {
            const companyInfo = await this.client.callTool('get_company_info', { symbol: 'MSFT' });
            const companyData = JSON.parse(companyInfo.content[0].text.split('\n\n')[0]);

            this.reporter.printSuccess(`Name: ${companyData.name}`);
            this.reporter.printSuccess(`Sector: ${companyData.sector}`);
            this.reporter.printSuccess(`Industry: ${companyData.industry}`);
            this.reporter.printSuccess(`Description: ${companyData.description.substring(0, 100)}...`);

            if (companyData.peRatio) {
                this.reporter.printSuccess(`P/E Ratio: ${companyData.peRatio.toFixed(2)}`);
            }
            if (companyData.returnOnEquity) {
                this.reporter.printSuccess(`ROE: ${(companyData.returnOnEquity * 100).toFixed(2)}%`);
            }
            if (companyData.debtToEquity) {
                this.reporter.printSuccess(`Debt/Equity: ${companyData.debtToEquity.toFixed(2)}`);
            }

            return {
                passed: true,
                name: 'Get Company Info',
                message: 'Company info retrieved successfully',
                data: companyData
            };
        } catch (error) {
            this.reporter.printError(`Failed: ${error}`);
            return {
                passed: false,
                name: 'Get Company Info',
                message: String(error)
            };
        }
    }

    async testGetHistoricalData(): Promise<TestResult> {
        this.reporter.printTestStart('📈 Test 4: Get Historical Data (GOOGL, 1 month)');

        try {
            const historical = await this.client.callTool('get_historical_data', {
                symbol: 'GOOGL',
                period: '1mo'
            });
            const histData = JSON.parse(historical.content[0].text.split('\n\n')[0]);

            this.reporter.printSuccess(`Retrieved ${histData.length} data points`);

            if (histData.length > 0) {
                const latest = histData[histData.length - 1];
                const oldest = histData[0];
                this.reporter.printSuccess(`Date Range: ${oldest.date} to ${latest.date}`);
                this.reporter.printSuccess(`Latest Close: $${latest.close.toFixed(2)}`);
                this.reporter.printSuccess(`Latest Volume: ${latest.volume.toLocaleString()}`);
            }

            return {
                passed: true,
                name: 'Get Historical Data',
                message: `Retrieved ${histData.length} data points`,
                data: histData
            };
        } catch (error) {
            this.reporter.printError(`Failed: ${error}`);
            return {
                passed: false,
                name: 'Get Historical Data',
                message: String(error)
            };
        }
    }

    async testSearchSymbol(): Promise<TestResult> {
        this.reporter.printTestStart('🔍 Test 5: Search Symbol (Tesla)');

        try {
            const search = await this.client.callTool('search_symbol', { query: 'Tesla' });
            const searchData = JSON.parse(search.content[0].text.split('\n\n')[0]);

            this.reporter.printSuccess(`Found ${searchData.length} matches:`);
            searchData.slice(0, 3).forEach((result: any) => {
                console.log(`  - ${result.symbol}: ${result.name} (${result.exchange})`);
            });

            return {
                passed: true,
                name: 'Search Symbol',
                message: `Found ${searchData.length} matches`,
                data: searchData
            };
        } catch (error) {
            this.reporter.printError(`Failed: ${error}`);
            return {
                passed: false,
                name: 'Search Symbol',
                message: String(error)
            };
        }
    }

    async testExplainFundamental(): Promise<TestResult> {
        this.reporter.printTestStart('📘 Test 6: Explain Fundamental (P/E Ratio)');

        try {
            const explainResult = await this.client.callTool('explain_fundamental', {
                metric: 'pe_ratio',
                symbol: 'AAPL'
            });
            const explanationText = explainResult.content[0].text;

            console.log(explanationText.substring(0, 300) + '...\n(truncated)');

            if (explanationText.includes('Price-to-Earnings')) {
                this.reporter.printSuccess('Educational explanation includes P/E ratio definition');
            }
            if (explanationText.includes('Definition')) {
                this.reporter.printSuccess('Includes definition section');
            }
            if (explanationText.includes('What It Means')) {
                this.reporter.printSuccess('Includes interpretation guidance');
            }

            return {
                passed: true,
                name: 'Explain Fundamental',
                message: 'Educational explanation retrieved',
                data: explanationText
            };
        } catch (error) {
            this.reporter.printError(`Failed: ${error}`);
            return {
                passed: false,
                name: 'Explain Fundamental',
                message: String(error)
            };
        }
    }

    async testComparePeers(): Promise<TestResult> {
        this.reporter.printTestStart('📊 Test 7: Compare Peers (Technology Sector)');

        try {
            const compareResult = await this.client.callTool('compare_peers', {
                symbol: 'AAPL'
            });
            const comparisonText = compareResult.content[0].text;

            console.log(comparisonText.substring(0, 500) + '...\n(truncated)');

            if (comparisonText.includes('Technology')) {
                this.reporter.printSuccess('Identified Technology sector');
            }
            if (comparisonText.includes('Market Cap')) {
                this.reporter.printSuccess('Includes market cap comparison');
            }
            if (comparisonText.includes('P/E Ratio')) {
                this.reporter.printSuccess('Includes P/E ratio comparison');
            }
            if (comparisonText.includes('Learning Points')) {
                this.reporter.printSuccess('Includes educational learning points');
            }

            return {
                passed: true,
                name: 'Compare Peers',
                message: 'Peer comparison retrieved',
                data: comparisonText
            };
        } catch (error) {
            this.reporter.printError(`Failed: ${error}`);
            return {
                passed: false,
                name: 'Compare Peers',
                message: String(error)
            };
        }
    }

    async runAllTests(): Promise<TestResult[]> {
        const tests = [
            () => this.testListTools(),
            () => this.testGetQuote(),
            () => this.testGetCompanyInfo(),
            () => this.testGetHistoricalData(),
            () => this.testSearchSymbol(),
            () => this.testExplainFundamental(),
            () => this.testComparePeers(),
        ];

        const results: TestResult[] = [];
        for (const test of tests) {
            const result = await test();
            results.push(result);
            if (!result.passed) {
                // Continue with other tests even if one fails
                console.log(`\n⚠️  Continuing with remaining tests...\n`);
            }
        }

        return results;
    }
}

// ============================================================================
// Open/Closed: Test Runner (open for extension via new test methods)
// ============================================================================

class TestRunner {
    private client: MCPClient;
    private reporter: TestReporter;
    private tests: MarketDataTests;

    constructor(private config: MCPClientConfig) {
        this.reporter = new TestReporter();
        this.client = new MCPClient(config);
        this.tests = new MarketDataTests(this.client, this.reporter);
    }

    async run(): Promise<void> {
        this.reporter.printHeader('🧪 Testing FinX Market Data MCP Server');

        try {
            const results = await this.tests.runAllTests();
            this.reporter.printSummary(results);
            this.reporter.printLearningNotes();

            // Exit with error code if any tests failed
            const allPassed = results.every(r => r.passed);
            if (!allPassed) {
                process.exit(1);
            }
        } catch (error) {
            this.reporter.printError(`Fatal error: ${error}`);
            process.exit(1);
        } finally {
            this.client.close();
        }
    }
}

// ============================================================================
// Main: Dependency Injection
// ============================================================================

async function main() {
    const config: MCPClientConfig = {
        serverPath: resolve(process.cwd(), 'mcp-market-data/src/index.ts'),
        timeout: 30000,
    };

    const runner = new TestRunner(config);
    await runner.run();
}

// Run tests
main().catch(console.error);

