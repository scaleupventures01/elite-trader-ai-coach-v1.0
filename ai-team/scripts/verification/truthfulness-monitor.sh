#!/bin/bash

# 🚨 TRUTHFULNESS MONITOR
# Real-time monitoring of AI agent claims and verification

echo "🚨 TRUTHFULNESS MONITOR STARTED"
echo "═══════════════════════════════════════"
echo ""
echo "Monitoring for false claims and unverified statements..."
echo "Press Ctrl+C to stop monitoring"
echo ""

# Create monitoring directory if it doesn't exist
mkdir -p .claude/state/agents

# Function to check for suspicious patterns
check_suspicious_patterns() {
    local text="$1"
    
    # Patterns that indicate potential false claims
    local patterns=(
        "all tests pass"
        "100% complete"
        "fully implemented"
        "working perfectly"
        "no errors"
        "completely done"
        "everything works"
        "100% coverage"
        "all features working"
        "sprint complete"
    )
    
    for pattern in "${patterns[@]}"; do
        if echo "$text" | grep -qi "$pattern"; then
            echo "⚠️  SUSPICIOUS PATTERN DETECTED: '$pattern'"
            echo "   Text: $text"
            echo "   Time: $(date)"
            echo ""
        fi
    done
}

# Function to check for verification evidence
check_verification_evidence() {
    local text="$1"
    
    # Evidence patterns that indicate verification
    local evidence_patterns=(
        "npm test"
        "actual output"
        "test results"
        "coverage report"
        "error message"
        "command output"
        "verification"
        "evidence"
        "proof"
    )
    
    local has_evidence=false
    for pattern in "${evidence_patterns[@]}"; do
        if echo "$text" | grep -qi "$pattern"; then
            has_evidence=true
            break
        fi
    done
    
    if ! $has_evidence; then
        echo "❌ NO VERIFICATION EVIDENCE FOUND"
        echo "   Text: $text"
        echo "   Time: $(date)"
        echo "   Recommendation: Run actual tests and show output"
        echo ""
    fi
}

# Function to monitor agent state files
monitor_agent_files() {
    echo "🔍 Monitoring agent state files..."
    
    # Watch for changes in agent state files
    inotifywait -m -e modify,create .claude/state/agents/ 2>/dev/null | while read path action file; do
        if [[ "$file" == *.json ]]; then
            echo "📝 Agent file changed: $file"
            
            # Read the file content
            if [ -f ".claude/state/agents/$file" ]; then
                content=$(cat ".claude/state/agents/$file")
                
                # Check for suspicious patterns
                check_suspicious_patterns "$content"
                
                # Check for verification evidence
                check_verification_evidence "$content"
            fi
        fi
    done
}

# Function to monitor log files
monitor_logs() {
    echo "📋 Monitoring log files..."
    
    # Watch for changes in log files
    inotifywait -m -e modify,create . 2>/dev/null | while read path action file; do
        if [[ "$file" == *.log ]] || [[ "$file" == *verification* ]] || [[ "$file" == *test* ]]; then
            echo "📝 Log file changed: $file"
            
            # Read the last few lines of the file
            if [ -f "$file" ]; then
                content=$(tail -10 "$file")
                
                # Check for suspicious patterns
                check_suspicious_patterns "$content"
                
                # Check for verification evidence
                check_verification_evidence "$content"
            fi
        fi
    done
}

# Function to monitor git commits
monitor_git_commits() {
    echo "🔧 Monitoring git commits..."
    
    # Check recent commits for suspicious patterns
    git log --oneline -10 | while read commit; do
        commit_hash=$(echo "$commit" | cut -d' ' -f1)
        commit_message=$(echo "$commit" | cut -d' ' -f2-)
        
        check_suspicious_patterns "$commit_message"
    done
}

# Function to check current verification status
check_current_status() {
    echo "📊 CURRENT VERIFICATION STATUS"
    echo "═══════════════════════════════════════"
    
    # Check if verification checklist has been run recently
    if [ -f "scripts/verification/quick-verification-checklist.js" ]; then
        echo "✅ Verification checklist available"
    else
        echo "❌ Verification checklist not found"
    fi
    
    # Check for recent test runs
    if [ -f "package.json" ]; then
        echo "✅ Package.json found - tests can be run"
    else
        echo "❌ Package.json not found"
    fi
    
    # Check for recent log files
    log_files=$(find . -name "*.log" -mtime -1 2>/dev/null | wc -l)
    if [ $log_files -gt 0 ]; then
        echo "✅ Recent log files found: $log_files"
    else
        echo "⚠️  No recent log files found"
    fi
    
    # Check for TODO/FIXME comments
    todo_count=$(grep -r "TODO\|FIXME\|BUG" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | wc -l)
    if [ $todo_count -gt 0 ]; then
        echo "⚠️  Found $todo_count TODO/FIXME items"
    else
        echo "✅ No TODO/FIXME items found"
    fi
    
    echo ""
}

# Main monitoring function
main_monitor() {
    echo "🚨 TRUTHFULNESS MONITOR ACTIVE"
    echo "═══════════════════════════════════════"
    echo ""
    
    # Initial status check
    check_current_status
    
    # Start monitoring in background
    monitor_agent_files &
    monitor_logs &
    
    # Monitor git commits periodically
    while true; do
        monitor_git_commits
        sleep 30
    done
}

# Trap Ctrl+C to clean up
trap 'echo ""; echo "🛑 Truthfulness monitor stopped"; exit 0' INT

# Start monitoring
main_monitor 