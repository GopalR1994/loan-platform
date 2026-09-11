#!/bin/bash

PROJECT_DIR="/home/gopala/loan-platform"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "======================================"
echo " Starting Loan Platform Sandbox"
echo "======================================"

cd "$PROJECT_DIR" || exit 1

echo ""
echo "[1/4] Starting PostgreSQL and Redis..."

docker compose up -d postgres redis

echo "PostgreSQL and Redis are running."

echo ""
echo "[2/4] Starting Spring Boot backend..."

if curl -s --max-time 3 http://127.0.0.1:8081/actuator/health | grep -q '"status":"UP"'; then

    echo "Backend is already running and healthy."

else

    echo "Backend is not running. Starting backend..."

    fuser -k 8081/tcp 2>/dev/null || true

    cd "$BACKEND_DIR" || exit 1

    nohup env \
        JWT_SECRET='Vxk40Sc90eEIOh8956yUoRA4HtG6VECvwFD/D+wK/A/3u8If8LN/+eDOB0Ai59ve' \
        ADMIN_USERNAME='admin' \
        ADMIN_PASSWORD='Admin@123' \
        java -jar target/loan-platform-backend-0.0.1-SNAPSHOT.jar \
        > "$PROJECT_DIR/backend.log" 2>&1 &

    BACKEND_PID=$!

    echo "$BACKEND_PID" > "$PROJECT_DIR/backend.pid"

    echo "Backend started with PID: $BACKEND_PID"
    echo "Waiting for backend health..."

    BACKEND_READY=false

    for i in $(seq 1 60); do

        if curl -s --max-time 2 http://127.0.0.1:8081/actuator/health | grep -q '"status":"UP"'; then
            BACKEND_READY=true
            break
        fi

        echo -n "."

        sleep 1

    done

    echo ""

    if [ "$BACKEND_READY" = true ]; then

        echo "Backend is healthy."

    else

        echo "ERROR: Backend failed to start."
        echo ""
        echo "Last backend log:"
        echo "--------------------------------------"
        tail -n 40 "$PROJECT_DIR/backend.log"
        echo "--------------------------------------"

        exit 1

    fi

fi

echo ""
echo "[3/4] Starting React frontend..."

if ss -ltn | grep -q ':5174 '; then

    echo "Frontend is already running on port 5174."

else

    echo "Frontend is not running. Starting frontend..."

    fuser -k 5174/tcp 2>/dev/null || true

    cd "$FRONTEND_DIR" || exit 1

    nohup npm run dev -- --host 0.0.0.0 \
        > "$PROJECT_DIR/frontend.log" 2>&1 &

    FRONTEND_PID=$!

    echo "$FRONTEND_PID" > "$PROJECT_DIR/frontend.pid"

    echo "Frontend started with PID: $FRONTEND_PID"

    FRONTEND_READY=false

    for i in $(seq 1 20); do

        if ss -ltn | grep -q ':5174 '; then
            FRONTEND_READY=true
            break
        fi

        echo -n "."

        sleep 1

    done

    echo ""

    if [ "$FRONTEND_READY" = true ]; then

        echo "Frontend is running."

    else

        echo "ERROR: Frontend failed to start."
        echo ""
        echo "Last frontend log:"
        echo "--------------------------------------"
        tail -n 40 "$PROJECT_DIR/frontend.log"
        echo "--------------------------------------"

        exit 1

    fi

fi

echo ""
echo "[4/4] Final service status..."

echo ""
echo "======================================"
echo " Loan Platform Sandbox Started"
echo "======================================"

echo ""
echo "Frontend:"
echo "http://172.16.5.227:5174/"

echo ""
echo "Backend:"
echo "http://172.16.5.227:8081"

echo ""
echo "PostgreSQL:"
echo "localhost:5433"

echo ""
echo "Redis:"
echo "localhost:6380"

echo ""
echo "Backend log:"
echo "$PROJECT_DIR/backend.log"

echo ""
echo "Frontend log:"
echo "$PROJECT_DIR/frontend.log"

echo ""
echo "======================================"
echo " Ready for UI testing"
echo "======================================"