#!/usr/bin/env node

/**
 * Portfolio Learning Features Integration Test
 * Tests watchlist, investment thesis, and what-if analysis tools
 */

import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

interface MCPMessage {
    jsonrpc: string;
    id?: number | string;
    method?: string;
    params?: any;
    result?: any;
    error?: any;
}

/**
 * Message Buffer - Handles partial JSON messages
 */
class MessageBuffer {
    private buffer: string = '';

    append(chunk: string): MCPMessage[] {
        this.buffer += chunk;
        const messages: MCPMessage[] = [];

        let startIdx = 0;
        while (startIdx < this.buffer.length) {
            try {
                const remainingBuffer = this.buffer.slice(startIdx);
                const parsed = JSON.parse(remainingBuffer);
                messages.push(parsed);
                startIdx = this.buffer.length;
            } catch {
                const nextBrace = this.buffer.indexOf('}{', startIdx);
                if (nextBrace === -1) break;

                try {
                    const message = this.buffer.slice(startIdx, nextBrace + 1);
                    const parsed = JSON.parse(message);
                    messages.push(parsed);
                    startIdx = nextBrace + 1;
                } catch {
                    startIdx++;
                }
            }
        }

        if (startIdx > 0) {
            this.buffer = this.buffer.slice(startIdx);
        }

        return messages;
    }

    clear(): void {
        this.buffer = '';
    }
}

/**
 * MCP Client for Portfolio Learning Features
 */
class MCPClient {
    private process: ChildProcessWithoutNullStreams;
    private messageBuffer = new MessageBuffer();
    private messageId = 1;
    private responses = new Map<number, (response: MCPMessage) => void>();

    constructor(serverPath: string) {
        this.process = spawn('npx', ['tsx', serverPath], {
            stdio: ['pipe', 'pipe', 'inherit'],
        });

        this.process.stdout?.on('data', (data: Buffer) => {
            const messages = this.messageBuffer.append(data.toString());
            for (const message of messages) {
                if (message.id && this.responses.has(message.id as number)) {
                    const resolver = this.responses.get(message.id as number);
                    if (resolver) {
                        resolver(message);
                        this.responses.delete(message.id as number);
                    }
                }
            }
        });
    }

    async sendRequest(method: string, params: any = {}): Promise<any> {
        const id = this.messageId++;
        const request: MCPMessage = {
            jsonrpc: '2.0',
            id,
            method,
            params,
        };

        return new Promise((resolve) => {
            this.responses.set(id, resolve);
            this.process.stdin?.write(JSON.stringify(request) + '\n');
        });
    }

    close(): void {
        this.process.kill();
    }
}

/**
 * Test Runner
 */
class TestRunner {
    private client: MCPClient;
    private portfolioId: string = '';
    private passedTests = 0;
    private failedTests = 0;

    constructor() {
        this.client = new MCPClient('mcp-portfolio/src/index.ts');
    }

    async runTests(): Promise<void> {
        console.log('🧪 Testing Portfolio Learning Features\n');
        console.log('='.repeat(60));

        // Wait for server to initialize
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // Setup: Get portfolio ID
            await this.setupPortfolio();

            // Test Watchlist Features
            await this.testAddToWatchlist();
            await this.testGetWatchlist();
            await this.testUpdateWatchlistItem();
            await this.testRemoveFromWatchlist();

            // Test Investment Thesis Features
            await this.testCreateThesis();
            await this.testGetTheses();
            await this.testGetThesis();
            await this.testUpdateThesis();

            // Test What-If Analysis
            await this.testWhatIfBuy();
            await this.testWhatIfSell();

            // Cleanup
            await this.testDeleteThesis();

            console.log('\n' + '='.repeat(60));
            console.log(`\n✅ Passed: ${this.passedTests}`);
            console.log(`❌ Failed: ${this.failedTests}`);
            console.log(`\n📊 Total: ${this.passedTests + this.failedTests} tests\n`);

            if (this.failedTests === 0) {
                console.log('🎉 All learning features tests passed!\n');
            }
        } finally {
            this.client.close();
        }
    }

    private async setupPortfolio(): Promise<void> {
        console.log('\n📋 Setup: Getting portfolio ID...');
        const response = await this.client.sendRequest('tools/call', {
            name: 'list_portfolios',
            arguments: {},
        });

        const result = JSON.parse(response.result.content[0].text);
        if (result.portfolios && result.portfolios.length > 0) {
            this.portfolioId = result.portfolios[0].id;
            console.log(`   ✓ Using portfolio: ${result.portfolios[0].name} (${this.portfolioId})`);
        } else {
            console.log('   ❌ No portfolios found. Please run test-portfolio.ts first.');
            process.exit(1);
        }
    }

    private async testAddToWatchlist(): Promise<void> {
        console.log('\n1️⃣  Test: add_to_watchlist');
        try {
            const response = await this.client.sendRequest('tools/call', {
                name: 'add_to_watchlist',
                arguments: {
                    portfolio_id: this.portfolioId,
                    symbol: 'TSLA',
                    notes: 'Watching for entry point below $200',
                    target_price: 180.00,
                    priority: 'HIGH',
                },
            });

            const result = JSON.parse(response.result.content[0].text);
            if (result.success && result.watchlist_item.symbol === 'TSLA') {
                console.log('   ✅ PASS: Added TSLA to watchlist');
                console.log(`      - Symbol: ${result.watchlist_item.symbol}`);
                console.log(`      - Target Price: $${result.watchlist_item.target_price}`);
                console.log(`      - Priority: ${result.watchlist_item.priority}`);
                this.passedTests++;
            } else {
                console.log('   ❌ FAIL: Response structure invalid');
                this.failedTests++;
            }
        } catch (error) {
            console.log(`   ❌ FAIL: ${error}`);
            this.failedTests++;
        }
    }

    private async testGetWatchlist(): Promise<void> {
        console.log('\n2️⃣  Test: get_watchlist');
        try {
            const response = await this.client.sendRequest('tools/call', {
                name: 'get_watchlist',
                arguments: {
                    portfolio_id: this.portfolioId,
                },
            });

            const result = JSON.parse(response.result.content[0].text);
            if (result.success && result.watchlist.length > 0) {
                console.log('   ✅ PASS: Retrieved watchlist');
                console.log(`      - Items: ${result.count}`);
                result.watchlist.forEach((item: any) => {
                    console.log(`      - ${item.symbol}: $${item.target_price || 'N/A'} (${item.priority})`);
                });
                this.passedTests++;
            } else {
                console.log('   ❌ FAIL: Watchlist empty or invalid');
                this.failedTests++;
            }
        } catch (error) {
            console.log(`   ❌ FAIL: ${error}`);
            this.failedTests++;
        }
    }

    private async testUpdateWatchlistItem(): Promise<void> {
        console.log('\n3️⃣  Test: update_watchlist_item');
        try {
            const response = await this.client.sendRequest('tools/call', {
                name: 'update_watchlist_item',
                arguments: {
                    portfolio_id: this.portfolioId,
                    symbol: 'TSLA',
                    notes: 'Updated: Now watching for Q4 earnings report',
                    target_price: 175.00,
                },
            });

            const result = JSON.parse(response.result.content[0].text);
            if (result.success && result.watchlist_item && result.watchlist_item.target_price) {
                const targetPrice = parseFloat(result.watchlist_item.target_price);
                if (Math.abs(targetPrice - 175) < 0.01) {
                    console.log('   ✅ PASS: Updated watchlist item');
                    console.log(`      - New Target Price: $${result.watchlist_item.target_price}`);
                    this.passedTests++;
                } else {
                    console.log(`   ❌ FAIL: Target price is ${targetPrice}, expected 175`);
                    this.failedTests++;
                }
            } else {
                console.log('   ❌ FAIL: Update failed or invalid response');
                console.log(`      - Response: ${JSON.stringify(result, null, 2)}`);
                this.failedTests++;
            }
        } catch (error) {
            console.log(`   ❌ FAIL: ${error}`);
            this.failedTests++;
        }
    }

    private async testRemoveFromWatchlist(): Promise<void> {
        console.log('\n4️⃣  Test: remove_from_watchlist');
        try {
            const response = await this.client.sendRequest('tools/call', {
                name: 'remove_from_watchlist',
                arguments: {
                    portfolio_id: this.portfolioId,
                    symbol: 'TSLA',
                },
            });

            const result = JSON.parse(response.result.content[0].text);
            if (result.success) {
                console.log('   ✅ PASS: Removed TSLA from watchlist');
                this.passedTests++;
            } else {
                console.log('   ❌ FAIL: Remove failed');
                this.failedTests++;
            }
        } catch (error) {
            console.log(`   ❌ FAIL: ${error}`);
            this.failedTests++;
        }
    }

    private async testCreateThesis(): Promise<void> {
        console.log('\n5️⃣  Test: create_thesis');
        try {
            const response = await this.client.sendRequest('tools/call', {
                name: 'create_thesis',
                arguments: {
                    portfolio_id: this.portfolioId,
                    symbol: 'AAPL',
                    thesis: 'Apple is transitioning to a services-focused business model with high margin recurring revenue.',
                    bull_case: 'Services revenue growing 15%+ annually, ecosystem lock-in increasing, new products expanding TAM',
                    bear_case: 'iPhone sales plateau, regulatory headwinds in App Store, increased competition in wearables',
                    target_allocation: 15,
                    review_date: '2025-12-31',
                },
            });

            const result = JSON.parse(response.result.content[0].text);
            if (result.success && result.thesis.symbol === 'AAPL') {
                console.log('   ✅ PASS: Created investment thesis for AAPL');
                console.log(`      - Target Allocation: ${result.thesis.target_allocation}%`);
                console.log(`      - Bull Case: ${result.thesis.bull_case.substring(0, 60)}...`);
                console.log(`      - Bear Case: ${result.thesis.bear_case.substring(0, 60)}...`);
                this.passedTests++;
            } else {
                console.log('   ❌ FAIL: Thesis creation failed');
                this.failedTests++;
            }
        } catch (error) {
            console.log(`   ❌ FAIL: ${error}`);
            this.failedTests++;
        }
    }

    private async testGetTheses(): Promise<void> {
        console.log('\n6️⃣  Test: get_theses');
        try {
            const response = await this.client.sendRequest('tools/call', {
                name: 'get_theses',
                arguments: {
                    portfolio_id: this.portfolioId,
                },
            });

            const result = JSON.parse(response.result.content[0].text);
            if (result.success && result.theses.length > 0) {
                console.log('   ✅ PASS: Retrieved investment theses');
                console.log(`      - Count: ${result.count}`);
                result.theses.forEach((thesis: any) => {
                    console.log(`      - ${thesis.symbol}: ${thesis.status}, Target: ${thesis.target_allocation}%`);
                });
                this.passedTests++;
            } else {
                console.log('   ❌ FAIL: No theses found');
                this.failedTests++;
            }
        } catch (error) {
            console.log(`   ❌ FAIL: ${error}`);
            this.failedTests++;
        }
    }

    private async testGetThesis(): Promise<void> {
        console.log('\n7️⃣  Test: get_thesis');
        try {
            const response = await this.client.sendRequest('tools/call', {
                name: 'get_thesis',
                arguments: {
                    portfolio_id: this.portfolioId,
                    symbol: 'AAPL',
                },
            });

            const result = JSON.parse(response.result.content[0].text);
            if (result.success && result.thesis) {
                console.log('   ✅ PASS: Retrieved thesis for AAPL');
                console.log(`      - Thesis: ${result.thesis.thesis.substring(0, 60)}...`);
                this.passedTests++;
            } else {
                console.log('   ❌ FAIL: Thesis not found');
                this.failedTests++;
            }
        } catch (error) {
            console.log(`   ❌ FAIL: ${error}`);
            this.failedTests++;
        }
    }

    private async testUpdateThesis(): Promise<void> {
        console.log('\n8️⃣  Test: update_thesis');
        try {
            const response = await this.client.sendRequest('tools/call', {
                name: 'update_thesis',
                arguments: {
                    portfolio_id: this.portfolioId,
                    symbol: 'AAPL',
                    target_allocation: 20,
                    status: 'MONITORING',
                },
            });

            const result = JSON.parse(response.result.content[0].text);
            if (result.success && result.thesis && result.thesis.target_allocation) {
                const targetAlloc = parseFloat(result.thesis.target_allocation);
                if (Math.abs(targetAlloc - 20) < 0.01) {
                    console.log('   ✅ PASS: Updated thesis');
                    console.log(`      - New Target Allocation: ${result.thesis.target_allocation}%`);
                    console.log(`      - New Status: ${result.thesis.status}`);
                    this.passedTests++;
                } else {
                    console.log(`   ❌ FAIL: Target allocation is ${targetAlloc}, expected 20`);
                    this.failedTests++;
                }
            } else {
                console.log('   ❌ FAIL: Update failed or invalid response');
                console.log(`      - Response: ${JSON.stringify(result, null, 2)}`);
                this.failedTests++;
            }
        } catch (error) {
            console.log(`   ❌ FAIL: ${error}`);
            this.failedTests++;
        }
    }

    private async testWhatIfBuy(): Promise<void> {
        console.log('\n9️⃣  Test: analyze_what_if (BUY)');
        try {
            const response = await this.client.sendRequest('tools/call', {
                name: 'analyze_what_if',
                arguments: {
                    portfolio_id: this.portfolioId,
                    symbol: 'AAPL',
                    action: 'BUY',
                    quantity: 10,
                    price: 175.00,
                    current_prices: {
                        'AAPL': 180.00,
                        'MSFT': 380.00,
                    },
                },
            });

            const result = JSON.parse(response.result.content[0].text);
            if (result.success && result.analysis.action === 'BUY') {
                console.log('   ✅ PASS: What-if BUY analysis complete');
                console.log(`      - Action: ${result.analysis.action}`);
                console.log(`      - New Quantity: ${result.analysis.after_purchase.new_quantity}`);
                console.log(`      - New Avg Cost: $${result.analysis.after_purchase.new_average_cost.toFixed(2)}`);
                console.log(`      - Cash Required: $${result.analysis.portfolio_impact.cash_required}`);
                console.log(`      - New Position Weight: ${result.analysis.portfolio_impact.position_weight_after.toFixed(2)}%`);
                this.passedTests++;
            } else {
                console.log('   ❌ FAIL: Analysis failed');
                this.failedTests++;
            }
        } catch (error) {
            console.log(`   ❌ FAIL: ${error}`);
            this.failedTests++;
        }
    }

    private async testWhatIfSell(): Promise<void> {
        console.log('\n🔟  Test: analyze_what_if (SELL)');
        try {
            const response = await this.client.sendRequest('tools/call', {
                name: 'analyze_what_if',
                arguments: {
                    portfolio_id: this.portfolioId,
                    symbol: 'AAPL',
                    action: 'SELL',
                    quantity: 5, // Not used for SELL but required by schema
                    price: 185.00,
                    current_prices: {
                        'AAPL': 180.00,
                        'MSFT': 380.00,
                    },
                },
            });

            const result = JSON.parse(response.result.content[0].text);
            if (result.success && result.analysis.action === 'SELL') {
                console.log('   ✅ PASS: What-if SELL analysis complete');
                console.log(`      - Action: ${result.analysis.action}`);
                console.log(`      - Realized Gain/Loss: $${result.analysis.after_sale.realized_gain_loss.toFixed(2)}`);
                console.log(`      - Proceeds: $${result.analysis.after_sale.proceeds.toFixed(2)}`);
                console.log(`      - Tax Impact (15%): $${result.analysis.after_sale.tax_impact_estimate.toFixed(2)}`);
                console.log(`      - Position Weight Before: ${result.analysis.portfolio_impact.position_weight_before.toFixed(2)}%`);
                this.passedTests++;
            } else {
                console.log('   ❌ FAIL: Analysis failed');
                this.failedTests++;
            }
        } catch (error) {
            console.log(`   ❌ FAIL: ${error}`);
            this.failedTests++;
        }
    }

    private async testDeleteThesis(): Promise<void> {
        console.log('\n1️⃣1️⃣  Test: delete_thesis');
        try {
            const response = await this.client.sendRequest('tools/call', {
                name: 'delete_thesis',
                arguments: {
                    portfolio_id: this.portfolioId,
                    symbol: 'AAPL',
                },
            });

            const result = JSON.parse(response.result.content[0].text);
            if (result.success) {
                console.log('   ✅ PASS: Deleted thesis');
                this.passedTests++;
            } else {
                console.log('   ❌ FAIL: Delete failed');
                this.failedTests++;
            }
        } catch (error) {
            console.log(`   ❌ FAIL: ${error}`);
            this.failedTests++;
        }
    }
}

// Run tests
const runner = new TestRunner();
runner.runTests().catch((error) => {
    console.error('Test runner error:', error);
    process.exit(1);
});

