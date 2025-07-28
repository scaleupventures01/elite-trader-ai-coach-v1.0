#!/bin/bash
set -e
echo "🚀 Setting up GitHub repositories for AI Team System"
read -p "Enter your GitHub username: " GITHUB_USER
echo "📦 Creating template repository..."
gh repo create ai-team-template --public --description "AI Multi-Team Development System Template" --clone=false || echo "Repo may already exist"
git remote add origin https://github.com/$GITHUB_USER/ai-team-template.git 2>/dev/null || git remote set-url origin https://github.com/$GITHUB_USER/ai-team-template.git
echo "✅ Setup started for $GITHUB_USER"

echo "📤 Pushing to GitHub..."
git push -u origin main --force

echo "🧠 Creating global learnings repository..."
mkdir -p ~/ai-team-learnings
cd ~/ai-team-learnings

mkdir -p patterns templates retrospectives successful-code metrics

cat > README.md << 'EOF'
# AI Team Global Learnings
This repository stores accumulated knowledge from all AI team projects.

## Structure
- patterns/ - Successful design patterns
- templates/ - Reusable code templates  
- retrospectives/ - Project summaries
- successful-code/ - Code that worked well
- metrics/ - Performance metrics
EOF

git init
git add .
git commit -m "Initialize global learnings repository"

gh repo create ai-team-learnings --public --description "Global learnings from AI team projects" --clone=false || echo "Repo may already exist"
git remote add origin https://github.com/$GITHUB_USER/ai-team-learnings.git 2>/dev/null || git remote set-url origin https://github.com/$GITHUB_USER/ai-team-learnings.git
git push -u origin main --force

cd -
echo "✅ GitHub setup complete!" 