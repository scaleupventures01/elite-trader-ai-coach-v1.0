#!/bin/bash

# 🚨 AI TEAM VERIFICATION SCRIPT
# This script MUST be run before any completion claims
# It provides actual, verifiable evidence

set -e  # Exit on any error

echo "🔍 AI TEAM VERIFICATION CHECK"
echo "=============================="
echo "Date: $(date)"
echo "User: $(whoami)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Function to run command and capture output
run_command() {
    local cmd="$1"
    local description="$2"
    
    echo "📋 $description"
    echo "Command: $cmd"
    echo "Output:"
    echo "----------------------------------------"
    
    if eval "$cmd" 2>&1; then
        print_status 0 "$description - SUCCESS"
    else
        print_status 1 "$description - FAILED"
        return 1
    fi
    
    echo "----------------------------------------"
    echo ""
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

echo "🎯 VERIFICATION PHASE 1: CODE QUALITY"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERROR: package.json not found. Are you in the project root?${NC}"
    exit 1
fi

# Check dependencies
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    print_status 0 "Dependencies installed"
else
    print_status 1 "Dependencies not installed - run npm install"
    exit 1
fi

# Run linting
echo "🔍 Running linting..."
if npm run lint > /dev/null 2>&1; then
    print_status 0 "Linting passed"
else
    print_status 1 "Linting failed"
    echo "Lint output:"
    npm run lint
fi

echo ""
echo "🎯 VERIFICATION PHASE 2: BUILD PROCESS"
echo "======================================"

# Check if build script exists
if grep -q '"build"' package.json; then
    echo "🔨 Running build process..."
    if npm run build > /dev/null 2>&1; then
        print_status 0 "Build successful"
    else
        print_status 1 "Build failed"
        echo "Build output:"
        npm run build
    fi
else
    echo -e "${YELLOW}⚠️ No build script found in package.json${NC}"
fi

echo ""
echo "🎯 VERIFICATION PHASE 3: TESTING"
echo "================================"

# Run tests
echo "🧪 Running tests..."
if npm test > /dev/null 2>&1; then
    print_status 0 "Tests passed"
else
    print_status 1 "Tests failed"
    echo "Test output:"
    npm test
fi

echo ""
echo "🎯 VERIFICATION PHASE 4: RUNTIME VERIFICATION"
echo "============================================="

# Check if trading journal server exists
if [ -f "src/backend/api/trading-journal-working.js" ]; then
    echo "🚀 Testing trading journal server..."
    
    # Start server in background
    echo "Starting server..."
    node src/backend/api/trading-journal-working.js > server.log 2>&1 &
    SERVER_PID=$!
    
    # Wait for server to start
    echo "Waiting for server to start..."
    sleep 5
    
    # Check if server is running
    if check_port 3000; then
        print_status 0 "Server started successfully"
        
        # Test health endpoint
        echo "💓 Testing health endpoint..."
        if curl -s http://localhost:3000/api/health > /dev/null; then
            print_status 0 "Health endpoint responding"
            
            # Show health response
            echo "Health response:"
            curl -s http://localhost:3000/api/health | jq . 2>/dev/null || curl -s http://localhost:3000/api/health
        else
            print_status 1 "Health endpoint not responding"
        fi
        
        # Test main page
        echo "🌐 Testing main page..."
        if curl -s http://localhost:3000/ > /dev/null; then
            print_status 0 "Main page accessible"
        else
            print_status 1 "Main page not accessible"
        fi
        
    else
        print_status 1 "Server failed to start"
        echo "Server log:"
        cat server.log
    fi
    
    # Cleanup
    if [ ! -z "$SERVER_PID" ]; then
        echo "Stopping server..."
        kill $SERVER_PID 2>/dev/null || true
    fi
    
    # Clean up log file
    rm -f server.log
    
else
    print_status 1 "Trading journal server not found"
fi

echo ""
echo "🎯 VERIFICATION PHASE 5: FEATURE VERIFICATION"
echo "============================================="

# Check for key files
echo "📁 Checking key files..."
if [ -f "src/frontend/pages/index.html" ]; then
    print_status 0 "Frontend pages exist"
else
    print_status 1 "Frontend pages missing"
fi

if [ -f "src/backend/api/trading-journal-working.js" ]; then
    print_status 0 "Backend API exists"
else
    print_status 1 "Backend API missing"
fi

if [ -f "config/claude-code-config.js" ]; then
    print_status 0 "Configuration files exist"
else
    print_status 1 "Configuration files missing"
fi

echo ""
echo "🎯 VERIFICATION PHASE 6: ENVIRONMENT CHECK"
echo "=========================================="

# Check environment variables
echo "🔑 Checking environment variables..."
if [ ! -z "$ANTHROPIC_API_KEY" ]; then
    print_status 0 "ANTHROPIC_API_KEY is set"
else
    print_status 1 "ANTHROPIC_API_KEY is not set"
fi

if [ ! -z "$CLAUDE_API_KEY" ]; then
    print_status 0 "CLAUDE_API_KEY is set"
else
    print_status 1 "CLAUDE_API_KEY is not set"
fi

# Check Node.js version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "Node.js version: $NODE_VERSION"
if [[ "$NODE_VERSION" =~ v1[8-9] ]] || [[ "$NODE_VERSION" =~ v2[0-9] ]]; then
    print_status 0 "Node.js version is compatible"
else
    print_status 1 "Node.js version may be incompatible"
fi

echo ""
echo "🎯 VERIFICATION SUMMARY"
echo "======================"

# Count successes and failures
SUCCESS_COUNT=0
FAILURE_COUNT=0

# This would be calculated based on actual test results
# For now, we'll provide a template

echo "📊 Verification Results:"
echo "- Code Quality: [PASS/FAIL]"
echo "- Build Process: [PASS/FAIL]"
echo "- Tests: [PASS/FAIL]"
echo "- Runtime: [PASS/FAIL]"
echo "- Features: [PASS/FAIL]"
echo "- Environment: [PASS/FAIL]"

echo ""
echo "🎯 TRUTHFULNESS CHECKLIST"
echo "========================"
echo "✅ I actually ran all the commands above"
echo "✅ I pasted real output (not imagined)"
echo "✅ I reported actual errors (not success)"
echo "✅ I verified the features work (not assumed)"
echo "✅ I can demonstrate the functionality"

echo ""
echo "📄 EVIDENCE REQUIRED"
echo "==================="
echo "For any completion claim, you MUST include:"
echo "1. The actual output from this verification script"
echo "2. Screenshots or video of working features"
echo "3. Real test results with coverage numbers"
echo "4. Actual error messages if anything fails"

echo ""
echo "🚨 REMEMBER: Truthfulness is non-negotiable!"
echo "Better to report failure honestly than claim false success."

# Generate verification report
echo ""
echo "📄 Generating verification report..."
REPORT_FILE="verification-report-$(date +%Y%m%d-%H%M%S).md"

cat > "$REPORT_FILE" << EOF
# AI Team Verification Report
**Date**: $(date)
**User**: $(whoami)
**Project**: Elite Trader AI Coach v1.0

## Verification Results

### Code Quality
- Linting: [PASS/FAIL]
- Dependencies: [PASS/FAIL]

### Build Process
- Build: [PASS/FAIL]

### Testing
- Tests: [PASS/FAIL]

### Runtime
- Server Start: [PASS/FAIL]
- Health Endpoint: [PASS/FAIL]
- Main Page: [PASS/FAIL]

### Features
- Frontend: [PASS/FAIL]
- Backend: [PASS/FAIL]
- Configuration: [PASS/FAIL]

### Environment
- API Keys: [PASS/FAIL]
- Node.js: [PASS/FAIL]

## Evidence
[Paste actual command outputs here]

## Status
**OVERALL STATUS**: [COMPLETE/INCOMPLETE] based on actual results

## Next Steps
[Describe actual next steps needed]
EOF

echo "✅ Verification report saved to: $REPORT_FILE"
echo ""
echo "🔍 VERIFICATION COMPLETE"
echo "======================="
echo "Use this report as evidence for any completion claims."
echo "Remember: Only claim success if you have actual proof!" 