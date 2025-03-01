#!/bin/bash

# Define Variables
SERVER="root@ssh.xilyor.com"
PORT="49234"
REMOTE_DIR="/var/www/api-modasync.xilyor.com"
SSH_PASSWORD=J71Hs5pg3CSe34FnAi
DB_FILE=database.sqlite


echo "📤 Copying $DB_FILE from the server the the local computer..."

# Use SSH password stored in variable
sshpass -p $SSH_PASSWORD scp -P "$PORT" "$SERVER:$REMOTE_DIR/$DB_FILE" "../database/$DB_FILE"

# Check if SCP was successful
if [ $? -eq 0 ]; then
echo "✅ Successfully copied $DB_FILE!"
else
echo "❌ Error: Failed to copy $DB_FILE. Aborting deployment!"
exit 1
fi