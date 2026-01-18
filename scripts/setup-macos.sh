#!/bin/bash

# Setup script for macOS to increase file descriptor limits permanently

echo "🔧 Setting up macOS for optimal development performance..."

# Detect shell
SHELL_CONFIG=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_CONFIG="$HOME/.bash_profile"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
fi

if [ -z "$SHELL_CONFIG" ]; then
    echo "❌ Could not detect shell configuration file"
    exit 1
fi

echo "📝 Detected shell config: $SHELL_CONFIG"

# Check if ulimit is already set
if grep -q "ulimit -n" "$SHELL_CONFIG"; then
    echo "✅ File descriptor limit already configured in $SHELL_CONFIG"
else
    echo "" >> "$SHELL_CONFIG"
    echo "# Increase file descriptor limit for development (added by SimpleSST setup)" >> "$SHELL_CONFIG"
    echo "ulimit -n 10240" >> "$SHELL_CONFIG"
    echo "✅ Added file descriptor limit to $SHELL_CONFIG"
fi

# Apply immediately
ulimit -n 10240

echo ""
echo "✅ Setup complete!"
echo ""
echo "Current file descriptor limit: $(ulimit -n)"
echo ""
echo "📌 Note: The limit has been set for this session and will be permanent for new terminal sessions."
echo "   If you want to apply it to existing terminals, run: source $SHELL_CONFIG"
echo ""

