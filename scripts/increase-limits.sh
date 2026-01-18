#!/bin/bash

# Increase file descriptor limits for macOS
echo "Current file descriptor limit: $(ulimit -n)"

# Try to increase the limit
ulimit -n 10240

echo "New file descriptor limit: $(ulimit -n)"

# Execute the command passed as arguments
exec "$@"

