#!/bin/bash

# Function to cleanup background processes when the script is stopped
cleanup() {
    echo ""
    echo "🛑 Stopping Jewelry AI Studio..."
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    exit
}

# Trap Ctrl+C (SIGINT) to run the cleanup function
trap cleanup SIGINT

echo "=================================================="
echo "💎  JEWELRY AI STUDIO - STARTUP SCRIPT"
echo "=================================================="

# Get the absolute path of the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# 1. Check/Kill existing processes on ports 8000 (Backend) and 5173 (Frontend)
# This prevents "Address already in use" errors
echo "🧹 Cleaning up old processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

# 2. Start Backend
echo "⚙️  Starting Backend Server..."
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "❌ Error: Virtual environment 'venv' not found."
    exit 1
fi

# Run backend in background, log output to backend.log
python backend/main.py > backend.log 2>&1 &
BACKEND_PID=$!
echo "   ✅ Backend running (PID: $BACKEND_PID)"

# 3. Start Frontend
echo "🎨 Starting Frontend Interface..."
cd frontend

# Open the browser after a short delay to give Vite time to start
(sleep 3 && open http://localhost:5173) &

# Start Vite server
npm run dev

# The script will stay here until the user presses Ctrl+C
