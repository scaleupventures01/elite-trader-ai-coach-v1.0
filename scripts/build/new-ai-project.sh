#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: new-ai-project.sh <project-name>"
    exit 1
fi

PROJECT_NAME=$1
GITHUB_USER=$(git config user.name)
TEMPLATE_REPO="https://github.com/$GITHUB_USER/ai-team-template"
LEARNINGS_DIR=~/ai-team-learnings

echo "🚀 Creating new AI team project: $PROJECT_NAME"

git clone $TEMPLATE_REPO $PROJECT_NAME
cd $PROJECT_NAME
rm -rf .git
git init

ln -s $LEARNINGS_DIR .global-knowledge
echo "AI_TEAM_KNOWLEDGE=$LEARNINGS_DIR" > .env

npm install
npm run init-teams

git add .
git commit -m "Initialize $PROJECT_NAME from AI team template"

echo "✅ Project $PROJECT_NAME created!" 