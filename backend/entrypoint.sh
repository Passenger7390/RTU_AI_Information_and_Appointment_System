#!/bin/sh
# filepath: /home/jaycy/Documents/ad-system/backend/entrypoint.sh

# Wait for postgres to be ready
echo "Waiting for PostgreSQL to start..."
sleep 5

# Run database initialization
echo "Creating database tables..."
python createDb.py

# Start the application
echo "Starting application..."
exec gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000