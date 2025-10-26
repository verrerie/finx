#!/usr/bin/env node

/**
 * Test script for Market Data MCP Server
 * 
 * This script tests all four core tools to ensure they're working correctly.
 */

import { spawn } from 'child_process';
import { resolve } from 'path';

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

class MCPClient {
    private process: ReturnType<typeof spawn>;
    private requestId = 0;
    private pendingRequests = new Map<number, { resolve: Function; reject: Function }>();
    private buffer = '';

    constructor() {
        // Start the MCP server using tsx to run TypeScript directly
        const serverPath = resolve(process.cwd(), 'mcp-market-data/src/index.ts');
        this.process = spawn('npx', ['tsx', serverPath], {
            stdio: ['pipe', 'pipe', 'inherit'],
        });

        // Handle responses
        this.process.stdout.on('data', (chunk) => {
            this.buffer += chunk.toString();

            // Process complete JSON messages
            const lines = this.buffer.split('\n');
            this.buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.trim()) {
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
            }
        });
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

            this.process.stdin.write(JSON.stringify(request) + '\n');

            // Timeout after 30 seconds
            setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    reject(new Error('Request timeout'));
                }
            }, 30000);
        });
    }

    async listTools(): Promise<any> {
        return this.request('tools/list');
    }

    async callTool(name: string, args: any): Promise<any> {
        return this.request('tools/call', {
            name,
            arguments: args,
        });
    }

    close() {
        this.process.kill();
    }
}

async function runTests() {
    console.log('🧪 Testing FinX Market Data MCP Server\n');
    console.log('='.repeat(60));

    const client = new MCPClient();

    try {
        // Test 1: List available tools
        console.log('\n📋 Test 1: List Available Tools');
        console.log('-'.repeat(60));
        const tools = await client.listTools();
        console.log(`✓ Found ${tools.tools.length} tools:`);
        tools.tools.forEach((tool: any) => {
            console.log(`  - ${tool.name}: ${tool.description.substring(0, 60)}...`);
        });

        // Test 2: Get Quote
        console.log('\n💰 Test 2: Get Quote (AAPL)');
        console.log('-'.repeat(60));
        const quote = await client.callTool('get_quote', { symbol: 'AAPL' });
        const quoteData = JSON.parse(quote.content[0].text.split('\n\n')[0]);
        console.log(`✓ Symbol: ${quoteData.symbol}`);
        console.log(`✓ Price: $${quoteData.price.toFixed(2)}`);
        console.log(`✓ Change: ${quoteData.change >= 0 ? '+' : ''}${quoteData.change.toFixed(2)} (${quoteData.changePercent.toFixed(2)}%)`);
        console.log(`✓ Volume: ${quoteData.volume.toLocaleString()}`);
        if (quoteData.marketCap) {
            console.log(`✓ Market Cap: $${(quoteData.marketCap / 1e9).toFixed(2)}B`);
        }
        if (quoteData.peRatio) {
            console.log(`✓ P/E Ratio: ${quoteData.peRatio.toFixed(2)}`);
        }

        // Test 3: Get Company Info
        console.log('\n🏢 Test 3: Get Company Info (MSFT)');
        console.log('-'.repeat(60));
        const companyInfo = await client.callTool('get_company_info', { symbol: 'MSFT' });
        const companyData = JSON.parse(companyInfo.content[0].text.split('\n\n')[0]);
        console.log(`✓ Name: ${companyData.name}`);
        console.log(`✓ Sector: ${companyData.sector}`);
        console.log(`✓ Industry: ${companyData.industry}`);
        console.log(`✓ Description: ${companyData.description.substring(0, 100)}...`);
        if (companyData.peRatio) console.log(`✓ P/E Ratio: ${companyData.peRatio.toFixed(2)}`);
        if (companyData.returnOnEquity) console.log(`✓ ROE: ${(companyData.returnOnEquity * 100).toFixed(2)}%`);
        if (companyData.debtToEquity) console.log(`✓ Debt/Equity: ${companyData.debtToEquity.toFixed(2)}`);

        // Test 4: Get Historical Data
        console.log('\n📈 Test 4: Get Historical Data (GOOGL, 1 month)');
        console.log('-'.repeat(60));
        const historical = await client.callTool('get_historical_data', {
            symbol: 'GOOGL',
            period: '1mo'
        });
        const histData = JSON.parse(historical.content[0].text.split('\n\n')[0]);
        console.log(`✓ Retrieved ${histData.length} data points`);
        if (histData.length > 0) {
            const latest = histData[histData.length - 1];
            const oldest = histData[0];
            console.log(`✓ Date Range: ${oldest.date} to ${latest.date}`);
            console.log(`✓ Latest Close: $${latest.close.toFixed(2)}`);
            console.log(`✓ Latest Volume: ${latest.volume.toLocaleString()}`);
        }

        // Test 5: Search Symbol
        console.log('\n🔍 Test 5: Search Symbol (Tesla)');
        console.log('-'.repeat(60));
        const search = await client.callTool('search_symbol', { query: 'Tesla' });
        const searchData = JSON.parse(search.content[0].text.split('\n\n')[0]);
        console.log(`✓ Found ${searchData.length} matches:`);
        searchData.slice(0, 3).forEach((result: any) => {
            console.log(`  - ${result.symbol}: ${result.name} (${result.exchange})`);
        });

        console.log('\n' + '='.repeat(60));
        console.log('✅ All tests passed successfully!');
        console.log('='.repeat(60));
        console.log('\n🎓 Learning Notes:');
        console.log('  - Market data is cached for 5 minutes to respect API limits');
        console.log('  - Alpha Vantage provides richer fundamental data');
        console.log('  - Yahoo Finance is used as fallback for reliability');
        console.log('  - Check API usage in responses to manage daily limits (25/day)');
        console.log('\n📚 Next Steps:');
        console.log('  1. Explore different stocks to learn about various sectors');
        console.log('  2. Compare P/E ratios, ROE, and other metrics across companies');
        console.log('  3. Document interesting findings in .cursor/knowledge/journal/');
        console.log('  4. Start building your investment knowledge base!');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    } finally {
        client.close();
    }
}

// Run tests
runTests().catch(console.error);

