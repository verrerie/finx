#!/usr/bin/env tsx

/**
 * Test script for Portfolio MCP Server
 * Tests all core portfolio management tools
 */

import { ChildProcess, spawn } from 'child_process';

interface MCPMessage {
  jsonrpc: string;
  id?: number | string;
  method?: string;
  params?: any;
  result?: any;
  error?: any;
}

import * as fs from 'fs';

/**
 * Message buffer for handling incomplete JSON messages
 */
class MessageBuffer {
  private buffer = '';

  append(chunk: string): MCPMessage[] {
    this.buffer += chunk;
    const messages: MCPMessage[] = [];
    const lines = this.buffer.split('\n');

    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line) {
        try {
          messages.push(JSON.parse(line));
        } catch (e) {
          console.error('Failed to parse message:', line);
        }
      }
    }

    this.buffer = lines[lines.length - 1];
    return messages;
  }
}

/**
 * MCP Client for testing
 */
class MCPClient {
  private process: ChildProcess;
  private messageId = 1;
  private buffer = new MessageBuffer();
  private pendingRequests = new Map<number, {
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }>();

  constructor(serverPath: string) {
    this.process = spawn('npx', ['tsx', serverPath], {
      stdio: ['pipe', 'pipe', 'inherit'],
    });

    this.process.stdout?.on?.('data', (data) => {
      const messages = this.buffer.append(data.toString());
      for (const message of messages) {
        if (message.id !== undefined && this.pendingRequests.has(message.id as number)) {
          const request = this.pendingRequests.get(message.id as number)!;
          this.pendingRequests.delete(message.id as number);

          if (message.error) {
            request.reject(message.error);
          } else {
            request.resolve(message.result);
          }
        }
      }
    });

    this.process.on('error', (error) => {
      console.error('Process error:', error);
    });
  }

  async request(method: string, params?: any): Promise<any> {
    const id = this.messageId++;
    const message: MCPMessage = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.process.stdin?.write?.(JSON.stringify(message) + '\n');

      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 10000);
    });
  }

  close() {
    this.process.kill();
  }
}

/**
 * Test Reporter
 */
class TestReporter {
  private passed = 0;
  private failed = 0;

  success(message: string) {
    console.log(`✓ ${message}`);
    this.passed++;
  }

  fail(message: string, error?: any) {
    console.log(`✗ ${message}`);
    if (error) {
      console.log(`  Error: ${error.message || error}`);
    }
    this.failed++;
  }

  summary() {
    console.log('\n' + '='.repeat(60));
    console.log(`Tests: ${this.passed + this.failed} total`);
    console.log(`  ✓ ${this.passed} passed`);
    console.log(`  ✗ ${this.failed} failed`);
    console.log('='.repeat(60));

    return this.failed === 0;
  }
}

/**
 * Portfolio Tests
 */
class PortfolioTests {
  private portfolioId: string | null = null;
  private assetId: string | null = null;

  constructor(
    private client: MCPClient,
    private reporter: TestReporter
  ) { }

  async run() {
    console.log('\n🧪 Testing Portfolio MCP Server\n');

    await this.testListTools();
    await this.testCreatePortfolio();
    await this.testListPortfolios();
    if (this.portfolioId) {
      await this.testGetPortfolio();
      await this.testCreateAsset();
      if (this.assetId) {
        await this.testAddTransaction();
        await this.testGetHoldings();
        await this.testGetTransactions();
        await this.testCalculatePerformance();
      }
    }
  }

  private async testListTools() {
    try {
      const result = await this.client.request('tools/list');

      if (result.tools && Array.isArray(result.tools)) {
        this.reporter.success(`list_tools returned ${result.tools.length} tools`);

        const expectedTools = [
          'create_portfolio',
          'list_portfolios',
          'get_portfolio',
          'get_holdings',
          'add_transaction',
          'get_transactions',
          'calculate_performance',
          'delete_portfolio',
        ];

        const toolNames = result.tools.map((t: any) => t.name);
        const allPresent = expectedTools.every(name => toolNames.includes(name));

        if (allPresent) {
          this.reporter.success('All expected tools are present');
        } else {
          this.reporter.fail('Some expected tools are missing');
        }
      } else {
        this.reporter.fail('list_tools did not return tools array');
      }
    } catch (error) {
      this.reporter.fail('list_tools failed', error);
    }
  }

  private async testCreatePortfolio() {
    try {
      const result = await this.client.request('tools/call', {
        name: 'create_portfolio',
        arguments: {
          name: 'Test Portfolio',
          description: 'Integration test portfolio',
          currency: 'USD',
        },
      });

      const response = JSON.parse(result.content[0].text);

      if (response.success && response.portfolio) {
        this.portfolioId = response.portfolio.id;
        this.reporter.success(`create_portfolio: ${this.portfolioId}`);
      } else {
        this.reporter.fail('create_portfolio did not return success');
      }
    } catch (error) {
      this.reporter.fail('create_portfolio failed', error);
    }
  }

  private async testListPortfolios() {
    try {
      const result = await this.client.request('tools/call', {
        name: 'list_portfolios',
        arguments: {},
      });

      const response = JSON.parse(result.content[0].text);

      if (response.success && response.portfolios) {
        this.reporter.success(`list_portfolios returned ${response.count} portfolio(s)`);
      } else {
        console.error('Response:', JSON.stringify(response, null, 2));
        this.reporter.fail(`list_portfolios did not return success: ${response.error || 'unknown error'}`);
      }
    } catch (error) {
      this.reporter.fail('list_portfolios failed', error);
    }
  }

  private async testGetPortfolio() {
    try {
      const result = await this.client.request('tools/call', {
        name: 'get_portfolio',
        arguments: {
          portfolio_id: this.portfolioId,
        },
      });

      const response = JSON.parse(result.content[0].text);

      if (response.success && response.portfolio) {
        this.reporter.success('get_portfolio returned portfolio details');
      } else {
        this.reporter.fail('get_portfolio did not return success');
      }
    } catch (error) {
      this.reporter.fail('get_portfolio failed', error);
    }
  }

  private async testCreateAsset() {
    try {
      const result = await this.client.request('tools/call', {
        name: 'create_asset',
        arguments: {
          asset_type: 'STOCK',
          name: 'Apple Inc.',
          symbol: `AAPL-${Math.random().toString(36).substring(7)}`,
          currency: 'USD',
        },
      });

      const response = JSON.parse(result.content[0].text);

      if (response.success && response.asset && response.asset.id) {
        this.assetId = response.asset.id;
        this.reporter.success(`create_asset: ${this.assetId}`);
      } else {
        console.error('Response:', JSON.stringify(response, null, 2));
        this.reporter.fail('create_asset did not return success');
      }
    } catch (error) {
      this.reporter.fail('create_asset failed', error);
    }
  }

  private async testAddTransaction() {
    try {
      // Add a BUY transaction
      const result = await this.client.request('tools/call', {
        name: 'add_transaction',
        arguments: {
          portfolio_id: this.portfolioId,
          asset_id: this.assetId,
          type: 'BUY',
          quantity: 10,
          price: 150.00,
          fees: 1.00,
          transaction_date: '2025-01-15',
          notes: 'Test purchase',
        },
      });

      const response = JSON.parse(result.content[0].text);

      if (response.success && response.transaction) {
        this.reporter.success('add_transaction (BUY) created transaction and holding');
      } else {
        console.error('Response:', JSON.stringify(response, null, 2));
        this.reporter.fail(`add_transaction did not return success: ${response.error || 'unknown error'}`);
      }
    } catch (error) {
      this.reporter.fail('add_transaction failed', error);
    }
  }

  private async testGetHoldings() {
    try {
      const result = await this.client.request('tools/call', {
        name: 'get_holdings',
        arguments: {
          portfolio_id: this.portfolioId,
        },
      });

      const response = JSON.parse(result.content[0].text);

      if (response.success && response.holdings) {
        this.reporter.success(`get_holdings returned ${response.count} holding(s)`);
      } else {
        this.reporter.fail('get_holdings did not return success');
      }
    } catch (error) {
      this.reporter.fail('get_holdings failed', error);
    }
  }

  private async testGetTransactions() {
    try {
      const result = await this.client.request('tools/call', {
        name: 'get_transactions',
        arguments: {
          portfolio_id: this.portfolioId,
          limit: 10,
        },
      });

      const response = JSON.parse(result.content[0].text);

      if (response.success && response.transactions) {
        this.reporter.success(`get_transactions returned ${response.count} transaction(s)`);
      } else {
        this.reporter.fail('get_transactions did not return success');
      }
    } catch (error) {
      this.reporter.fail('get_transactions failed', error);
    }
  }

  private async testCalculatePerformance() {
    try {
      const result = await this.client.request('tools/call', {
        name: 'calculate_performance',
        arguments: {
          portfolio_id: this.portfolioId,
          current_prices: {
            [this.assetId!]: 175.00, // Simulated current price
          },
        },
      });

      const response = JSON.parse(result.content[0].text);

      if (response.success && response.performance) {
        const perf = response.performance;
        this.reporter.success(
          `calculate_performance: $${perf.total_value.toFixed(2)} ` +
          `(${perf.gain_loss_percent.toFixed(2)}% return)`
        );
      } else {
        this.reporter.fail('calculate_performance did not return success');
      }
    } catch (error) {
      this.reporter.fail('calculate_performance failed', error);
    }
  }
}

/**
 * Test Runner
 */
class TestRunner {
  async run() {
    console.log('Starting Portfolio MCP Server test...\n');
    console.log('Server: mcp-portfolio/src/index.ts');
    console.log('Database: MariaDB (localhost:3306)\n');

    // Setup database for testing
    await this.setupDatabase();

    const client = new MCPClient('mcp-portfolio/src/index.ts');
    const reporter = new TestReporter();
    const tests = new PortfolioTests(client, reporter);

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await tests.run();
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      client.close();
    }

    const success = reporter.summary();

    if (success) {
      console.log('\n✅ All tests passed!\n');
      console.log('Next steps:');
      console.log('1. Add learning features (theses, what-if scenarios)');
      console.log('2. Create portfolio analysis prompts for Cursor');
      console.log('3. Run end-to-end tests with real workflows');
    } else {
      console.log('\n❌ Some tests failed. Please review the errors above.\n');
    }

    process.exit(success ? 0 : 1);
  }

  private async setupDatabase() {
    console.log('Setting up database for tests...');
    try {
      // Apply schema
      await new Promise((resolve, reject) => {
        const schemaProcess = spawn('docker-compose', [
          'exec',
          '-T',
          'mariadb',
          'mariadb',
          '-u',
          'finx_user',
          '-pfinx_password',
          'finx',
        ], {
          stdio: ['pipe', 'inherit', 'inherit'],
        });

        const schemaStream = fs.createReadStream('database/init/01-schema.sql');
        schemaStream.pipe(schemaProcess.stdin);

        schemaProcess.on('close', (code) => {
          if (code === 0) {
            console.log('Schema applied successfully.');
            resolve(null);
          } else {
            reject(new Error(`Schema application failed with code ${code}`));
          }
        });
        schemaProcess.on('error', reject);
      });

      // Apply seed data
      await new Promise((resolve, reject) => {
        const seedProcess = spawn('docker-compose', [
          'exec',
          '-T',
          'mariadb',
          'mariadb',
          '-u',
          'finx_user',
          '-pfinx_password',
          'finx',
        ], {
          stdio: ['pipe', 'inherit', 'inherit'],
        });

        const seedStream = fs.createReadStream('database/init/02-seed-data.sql');
        seedStream.pipe(seedProcess.stdin);

        seedProcess.on('close', (code) => {
          if (code === 0) {
            console.log('Seed data applied successfully.');
            resolve(null);
          } else {
            reject(new Error(`Seed data application failed with code ${code}`));
          }
        });
        seedProcess.on('error', reject);
      });

      console.log('Database setup complete.');
    } catch (error) {
      console.error('Database setup failed:', error);
      process.exit(1);
    }
  }
}

// Run tests
const runner = new TestRunner();
runner.run();

