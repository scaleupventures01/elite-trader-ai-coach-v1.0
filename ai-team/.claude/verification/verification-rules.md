# 🚨 MANDATORY VERIFICATION RULES

**CRITICAL**: These rules are MANDATORY for ALL AI agents. Violation results in immediate system shutdown.

## 🎯 CORE PRINCIPLES

### 1. **NEVER CLAIM COMPLETION WITHOUT PROOF**
- ❌ **FORBIDDEN**: "The feature is complete and working"
- ✅ **REQUIRED**: "The feature is complete. Here's the actual test output: [paste real output]"

### 2. **ALWAYS RUN CODE BEFORE CLAIMING IT WORKS**
- ❌ **FORBIDDEN**: "The code should work" or "The tests pass"
- ✅ **REQUIRED**: "I ran the code. Here's the actual output: [paste real terminal output]"

### 3. **DATA MUST BE REAL**
- ❌ **FORBIDDEN**: Inventing test results, performance metrics, or feature status
- ✅ **REQUIRED**: Only report actual, verifiable data

## 🔍 VERIFICATION CHECKPOINTS

### For Development Claims:
```bash
# MANDATORY: Run before claiming code complete
npm test -- --verbose
npm run lint
npm run build
node src/backend/api/trading-journal-working.js
curl http://localhost:3000/api/health
```

### For QA Claims:
```bash
# MANDATORY: Run before claiming tests pass
npm test -- --coverage
npm run lint -- --format=checkstyle
npm run build -- --dry-run
```

### For PM Claims:
```bash
# MANDATORY: Run before claiming sprint complete
# 1. Verify all features actually run
node src/backend/api/trading-journal-working.js
curl http://localhost:3000/api/health

# 2. Verify all tests actually pass
npm test

# 3. Demo the working application
open http://localhost:3000
```

## 📋 REQUIRED EVIDENCE FORMAT

### Code Completion Claims:
```markdown
## ✅ CODE COMPLETION VERIFICATION

### Commands Executed:
```bash
npm test -- --verbose
# [PASTE ACTUAL OUTPUT HERE]
```

### Build Status:
```bash
npm run build
# [PASTE ACTUAL OUTPUT HERE]
```

### Runtime Test:
```bash
node src/backend/api/trading-journal-working.js
# [PASTE ACTUAL OUTPUT HERE]
```

### Health Check:
```bash
curl http://localhost:3000/api/health
# [PASTE ACTUAL OUTPUT HERE]
```

**STATUS**: [COMPLETE/INCOMPLETE] based on actual results
```

### Test Completion Claims:
```markdown
## ✅ TEST COMPLETION VERIFICATION

### Test Results:
```bash
npm test -- --coverage
# [PASTE ACTUAL OUTPUT HERE]
```

### Coverage Report:
```bash
npm run test:coverage
# [PASTE ACTUAL COVERAGE NUMBERS HERE]
```

### Lint Results:
```bash
npm run lint
# [PASTE ACTUAL OUTPUT HERE]
```

**STATUS**: [PASS/FAIL] based on actual results
```

### Sprint Completion Claims:
```markdown
## ✅ SPRINT COMPLETION VERIFICATION

### Feature Verification:
1. **Authentication System**: [WORKING/BROKEN] - [paste test output]
2. **API Endpoints**: [WORKING/BROKEN] - [paste test output]
3. **UI Components**: [WORKING/BROKEN] - [paste test output]

### Demo Verification:
```bash
# Server running at: [ACTUAL URL]
# Health check: [ACTUAL RESPONSE]
# Demo accounts: [ACTUAL LOGIN TEST RESULTS]
```

**STATUS**: [COMPLETE/INCOMPLETE] based on actual verification
```

## 🚨 FAILURE SCENARIOS

### If Code Doesn't Work:
```markdown
## ❌ CODE FAILURE REPORT

### Error Encountered:
```bash
[PASTE ACTUAL ERROR MESSAGE]
```

### Attempted Fixes:
1. [Describe actual fix attempt]
2. [Show actual error after fix]

### Current Status:
- ❌ Feature is NOT working
- ❌ Tests are NOT passing
- ❌ Sprint is NOT complete

**NEXT STEPS**: [Describe actual next steps needed]
```

### If Tests Fail:
```markdown
## ❌ TEST FAILURE REPORT

### Failed Tests:
```bash
[PASTE ACTUAL FAILING TEST OUTPUT]
```

### Coverage Issues:
```bash
[PASTE ACTUAL COVERAGE REPORT]
```

### Current Status:
- ❌ Tests are NOT passing
- ❌ Code quality is NOT acceptable
- ❌ Sprint is NOT complete

**NEXT STEPS**: [Describe actual fixes needed]
```

## 🔧 VERIFICATION TOOLS

### Automated Verification Script:
```bash
#!/bin/bash
# verification-check.sh

echo "🔍 RUNNING VERIFICATION CHECKS..."

# Test the application
echo "📋 Testing application..."
npm test -- --verbose

# Check build
echo "🔨 Checking build..."
npm run build

# Test runtime
echo "🚀 Testing runtime..."
node src/backend/api/trading-journal-working.js &
SERVER_PID=$!
sleep 5

# Health check
echo "💓 Health check..."
curl -s http://localhost:3000/api/health

# Cleanup
kill $SERVER_PID

echo "✅ Verification complete"
```

### Truthfulness Checklist:
- [ ] I actually ran the commands
- [ ] I pasted real output (not imagined)
- [ ] I reported actual errors (not success)
- [ ] I verified the feature works (not assumed)
- [ ] I can demonstrate the functionality

## 🎯 ENFORCEMENT

### For AI Agents:
1. **MANDATORY**: Run verification before any completion claim
2. **MANDATORY**: Paste actual command output
3. **MANDATORY**: Report actual errors and failures
4. **FORBIDDEN**: Making assumptions about functionality
5. **FORBIDDEN**: Inventing test results or metrics

### For Human Reviewers:
1. **ALWAYS** verify AI claims with actual testing
2. **NEVER** accept claims without evidence
3. **REQUIRE** real command output and test results
4. **QUESTION** any claim that seems too good to be true

## 📞 REPORTING VIOLATIONS

If an AI agent violates these rules:
1. **IMMEDIATE**: Stop the agent
2. **DOCUMENT**: The false claim made
3. **VERIFY**: Run actual tests to confirm reality
4. **CORRECT**: Provide accurate status report
5. **PREVENT**: Implement additional verification

---

**🎯 REMEMBER**: Truthfulness is non-negotiable. Better to report failure honestly than claim false success. 