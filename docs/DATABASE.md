# Database Setup

FinX uses MariaDB to store portfolio data, transactions, and investment theses. This guide covers basic setup and management.

---

## Quick Start

### 1. Configure Environment

Copy the example environment file:
```bash
cp env.example .env
```

Edit `.env` and update database credentials (defaults work for local development):
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=finx
DB_USER=finx_user
DB_PASSWORD=your_secure_password_here
DB_ROOT_PASSWORD=your_secure_root_password_here
```

### 2. Start Database

Using Docker Compose:
```bash
docker compose up -d mariadb
```

### 3. Verify It's Running

```bash
docker compose ps
```

Check health:
```bash
docker compose exec mariadb healthcheck.sh --connect
```

---

## What's Stored

The database stores:
- **Portfolios** - Your investment portfolios
- **Holdings** - Current positions (quantity, cost basis)
- **Transactions** - Buy/sell history
- **Watchlists** - Stocks you're researching
- **Investment Theses** - Your documented reasoning
- **Portfolio Snapshots** - Historical performance data

---

## Backup & Restore

### Backup Database
```bash
docker compose exec mariadb mariadb-dump -u root -p finx > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
docker compose exec -T mariadb mariadb -u root -p finx < backup_20250126.sql
```

### Reset Database (⚠️ Deletes All Data)
```bash
docker compose down
docker volume rm finx-mariadb-data
docker compose up -d mariadb
```

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

### View Logs
```bash
docker compose logs -f mariadb
```

### Access Database CLI
```bash
docker compose exec mariadb mariadb -u finx_user -p finx
```

---

## For Developers

See [MONOREPO.md](./MONOREPO.md) for technical details about schema, migrations, and advanced management.

