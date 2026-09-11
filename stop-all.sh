#!/bin/bash

PROJECT_DIR="/home/gopala/loan-platform"

echo "======================================"
echo " Stopping Loan Platform Sandbox"
echo "======================================"

echo ""
echo "[1/3] Stopping frontend..."

if [ -f "$PROJECT_DIR/frontend.pid" ]; then
    PID=$(cat "$PROJECT_DIR/frontend.pid")
    kill "$PID" 2>/dev/null || true
    rm -f "$PROJECT_DIR/frontend.pid"
fi

# Make sure anything using port 5174 is stopped
fuser -k 5174/tcp 2>/dev/null || true

echo "Frontend stopped."

echo ""
echo "[2/3] Stopping backend..."

if [ -f "$PROJECT_DIR/backend.pid" ]; then
    PID=$(cat "$PROJECT_DIR/backend.pid")
    kill "$PID" 2>/dev/null || true
    rm -f "$PROJECT_DIR/backend.pid"
fi

# Make sure anything using port 8081 is stopped
fuser -k 8081/tcp 2>/dev/null || true

echo "Backend stopped."

echo ""
echo "[3/3] Stopping application Docker services..."

cd "$PROJECT_DIR"
docker compose stop postgres redis

echo ""
echo "======================================"
echo " Loan Platform Sandbox Stopped"
echo "======================================"
