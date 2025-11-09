import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        dangerouslyIgnoreUnhandledErrors: true,
        exclude: [
            'node_modules/**',
            'dist/**',
            '**/*.d.ts',
        ],
        onConsoleLog: (log) => {
            if (log.includes('Please consider completing the survey') || log.includes('[Deprecated] historical()')) {
                return false;
            }
        },
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
                '**/index.ts', // MCP server entry points (integration tested)
                '**/types.ts', // Type definitions only
                '**/providers/**', // Providers tested via integration tests
                '**/tools/tool-definitions.ts', // Tool schemas (constants only)
                '**/eslint.config.js',
            ],
            thresholds: {
                lines: 95,
                functions: 90,
                branches: 90,
                statements: 95,
            },
        },
    },
});

