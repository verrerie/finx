# Database Files

This directory contains database initialization scripts and migrations for FinX.

## Directory Structure

```
database/
├── init/           # Initialization scripts (run once at container creation)
│   ├── 01-schema.sql         # Database schema
│   └── 02-seed-data.sql      # Optional seed data
├── migrations/     # Schema migrations (applied incrementally)
│   └── (empty - migrations added as needed)
└── README.md       # This file
```

## Initialization Scripts

Files in `init/` are executed **once** when the MariaDB container is first created, in alphanumeric order:

1. **`01-schema.sql`** - Creates tables, views, stored procedures
2. **`02-seed-data.sql`** - Loads example data (optional, for development)

These scripts are mounted to `/docker-entrypoint-initdb.d` in the container.

### Schema Overview

- **9 tables**: portfolios, holdings, transactions, watchlists, investment_theses, portfolio_snapshots, tags, holding_tags, schema_migrations
- **2 views**: portfolio_summary, holding_details
- **1 stored procedure**: add_transaction (atomic transaction + holding update)

### Seed Data

Includes:
- Example portfolio ("Main Portfolio")
- 5 watchlist items (AAPL, MSFT, GOOGL, NVDA, BRK.B)
- 19 predefined tags (growth, value, dividend, tech, etc.)

## Migrations

The `migrations/` directory contains schema evolution scripts applied after initial setup.

### Naming Convention

```
YYYYMMDDHHMMSS_description.sql
```

Examples:
- `20250126120000_add_watchlist_alerts.sql`
- `20250127093000_add_portfolio_notes.sql`

### Creating a Migration

1. Create file with timestamp and descriptive name
2. Write SQL changes
3. Record in `schema_migrations` table
4. Test on backup first!

Example:

```sql
-- Migration: Add portfolio notes
-- Version: 20250127093000

USE finx;

ALTER TABLE portfolios
ADD COLUMN notes TEXT AFTER description;

INSERT INTO schema_migrations (version, description)
VALUES ('20250127093000', 'Add portfolio notes field');
```

### Applying Migrations

```bash
# Apply a specific migration
docker compose exec -T mariadb mysql -u root -p finx < database/migrations/20250127093000_add_portfolio_notes.sql

# Or connect and run manually
docker compose exec mariadb mysql -u root -p finx
source /migrations/20250127093000_add_portfolio_notes.sql;
```

## Volume Mounting

The `docker-compose.yml` mounts these directories:

- `./database/init:/docker-entrypoint-initdb.d:ro` - Initialization (read-only)
- `./database/migrations:/migrations:ro` - Migrations (read-only)

## Usage

### First Time Setup

1. Start the database:
   ```bash
   docker compose up -d mariadb
   ```

2. Initialization scripts run automatically

3. Verify:
   ```bash
   docker compose exec mariadb mysql -u finx_user -p finx -e "SHOW TABLES;"
   ```

### Reset Database

**Warning: Deletes all data!**

```bash
docker compose down
docker volume rm finx-mariadb-data
docker compose up -d mariadb
```

### Disable Seed Data

To start with empty tables, comment out or delete `02-seed-data.sql`.

## Best Practices

1. **Never modify init scripts after first run** - they only execute once
2. **Use migrations for schema changes** after initial setup
3. **Test on backup first** before applying to production
4. **Document rollback procedures** in migration comments
5. **Backup before migrations**: `docker compose exec mariadb mysqldump -u root -p finx > backup.sql`

## See Also

- [docs/DATABASE.md](../docs/DATABASE.md) - Full database documentation
- [docker-compose.yml](../docker-compose.yml) - Container configuration
- [env.example](../env.example) - Environment configuration

## Troubleshooting

### Scripts Not Running

Initialization scripts only run when the data volume is empty. To rerun:

```bash
docker compose down
docker volume rm finx-mariadb-data
docker compose up -d mariadb
```

### SQL Errors

Check logs:

```bash
docker compose logs mariadb
```

### Permission Denied

Ensure files are readable:

```bash
chmod +r database/init/*.sql
chmod +r database/migrations/*.sql
```

