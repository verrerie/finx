#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# --- Configuration ---
# Database connection details (adjust if necessary)
DB_SERVICE="mariadb" # The service name in docker-compose.yml
DB_NAME="${DB_NAME:-finx}" # Default database name from docker-compose.yml
DB_USER="${DB_USER:-finx_user}" # Default user from docker-compose.yml
DB_PASSWORD="${DB_PASSWORD:-finx_password}" # Default password from docker-compose.yml

# Rclone configuration
RCLONE_REMOTE="w.yunbo"
RCLONE_DEST_PATH="/backups/finx-database" # A folder on Google Drive

# Backup file details
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOCAL_BACKUP_DIR="/tmp/finx-backups" # Use a temporary local directory
BACKUP_FILENAME="finx-mariadb-backup-${TIMESTAMP}.sql.gz"
LOCAL_BACKUP_PATH="${LOCAL_BACKUP_DIR}/${BACKUP_FILENAME}"

# --- Script ---
echo "Starting MariaDB database backup..."

# Ensure local backup directory exists
mkdir -p "${LOCAL_BACKUP_DIR}"

echo "Dumping database '${DB_NAME}' to '${LOCAL_BACKUP_PATH}'..."

# Use docker-compose exec to run mysqldump inside the container, compress it, and save to the local file
# We use -T to disable pseudo-tty allocation, which is good for scripts.
# We pass the password via environment variable for security and to avoid interactive prompts.
docker-compose exec -T -e MYSQL_PWD="${DB_PASSWORD}" "${DB_SERVICE}" /usr/bin/mariadb-dump -u "${DB_USER}" "${DB_NAME}" | gzip > "${LOCAL_BACKUP_PATH}"

echo "Database dump complete."
echo "Uploading backup to ${RCLONE_REMOTE}:${RCLONE_DEST_PATH}..."

# Use rclone to copy the backup file to the remote
rclone copy "${LOCAL_BACKUP_PATH}" "${RCLONE_REMOTE}:${RCLONE_DEST_PATH}"

echo "Upload complete."
echo "Cleaning up local backup file..."

# Remove the local backup file
rm "${LOCAL_BACKUP_PATH}"

echo "Backup process finished successfully."
