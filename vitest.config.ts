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
            ],
            all: true,
            thresholds: {
                lines: 70,
                functions: 45,
                branches: 80,
                statements: 70,
            },
        },
    },
});

