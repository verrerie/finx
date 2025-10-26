# Database Setup and Management

## Overview

FinX uses MariaDB 11.8 to store portfolio data, transactions, and investment theses. This guide covers setup, schema, and management.

---

## Quick Start

### 1. Setup Environment

Copy the example environment file and configure your database credentials:

```bash
cp env.example .env
```

Edit `.env` and update the database section:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=finx
DB_USER=finx_user
DB_PASSWORD=your_secure_password_here
DB_ROOT_PASSWORD=your_secure_root_password_here
```

### 2. Start MariaDB

Using Docker Compose:

```bash
docker compose up -d mariadb
```

### 3. Verify Connection

Check that MariaDB is running:

```bash
docker compose ps
```

Check health:

```bash
docker compose exec mariadb healthcheck.sh --connect
```

### 4. Access Database

```bash
docker compose exec mariadb mysql -u finx_user -p finx
```

---

## Database Schema

### Tables

#### Core Tables

1. **`portfolios`** - Portfolio metadata
   - Stores portfolio name, description, base currency
   - Each user can have multiple portfolios

2. **`holdings`** - Current positions
   - Tracks quantity and average cost basis
   - Automatically updated by transactions
   - Unique constraint on (portfolio_id, symbol)

3. **`transactions`** - Transaction history
   - All buy/sell/dividend/split events
   - Immutable audit trail
   - Linked to portfolio and holdings

4. **`watchlists`** - Stocks to monitor
   - Research candidates
   - Target prices and priority levels

5. **`investment_theses`** - Investment reasoning
   - Bull/bear cases for each position
   - Review dates and status tracking
   - Links investment ideas to holdings

6. **`portfolio_snapshots`** - Daily values
   - Performance tracking over time
   - Total value, cost basis, cash balance
   - Used for return calculations

#### Supporting Tables

7. **`tags`** - Categorization labels
   - Predefined tags (growth, value, dividend, etc.)
   - Custom colors for visualization

8. **`holding_tags`** - Tag assignments
   - Many-to-many relationship
   - Associate holdings with multiple tags

9. **`schema_migrations`** - Version tracking
   - Tracks applied migrations
   - Ensures database consistency

### Views

1. **`portfolio_summary`**
   - Aggregated portfolio metrics
   - Holding count and total cost

2. **`holding_details`**
   - Enriched holding information
   - Joins holdings with portfolio names

### Stored Procedures

1. **`add_transaction`**
   - Atomically adds transaction and updates holdings
   - Calculates new average cost basis
   - Handles buys, sells, and transfers

---

## Schema Details

### Entity Relationships

```
portfolios (1) --> (*) holdings
portfolios (1) --> (*) transactions
portfolios (1) --> (*) watchlists
portfolios (1) --> (*) investment_theses
portfolios (1) --> (*) portfolio_snapshots

holdings (*) --> (*) tags (through holding_tags)
```

### Key Fields

#### portfolios
- `id` (UUID, PK)
- `name` (VARCHAR, unique per user)
- `currency` (VARCHAR(3), default 'USD')

#### holdings
- `id` (UUID, PK)
- `portfolio_id` (UUID, FK)
- `symbol` (VARCHAR(20))
- `quantity` (DECIMAL(18,8))
- `average_cost` (DECIMAL(18,4))
- Unique: (portfolio_id, symbol)

#### transactions
- `id` (UUID, PK)
- `portfolio_id` (UUID, FK)
- `symbol` (VARCHAR(20))
- `type` (ENUM: BUY, SELL, DIVIDEND, SPLIT, TRANSFER_IN, TRANSFER_OUT)
- `quantity` (DECIMAL(18,8))
- `price` (DECIMAL(18,4))
- `fees` (DECIMAL(18,4))
- `transaction_date` (DATE)

---

## Management

### Backup Database

```bash
# Backup all data
docker compose exec mariadb mysqldump -u root -p finx > backup_$(date +%Y%m%d).sql

# Backup schema only
docker compose exec mariadb mysqldump -u root -p --no-data finx > schema_$(date +%Y%m%d).sql
```

### Restore Database

```bash
docker compose exec -T mariadb mysql -u root -p finx < backup_20250126.sql
```

### Reset Database

**Warning: This will delete ALL data!**

```bash
# Stop containers
docker compose down

# Remove volume
docker volume rm finx-mariadb-data

# Restart (will recreate fresh database)
docker compose up -d mariadb
```

### View Logs

```bash
docker compose logs -f mariadb
```

---

## Migrations

### Migration Files

Migrations are stored in `database/migrations/` and follow this naming convention:

```
YYYYMMDDHHMMSS_description.sql
```

Example:
```
20250126120000_add_watchlist_alerts.sql
```

### Creating a Migration

1. Create new file in `database/migrations/`:

```sql
-- Migration: Add watchlist alerts
-- Version: 20250126120000

USE finx;

ALTER TABLE watchlists
ADD COLUMN alert_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN alert_price DECIMAL(18, 4);

-- Record migration
INSERT INTO schema_migrations (version, description)
VALUES ('20250126120000', 'Add watchlist price alerts');
```

2. Apply migration:

```bash
docker compose exec -T mariadb mysql -u root -p finx < database/migrations/20250126120000_add_watchlist_alerts.sql
```

### Migration Best Practices

1. **Always test migrations** on a backup first
2. **Include rollback procedures** in comments
3. **Update schema_migrations table**
4. **Use transactions** where possible
5. **Document breaking changes**

---

## Development

### Seed Data

The initialization includes optional seed data:
- Example portfolio
- Common tags (growth, value, dividend, etc.)
- Sample watchlist items

To disable seed data, edit `docker-compose.yml` or set in `.env`:

```bash
LOAD_SEED_DATA=false
```

### Accessing MariaDB CLI

```bash
# As finx_user
docker compose exec mariadb mysql -u finx_user -p finx

# As root
docker compose exec mariadb mysql -u root -p finx
```

### Useful Queries

**List all portfolios:**
```sql
SELECT * FROM portfolio_summary;
```

**Get holdings for a portfolio:**
```sql
SELECT * FROM holding_details WHERE portfolio_id = 'your-portfolio-id';
```

**Transaction history for a symbol:**
```sql
SELECT * FROM transactions
WHERE symbol = 'AAPL'
ORDER BY transaction_date DESC;
```

**Calculate portfolio performance:**
```sql
SELECT 
    p.name,
    SUM(h.quantity * h.average_cost) as total_cost,
    COUNT(DISTINCT h.symbol) as positions
FROM portfolios p
LEFT JOIN holdings h ON p.id = h.portfolio_id
WHERE p.id = 'your-portfolio-id'
GROUP BY p.name;
```

---

## Performance

### Indexes

The schema includes indexes on:
- Foreign keys
- Date fields (for time-series queries)
- Symbol lookups
- Portfolio queries

### Connection Pooling

Configure in `.env`:

```bash
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0
```

### Query Optimization

1. Use views for common queries
2. Leverage indexes for WHERE clauses
3. Batch inserts when possible
4. Use transactions for atomic operations

---

## Security

### Credentials

- Never commit `.env` to git
- Use strong passwords in production
- Rotate credentials regularly
- Use separate users for different access levels

### Network Security

For production:
1. Don't expose port 3306 externally
2. Use Docker networks for inter-service communication
3. Enable SSL/TLS for connections
4. Implement firewall rules

### Data Protection

1. Regular backups (daily recommended)
2. Encrypt backups
3. Test restore procedures
4. Implement audit logging

---

## Troubleshooting

### Cannot Connect

```bash
# Check if container is running
docker compose ps

# Check logs
docker compose logs mariadb

# Verify credentials in .env
cat .env | grep DB_
```

### Permissions Issues

```bash
# Reset user permissions
docker compose exec mariadb mysql -u root -p

GRANT ALL PRIVILEGES ON finx.* TO 'finx_user'@'%';
FLUSH PRIVILEGES;
```

### Slow Queries

```bash
# Enable slow query log
docker compose exec mariadb mysql -u root -p

SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

### Disk Space

```bash
# Check volume size
docker system df -v

# Clean up old data
docker compose exec mariadb mysql -u root -p finx

# Example: Remove old snapshots
DELETE FROM portfolio_snapshots
WHERE snapshot_date < DATE_SUB(NOW(), INTERVAL 2 YEAR);
```

---

## Next Steps

1. **Start the database**: `docker compose up -d mariadb`
2. **Build Portfolio MCP Server**: See `docs/PORTFOLIO_MCP.md` (coming next)
3. **Connect from application**: Use credentials from `.env`

---

## References

- [MariaDB 11.8 Documentation](https://mariadb.com/kb/en/documentation/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [SQL Best Practices](https://mariadb.com/kb/en/optimization/)

