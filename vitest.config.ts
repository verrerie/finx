import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        dangerouslyIgnoreUnhandledErrors: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: [
                'node_modules/**',
                'dist/**',
                '**/*.d.ts',
                '**/*.config.ts',
                '**/test-*.ts',
                '.cursor/**',
                '.github/**',
                'mcp-portfolio/**', // Portfolio server has integration tests
                '**/index.ts', // MCP server entry points (integration tested)
                '**/types.ts', // Type definitions only
                '**/providers/**', // Providers tested via integration tests
                '**/tools/tool-definitions.ts', // Tool schemas (constants only)
            ],
            all: true,
            thresholds: {
                lines: 80,
                functions: 50,  // Lower due to test helper functions
                branches: 85,
                statements: 80,
            },
        },
    },
});

