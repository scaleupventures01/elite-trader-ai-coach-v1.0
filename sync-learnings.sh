#!/bin/bash
set -e

LEARNINGS_DIR=~/ai-team-learnings
PROJECT_NAME=$(basename $(pwd))
DATE=$(date +%Y%m%d_%H%M%S)

echo "🔄 Syncing learnings to global repository..."

if [ ! -d "$LEARNINGS_DIR" ]; then
    echo "❌ Global learnings directory not found. Run setup-github.sh first."
    exit 1
fi

if [ -d "docs/lessons-learned" ]; then
    cp -r docs/lessons-learned/* $LEARNINGS_DIR/retrospectives/ 2>/dev/null || true
    echo "✅ Synced lessons learned"
fi

if [ -d ".memory-store" ]; then
    mkdir -p $LEARNINGS_DIR/patterns/$PROJECT_NAME
    cp -r .memory-store/* $LEARNINGS_DIR/patterns/$PROJECT_NAME/ 2>/dev/null || true
    echo "✅ Synced memory patterns"
fi

cd $LEARNINGS_DIR
git add .
git commit -m "Add learnings from $PROJECT_NAME - $DATE" || echo "No new learnings"
git push origin main
cd -
echo "✅ Learnings synced!" 