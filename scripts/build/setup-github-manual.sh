#!/bin/bash
set -e

echo "🚀 Manual GitHub Setup for AI Team System"
echo "=========================================="
echo ""

read -p "Enter your GitHub username: " GITHUB_USER

echo ""
echo "📋 Step 1: Create GitHub Repositories"
echo "-------------------------------------"
echo "Please manually create these repositories on GitHub:"
echo ""
echo "1. Go to: https://github.com/new"
echo "2. Create repository: ai-team-template"
echo "   - Description: AI Multi-Team Development System Template"
echo "   - Make it Public"
echo "   - Don't initialize with README (we'll push our own)"
echo ""
echo "3. Create repository: ai-team-learnings"
echo "   - Description: Global learnings from AI team projects"
echo "   - Make it Public"
echo "   - Don't initialize with README (we'll push our own)"
echo ""

read -p "Press Enter when you've created both repositories..."

echo ""
echo "📤 Step 2: Setting up Git remotes and pushing code"
echo "--------------------------------------------------"

# Set up template repository
echo "Setting up ai-team-template repository..."
git remote add origin https://github.com/$GITHUB_USER/ai-team-template.git 2>/dev/null || git remote set-url origin https://github.com/$GITHUB_USER/ai-team-template.git
git push -u origin main --force

echo "✅ Template repository pushed to GitHub"

# Create and set up learnings repository
echo ""
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

git remote add origin https://github.com/$GITHUB_USER/ai-team-learnings.git 2>/dev/null || git remote set-url origin https://github.com/$GITHUB_USER/ai-team-learnings.git
git push -u origin main --force

cd -

echo ""
echo "✅ GitHub setup complete!"
echo ""
echo "🌐 Your repositories:"
echo "   Template: https://github.com/$GITHUB_USER/ai-team-template"
echo "   Learnings: https://github.com/$GITHUB_USER/ai-team-learnings"
echo ""
echo "🚀 Next steps:"
echo "   1. Add to ~/.bashrc or ~/.zshrc: export PATH=\$PATH:~/.local/bin"
echo "   2. Reload shell: source ~/.bashrc"
echo "   3. Create new projects: new-ai-project my-project"
echo "" 