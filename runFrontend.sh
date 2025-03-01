#!/bin/bash

echo "Starting frontend server..."
cd frontend/
pnpm build
pnpm preview --host 0.0.0.0 --port 3000