#!/bin/bash

# Docker run script for Question Tool
# Usage: ./docker-run.sh [regular|demo|both]

MODE=${1:-both}

case $MODE in
  "regular")
    echo "Starting regular mode..."
    docker-compose up question-tool
    ;;
  "demo")
    echo "Starting demo-only mode..."
    docker-compose up question-tool-demo
    ;;
  "both")
    echo "Starting both regular and demo modes..."
    docker-compose up
    ;;
  *)
    echo "Usage: $0 [regular|demo|both]"
    echo "  regular - Start only the regular version on port 3000"
    echo "  demo    - Start only the demo version on port 3001"
    echo "  both    - Start both versions (default)"
    exit 1
    ;;
esac
