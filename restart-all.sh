#!/bin/bash

PROJECT_DIR="/home/gopala/loan-platform"

echo "======================================"
echo " Restarting Loan Platform Sandbox"
echo "======================================"

echo ""
echo "[1/2] Stopping current services..."

"$PROJECT_DIR/stop-all.sh"

echo ""
echo "Waiting for ports to be released..."
sleep 3

echo ""
echo "[2/2] Starting all services..."

"$PROJECT_DIR/start-all.sh"
