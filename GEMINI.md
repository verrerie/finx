# FinX - Financial AI Agent System

## Project Overview

FinX is a learning-focused financial AI agent system built with MCP (Model Context Protocol) servers. Its primary purpose is to help users understand investment concepts through hands-on portfolio management and market analysis. It integrates with Cursor IDE to provide two main MCP servers:

*   **Market Data Server:** Provides real-time quotes, historical data, company research (fundamentals, financial ratios), and educational explanations of financial metrics.
*   **Portfolio Management Server:** Enables tracking investments, recording transactions, calculating performance, managing watchlists, documenting investment theses, and running what-if scenarios.

The system is designed with a "Learn by Doing" philosophy, acting as an educational platform to apply financial concepts to real data.

**Key Technologies:**
*   **Runtime:** Node.js 22.x LTS
*   **Package Manager:** pnpm 9.x
*   **Market Data:** Alpha Vantage + Yahoo Finance (fallback)
*   **Database:** MariaDB 11.8 (for portfolio data)
*   **Language:** TypeScript (inferred from `tsconfig.json` and file extensions)

## Building and Running

### Prerequisites

*   Node.js 22.x LTS or higher: *Runtime environment for the servers.*
*   pnpm 9.x or higher: *Package manager for monorepo dependency management.*
*   Docker and Docker Compose: *Used to run the MariaDB database in a containerized environment.*
*   Alpha Vantage API key (free tier: [Get one here](https://www.alphavantage.co/support/#api-key)): *Required for fetching market data.*
*   Cursor IDE: *The integrated development environment that hosts the MCP servers.*

### Installation

1.  **Clone and install dependencies:** *Navigate to the project root and install all necessary packages for the monorepo.*
    ```bash
    cd finx
    pnpm install
    ```

2.  **Configure environment:** *Create your local environment file and populate it with necessary API keys and database credentials.*
    ```bash
    cp env.example .env
    # IMPORTANT: Edit .env and add your Alpha Vantage API key and database credentials (if changing defaults).
    ```

3.  **Start the database:** *Launch the MariaDB database as a background service using Docker Compose.*
    ```bash
    docker compose up -d mariadb
    ```

4.  **Build all servers:** *Compile the TypeScript source code for both the Market Data and Portfolio servers.*
    ```bash
    pnpm build
    ```

5.  **Configure MCP in Cursor:** *Integrate the FinX MCP servers into your Cursor IDE by adding their configurations. **Ensure you replace `/absolute/path/to/finx` with the actual absolute path to your FinX project directory and `your_key_here` with your Alpha Vantage API key.** This step is crucial for Cursor to recognize and run the servers.*

    ```json
    {
      "mcpServers": {
        "finx-market-data": {
          "command": "node",
          "args": [
            "/absolute/path/to/finx/mcp-market-data/dist/index.js"
          ],
          "env": {
            "ALPHA_VANTAGE_API_KEY": "your_key_here"
          }
        },
        "finx-portfolio": {
          "command": "node",
          "args": [
            "/absolute/path/to/finx/mcp-portfolio/dist/index.js"
          ],
          "env": {
            "DB_HOST": "localhost",
            "DB_PORT": "3306",
            "DB_NAME": "finx",
            "DB_USER": "finx_user",
            "DB_PASSWORD": "finx_password"
          }
        }
      }
    }
    ```

6.  **Restart Cursor** to load the MCP servers. *A restart is required for Cursor to detect the new MCP server configurations.*

### Development

*   **Market Data Server (watch mode):**
    ```bash
    pnpm dev:market-data
    ```
*   **Portfolio Server (watch mode):**
    ```bash
    pnpm dev:portfolio
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
*   **Run end-to-end workflows:**
    ```bash
    pnpm test:e2e
    ```

## Development Conventions

*   **Monorepo Structure:** *Managed by pnpm workspaces, this structure allows for separate but co-located development of `mcp-market-data` and `mcp-portfolio`, facilitating shared dependencies and consistent tooling.*
*   **Language:** *TypeScript is used throughout the project to provide type safety and improve code maintainability.*
*   **Testing:** *`vitest` is used for fast unit and integration tests, while `tsx` handles end-to-end test execution, ensuring comprehensive test coverage.*
*   **Documentation:** *Extensive documentation in the `docs/` directory provides detailed information on usage, learning paths, monorepo structure, and database specifics, aiding new contributors and users.*
*   **AI Agent Configuration:** *The `.cursor/` directory centralizes configurations for the AI agent, including prompts, knowledge base, concepts, and a journal, enabling consistent agent behavior and knowledge management.*

