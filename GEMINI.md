# FinX - Financial AI Agent System

## Project Overview

FinX is a learning-focused financial AI agent system built with MCP (Model Context Protocol) servers. Its primary purpose is to help users understand investment concepts through hands-on market analysis. It integrates with Cursor IDE to provide a main MCP server:

*   **Market Data Server:** Provides real-time quotes, historical data, company research (fundamentals, financial ratios), and educational explanations of financial metrics.
*   **Financial News Server:** Provides financial news and sentiment analysis.


The system is designed with a "Learn by Doing" philosophy, acting as an educational platform to apply financial concepts to real data.

**Key Technologies:**
*   **Runtime:** Node.js 22.x LTS
*   **Package Manager:** pnpm 9.x
*   **Market Data:** Alpha Vantage + Yahoo Finance (fallback)
*   **Language:** TypeScript (inferred from `tsconfig.json` and file extensions)

## Building and Running

### Prerequisites

*   Node.js 22.x LTS or higher: *Runtime environment for the servers.*
*   pnpm 9.x or higher: *Package manager for monorepo dependency management.*
*   Alpha Vantage API key (free tier: [Get one here](https://www.alphavantage.co/support/#api-key)): *Required for fetching market data.*
*   Cursor IDE: *The integrated development environment that hosts the MCP servers.*

### Installation

1.  **Clone and install dependencies:** *Navigate to the project root and install all necessary packages for the monorepo.*
    ```bash
    cd finx
    pnpm install
    ```

2.  **Configure environment:** *Create your local environment file and populate it with necessary API keys.*
    ```bash
    cp env.example .env
    # IMPORTANT: Edit .env and add your Alpha Vantage API key.
    ```

3.  **Build the server:** *Compile the TypeScript source code for the Market Data server.*
    ```bash
    pnpm build
    ```

4.  **Configure MCP in Cursor:** *Integrate the FinX MCP server into your Cursor IDE by adding its configuration. **Ensure you replace `/absolute/path/to/finx` with the actual absolute path to your FinX project directory and set your `ALPHA_VANTAGE_API_KEY` as a system environment variable.** This step is crucial for Cursor to recognize and run the server.*

    ```json
    {
      "mcpServers": {
        "finx-market-data": {
          "command": "node",
          "args": [
            "/absolute/path/to/finx/mcp-market-data/dist/index.js"
          ]
        }
      }
    }
    ```

5.  **Restart Cursor** to load the MCP server. *A restart is required for Cursor to detect the new MCP server configuration.*

### Development

*   **Market Data Server (watch mode):**
    ```bash
    pnpm dev:market-data
    ```

## Testing

*   **Run all tests:**
    ```bash
    pnpm test
    ```
*   **Watch mode for tests:**
    ```bash
    pnpm test:watch
    ```
*   **Run tests with coverage:**
    ```bash
    pnpm test:coverage
    ```
*   **Run integration tests:**
    ```bash
    pnpm test:e2e
    ```

## Development Conventions

*   **Monorepo Structure:** *Managed by pnpm workspaces, this structure allows for separate but co-located development of `mcp-market-data`, facilitating shared dependencies and consistent tooling.*
*   **Language:** *TypeScript is used throughout the project to provide type safety and improve code maintainability.*
*   **Testing:** *`vitest` is used for fast unit and integration tests, while `tsx` handles end-to-end test execution, ensuring comprehensive test coverage.*
*   **Documentation:** *Extensive documentation in the `docs/` directory provides detailed information on usage, learning paths, and monorepo structure, aiding new contributors and users.*
*   **GitHub CLI (`gh`):** For all GitHub interactions (e.g., checking CI status, managing pull requests, issues), prefer using the `gh` command-line tool.
*   **Branching Strategy:** Always create a new branch for any changes, no matter how small. This ensures a clean history and facilitates code reviews.
*   **Pull Request Merging:** Always await explicit confirmation from the user before merging any pull requests.
*   **AI Agent Configuration:** *The `.cursor/` directory centralizes configurations for the AI agent, including prompts, knowledge base, concepts, and a journal, enabling consistent agent behavior and knowledge management.*

