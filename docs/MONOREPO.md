# Monorepo Structure

FinX uses a **pnpm workspace** monorepo structure for managing multiple MCP servers as independent packages.

## Overview

This project is organized as a monorepo with the following structure:

```
finx/
├── package.json              # Root workspace configuration
├── pnpm-workspace.yaml       # Workspace definition
├── mcp-market-data/          # Market Data MCP Server (workspace package)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
├── mcp-portfolio/            # Portfolio MCP Server (workspace package)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
├── test-market-data.ts       # Integration tests
├── test-portfolio.ts         # Integration tests
└── docs/                     # Shared documentation
```

## Workspace Packages

### 1. @finx/mcp-market-data
**Market Data MCP Server**
- Stock quotes and historical data
- Company fundamentals
- Financial metrics education
- Dependencies: Alpha Vantage, Yahoo Finance

### 2. @finx/mcp-portfolio
**Portfolio Management MCP Server**
- Portfolio tracking
- Transaction recording
- Performance calculation
- Dependencies: MariaDB

## Benefits of Monorepo

✅ **Independent Versioning**: Each server can be versioned independently  
✅ **Isolated Dependencies**: Each package manages its own dependencies  
✅ **Code Sharing**: Easy to share types and utilities across packages  
✅ **Consistent Tooling**: Shared dev dependencies at root (TypeScript, Vitest, etc.)  
✅ **Single CI/CD**: One pipeline for all packages  
✅ **Better Modularity**: Clear boundaries between services  

## Working with the Monorepo

### Installation

Install all dependencies for all packages:

```bash
pnpm install
```

This automatically:
1. Installs root dev dependencies
2. Installs dependencies for each workspace package
3. Links workspace packages together

### Building

Build all packages:
```bash
pnpm build
```

Build specific package:
```bash
pnpm build:market-data
pnpm build:portfolio
```

### Development

Run a server in development mode (with hot reload):
```bash
pnpm dev:market-data
pnpm dev:portfolio
```

### Testing

Run all unit tests:
```bash
pnpm test
```

Run integration tests:
```bash
pnpm test:market-data    # Test market data server
pnpm test:portfolio      # Test portfolio server
```

Run tests with coverage:
```bash
pnpm test:coverage
```

### Linting

Lint all packages:
```bash
pnpm lint
```

This runs `tsc --noEmit` in each workspace package.

### Cleaning

Remove all build artifacts and node_modules:
```bash
pnpm clean
```

## Workspace Commands

pnpm provides powerful workspace commands:

### Run command in specific workspace:
```bash
pnpm --filter @finx/mcp-market-data <command>
pnpm --filter @finx/mcp-portfolio <command>
```

### Run command in all workspaces:
```bash
pnpm --recursive <command>
```

### Add dependency to specific workspace:
```bash
pnpm --filter @finx/mcp-market-data add axios
pnpm --filter @finx/mcp-portfolio add moment
```

### Add dev dependency to root:
```bash
pnpm add -D -w eslint
```

## Package Structure

Each workspace package follows this structure:

```
mcp-{name}/
├── package.json          # Package metadata and dependencies
├── tsconfig.json         # TypeScript config (extends root)
├── src/
│   ├── index.ts          # Server entry point
│   ├── config.ts         # Configuration
│   ├── types.ts          # TypeScript types
│   ├── database/         # Data layer (if applicable)
│   ├── services/         # Business logic
│   └── tools/            # MCP tool definitions
└── dist/                 # Build output (gitignored)
```

## Dependency Management

### Root Dependencies (Shared)
Located in root `package.json`:
- **Dev Dependencies**: TypeScript, Vitest, TSX, etc.
- **Purpose**: Shared tooling across all packages

### Package Dependencies (Isolated)
Located in each `mcp-{name}/package.json`:
- **Runtime Dependencies**: Package-specific dependencies
- **Example**: 
  - Market Data: `alphavantage`, `yahoo-finance2`
  - Portfolio: `mariadb`

## Adding a New Workspace Package

1. **Create package directory:**
   ```bash
   mkdir mcp-{name}
   ```

2. **Create `package.json`:**
   ```json
   {
     "name": "@finx/mcp-{name}",
     "version": "0.1.0",
     "description": "Description",
     "type": "module",
     "main": "dist/index.js",
     "scripts": {
       "build": "tsc",
       "dev": "tsx watch src/index.ts",
       "lint": "tsc --noEmit"
     }
   }
   ```

3. **Create `tsconfig.json`:**
   ```json
   {
     "extends": "../tsconfig.json",
     "compilerOptions": {
       "outDir": "./dist",
       "rootDir": "./src"
     }
   }
   ```

4. **Update workspace list** in `pnpm-workspace.yaml`:
   ```yaml
   packages:
     - 'mcp-market-data'
     - 'mcp-portfolio'
     - 'mcp-{name}'
   ```

5. **Run install:**
   ```bash
   pnpm install
   ```

## CI/CD Integration

The monorepo works seamlessly with GitHub Actions:

```yaml
- name: Install dependencies
  run: pnpm install

- name: Build all packages
  run: pnpm build

- name: Lint all packages
  run: pnpm lint

- name: Run tests
  run: pnpm test:coverage
```

## Best Practices

### ✅ DO

- Keep shared dev dependencies at root
- Keep package-specific dependencies in package `package.json`
- Use workspace protocol for internal dependencies: `"@finx/mcp-market-data": "workspace:*"`
- Version packages independently
- Use `pnpm --filter` for package-specific operations
- Document package purposes in their respective READMEs

### ❌ DON'T

- Install duplicate dependencies across packages
- Tightly couple packages (prefer loose coupling)
- Commit `node_modules/` or `dist/` directories
- Use relative paths between packages (use workspace names)
- Mix runtime and dev dependencies

## Troubleshooting

### Issue: Dependencies not found
**Solution**: Run `pnpm install` at root

### Issue: Build fails for one package
**Solution**: Build specific package: `pnpm --filter @finx/mcp-{name} build`

### Issue: TypeScript errors across packages
**Solution**: Ensure all `tsconfig.json` files extend root config

### Issue: pnpm commands not working
**Solution**: 
1. Check `pnpm-workspace.yaml` is present
2. Verify package names in `package.json` match
3. Run `pnpm install` to refresh workspace links

## References

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Monorepo Best Practices](https://monorepo.tools/)

---

**Related Documentation:**
- [README.md](../README.md) - Project overview
- [DATABASE.md](./DATABASE.md) - Database setup
- [LEARNING.md](./LEARNING.md) - Learning guide

