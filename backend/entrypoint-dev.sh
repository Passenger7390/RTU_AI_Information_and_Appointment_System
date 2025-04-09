#!/bin/sh
# filepath: /home/jaycy/Documents/ad-system/backend/entrypoint.sh

# Wait for postgres to be ready
echo "Waiting for PostgreSQL to start..."
# Use Python to check PostgreSQL availability
python - <<EOF
import socket
import time
import sys

def check_postgres():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.connect(('postgres', 5432))
        s.close()
        return True
    except socket.error:
        s.close()
        return False

# Loop until PostgreSQL is available
attempts = 0
while not check_postgres():
    attempts += 1
    print(f"PostgreSQL is unavailable - sleeping (attempt {attempts})")
    time.sleep(1)
    if attempts > 30:  # Timeout after 30 seconds
        print("PostgreSQL connection timed out")
        sys.exit(1)
EOF

echo "PostgreSQL is up - continuing"

# Run database initialization
# echo "Creating database tables..."
# python createDb.py

echo "Running database migrations..."
alembic upgrade head

# Start the application
echo "Starting application..."
exec uvicorn main:app --reload --host 0.0.0.0 --port 8000