#!/bin/bash

# Navigate to the project root directory (where this script is)
# This ensures consistent relative paths for virtual env and src
PROJECT_ROOT=$(dirname "$0")
cd "$PROJECT_ROOT"

echo "Current working directory: $(pwd)"

# Activate the virtual environment
# Adjust this path if your .venv is not directly in the project root
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
    echo "Virtual environment activated."
else
    echo "Error: Virtual environment not found. Please ensure .venv exists and is set up correctly."
    exit 1
fi

# Set your Gemini API Key
# IMPORTANT: Replace "YOUR_GEMINI_API_KEY_HERE" with your actual key
export GEMINI_API_KEY="AIzaSyAVblKSK0JxIl3A_eQ_hGbQtUrUIP6lMHQ"
echo "AIzaSyAVblKSK0JxIl3A_eQ_hGbQtUrUIP6lMHQ set."

# Set PYTHONPATH to include the project root, so Python can find 'src' as a top-level package
# This is crucial for 'python -m src.backend.app' to work
export PYTHONPATH=$(pwd)
echo "PYTHONPATH set to: $PYTHONPATH"

# Run the Flask application as a module
echo "Starting Flask backend..."
python -m src.backend.app

# Deactivate virtual environment when script finishes (optional, but good practice)
# deactivate
