# CI/CD Setup Guide

## Overview

This project uses GitHub Actions for continuous integration with the following features:
- Automated testing on every push and pull request
- TypeScript compilation checks
- Test coverage reporting via Codecov
- Node.js 22.x LTS

## GitHub Actions Workflow

The CI workflow (`.github/workflows/ci.yml`) runs automatically on:
- Push to `main` branch
- Pull requests targeting `main` branch

### Workflow Steps

1. **Checkout code** - Gets the latest code
2. **Install pnpm** - Uses pnpm 9.x for package management
3. **Setup Node.js** - Installs Node.js 22.x with dependency caching
4. **Install dependencies** - Runs `pnpm install --frozen-lockfile`
5. **TypeScript compilation** - Verifies code compiles without errors
6. **Linting** - Checks for TypeScript errors (non-blocking)
7. **Run tests** - Executes test suite with coverage
8. **Upload coverage** - Sends coverage report to Codecov

## Codecov Integration

### Initial Setup

1. **Sign up for Codecov**
   - Go to https://codecov.io
   - Sign in with your GitHub account
   - Add your repository

2. **Get Codecov Token**
   - Go to your repository settings on Codecov
   - Copy the repository upload token

3. **Add Token to GitHub Secrets**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `CODECOV_TOKEN`
   - Value: Paste your Codecov token
   - Click "Add secret"

### Coverage Configuration

Coverage settings are defined in:
- `vitest.config.ts` - Test coverage generation
- `codecov.yml` - Codecov reporting configuration

**Coverage Targets:**
- Overall project: 80% coverage
- Per-patch: 80% coverage
- Threshold: ±5% variance allowed

**Excluded from Coverage:**
- Test files (`test-*.ts`, `*.test.ts`)
- Configuration files (`*.config.ts`)
- Type definitions (`*.d.ts`)
- Build output (`dist/`)
- Node modules
- Cursor/GitHub directories

## Local Testing

### Run Tests
```bash
pnpm test
```

### Run Tests with Coverage
```bash
pnpm run test:coverage
```

Coverage reports are generated in `./coverage/`:
- `coverage/index.html` - HTML coverage report
- `coverage/coverage-final.json` - JSON report (used by Codecov)
- `coverage/lcov.info` - LCOV format

### View Coverage Locally
```bash
# After running test:coverage
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
```

### Run Linter
```bash
pnpm run lint
```

### TypeScript Compilation Check
```bash
pnpm run build:market-data
```

## CI Status Badge

Add this badge to your README.md to show CI status:

```markdown
![CI](https://github.com/verrerie/finx/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/verrerie/finx/branch/main/graph/badge.svg)](https://codecov.io/gh/verrerie/finx)
```

## Troubleshooting

### CI Fails on `pnpm install`
- Ensure `pnpm-lock.yaml` is committed
- Verify `package.json` dependencies are correct
- Check Node.js version matches `engines` field

### Coverage Upload Fails
- Verify `CODECOV_TOKEN` is set in GitHub Secrets
- Check Codecov token is valid
- Ensure coverage files are generated before upload

### Tests Fail in CI but Pass Locally
- Check for environment-specific issues
- Verify API keys are not hardcoded (use environment variables)
- Ensure tests don't depend on local state

## Adding More Tests

To add new tests:

1. Create `*.test.ts` files alongside source files
2. Use Vitest test syntax
3. Run locally with `pnpm test`
4. Coverage will automatically include new files

Example test structure:
```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from './your-module.js';

describe('YourModule', () => {
    it('should do something', () => {
        expect(yourFunction()).toBe(expected);
    });
});
```

## Future Enhancements

- [ ] Add ESLint for code style checking
- [ ] Add Prettier for code formatting
- [ ] Add pre-commit hooks with Husky
- [ ] Add integration tests
- [ ] Add performance benchmarks
- [ ] Add security scanning (Snyk/Dependabot)

