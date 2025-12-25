#!/bin/bash

echo "Starting Plants vs Zombies Web Server..."
echo "Open your browser to: http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

# Try Python 3 first, then Python 2
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
else
    echo "Error: Python is not installed. Please install Python to run the server."
    exit 1
fi
