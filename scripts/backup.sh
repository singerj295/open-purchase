#!/bin/bash
# Open Purchase Backup Script
# Creates git bundle backup

BACKUP_DIR="/root/backups/open-purchase"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

cd ~/open-purchase

# Create git bundle (full repo backup)
git bundle create $BACKUP_DIR/repo.bundle --all

echo "✅ Backup complete!"
echo "📦 Bundle: $BACKUP_DIR/repo.bundle"
