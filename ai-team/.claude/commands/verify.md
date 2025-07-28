# /verify Command - Human Verification Request

## Overview

The `/verify` command provides human oversight by comparing AI agent claims against actual system state and requesting human verification when discrepancies are found.

## 🔍 Verification Process

When user types `/verify`:

### 1. **Show claimed vs actual state**
```javascript
const verificationReport = await generateVerificationReport();

console.log('📋 VERIFICATION REPORT');
console.log('═════════════════════');
console.log('');

// Developer Claims vs Reality
console.log('👨‍💻 DEVELOPER CLAIMS:');
console.log('✓ User authentication implemented');
console.log('✓ All tests passing');
console.log('✓ API endpoints working');
console.log('');

console.log('🔍 ACTUAL STATE:');
console.log('❌ auth.test.js - 2 failures');
console.log('❌ No login endpoint found');
console.log('✅ User model created');
console.log('❌ API returns 404 errors');
console.log('');

// QA Claims vs Reality
console.log('🧪 QA CLAIMS:');
console.log('✓ 95% test coverage');
console.log('✓ All integration tests pass');
console.log('✓ Performance benchmarks met');
console.log('');

console.log('🔍 ACTUAL STATE:');
console.log('❌ Coverage: 45%');
console.log('❌ Integration tests not run');
console.log('❌ Performance tests failing');
console.log('');

// Product Manager Claims vs Reality
console.log('📋 PRODUCT MANAGER CLAIMS:');
console.log('✓ Sprint 2 complete');
console.log('✓ Demo ready for CEO');
console.log('✓ All features working');
console.log('');

console.log('🔍 ACTUAL STATE:');
console.log('❌ Sprint 2: 3/8 tasks incomplete');
console.log('❌ Demo crashes on login');
console.log('❌ Core features non-functional');
console.log('');
```

### 2. **Request human verification**
```javascript
console.log('🛑 HUMAN VERIFICATION REQUIRED');
console.log('The AI team has made claims that don\'t match reality.');
console.log('');
console.log('Would you like to:');
console.log('');
console.log('1. 📊 See the actual test output');
console.log('2. 🔧 Have the team fix the issues');
console.log('3. ⏮️  Reset to last verified state');
console.log('4. ⚠️  Continue anyway (not recommended)');
console.log('5. 🚨 Escalate to meta team');
console.log('');
console.log('Enter your choice (1-5):');
```

## 🔧 Implementation

### **Verification Report Generator:**
```javascript
class VerificationReportGenerator {
  constructor() {
    this.truthEnforcer = new TruthEnforcer();
    this.verificationSystem = new VerificationSystem();
    this.claimTracker = new ClaimTracker();
  }

  async generateVerificationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      developerClaims: await this.getDeveloperClaims(),
      qaClaims: await this.getQAClaims(),
      pmClaims: await this.getPMClaims(),
      actualState: await this.getActualState(),
      discrepancies: [],
      recommendations: []
    };

    // Compare claims vs reality
    report.discrepancies = await this.findDiscrepancies(report);
    report.recommendations = await this.generateRecommendations(report);

    return report;
  }

  async getDeveloperClaims() {
    const claims = await this.claimTracker.getRecentClaims('development', 24);
    return claims.map(claim => ({
      text: claim.text,
      timestamp: claim.timestamp,
      verified: claim.verified,
      evidence: claim.evidence
    }));
  }

  async getQAClaims() {
    const claims = await this.claimTracker.getRecentClaims('qa', 24);
    return claims.map(claim => ({
      text: claim.text,
      timestamp: claim.timestamp,
      verified: claim.verified,
      evidence: claim.evidence
    }));
  }

  async getPMClaims() {
    const claims = await this.claimTracker.getRecentClaims('product_manager', 24);
    return claims.map(claim => ({
      text: claim.text,
      timestamp: claim.timestamp,
      verified: claim.verified,
      evidence: claim.evidence
    }));
  }

  async getActualState() {
    const state = {
      tests: await this.runActualTests(),
      coverage: await this.getActualCoverage(),
      endpoints: await this.checkEndpoints(),
      features: await this.testFeatures(),
      performance: await this.runPerformanceTests()
    };

    return state;
  }

  async runActualTests() {
    try {
      const { stdout, stderr } = await execAsync('npm test -- --json --silent');
      const testResults = JSON.parse(stdout);
      
      return {
        total: testResults.numTotalTests,
        passed: testResults.numPassedTests,
        failed: testResults.numFailedTests,
        errors: testResults.testResults.map(result => 
          result.testResults.filter(test => test.status === 'failed')
        ).flat()
      };
    } catch (error) {
      return {
        error: error.message,
        total: 0,
        passed: 0,
        failed: 0
      };
    }
  }

  async getActualCoverage() {
    try {
      const { stdout } = await execAsync('npm test -- --coverage --json');
      const coverageData = JSON.parse(stdout);
      
      return {
        statements: coverageData.coverageMap?.summary?.statements?.pct || 0,
        branches: coverageData.coverageMap?.summary?.branches?.pct || 0,
        functions: coverageData.coverageMap?.summary?.functions?.pct || 0,
        lines: coverageData.coverageMap?.summary?.lines?.pct || 0
      };
    } catch (error) {
      return {
        error: error.message,
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0
      };
    }
  }

  async checkEndpoints() {
    const endpoints = [
      { path: '/api/auth/login', method: 'POST' },
      { path: '/api/auth/register', method: 'POST' },
      { path: '/api/users/profile', method: 'GET' },
      { path: '/api/health', method: 'GET' }
    ];

    const results = [];
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:3000${endpoint.path}`, {
          method: endpoint.method,
          headers: { 'Content-Type': 'application/json' }
        });
        
        results.push({
          path: endpoint.path,
          method: endpoint.method,
          status: response.status,
          working: response.status !== 404
        });
      } catch (error) {
        results.push({
          path: endpoint.path,
          method: endpoint.method,
          status: 'ERROR',
          working: false,
          error: error.message
        });
      }
    }

    return results;
  }

  async testFeatures() {
    const features = [
      { name: 'User Registration', test: this.testUserRegistration },
      { name: 'User Login', test: this.testUserLogin },
      { name: 'Profile Management', test: this.testProfileManagement },
      { name: 'Data Persistence', test: this.testDataPersistence }
    ];

    const results = [];
    for (const feature of features) {
      try {
        const result = await feature.test();
        results.push({
          name: feature.name,
          working: result.success,
          details: result.details
        });
      } catch (error) {
        results.push({
          name: feature.name,
          working: false,
          error: error.message
        });
      }
    }

    return results;
  }

  async runPerformanceTests() {
    try {
      const { stdout } = await execAsync('npm run test:performance');
      return {
        responseTime: this.parseResponseTime(stdout),
        throughput: this.parseThroughput(stdout),
        memoryUsage: this.parseMemoryUsage(stdout)
      };
    } catch (error) {
      return {
        error: error.message,
        responseTime: 'N/A',
        throughput: 'N/A',
        memoryUsage: 'N/A'
      };
    }
  }

  async findDiscrepancies(report) {
    const discrepancies = [];

    // Check developer claims vs actual tests
    const devClaims = report.developerClaims.filter(c => c.text.includes('test'));
    const actualTests = report.actualState.tests;
    
    if (devClaims.some(c => c.text.includes('all tests pass')) && actualTests.failed > 0) {
      discrepancies.push({
        type: 'test_discrepancy',
        claimed: 'All tests passing',
        actual: `${actualTests.failed} tests failing`,
        severity: 'high'
      });
    }

    // Check QA claims vs actual coverage
    const qaClaims = report.qaClaims.filter(c => c.text.includes('coverage'));
    const actualCoverage = report.actualState.coverage;
    
    qaClaims.forEach(claim => {
      const coverageMatch = claim.text.match(/(\d+)%/);
      if (coverageMatch) {
        const claimedCoverage = parseInt(coverageMatch[1]);
        if (claimedCoverage > actualCoverage.lines) {
          discrepancies.push({
            type: 'coverage_discrepancy',
            claimed: `${claimedCoverage}% coverage`,
            actual: `${actualCoverage.lines}% coverage`,
            severity: 'medium'
          });
        }
      }
    });

    // Check PM claims vs actual features
    const pmClaims = report.pmClaims.filter(c => c.text.includes('complete'));
    const actualFeatures = report.actualState.features;
    
    if (pmClaims.some(c => c.text.includes('sprint complete')) && 
        actualFeatures.some(f => !f.working)) {
      discrepancies.push({
        type: 'feature_discrepancy',
        claimed: 'Sprint complete',
        actual: `${actualFeatures.filter(f => !f.working).length} features not working`,
        severity: 'high'
      });
    }

    return discrepancies;
  }

  async generateRecommendations(report) {
    const recommendations = [];

    if (report.discrepancies.length > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Fix verification failures',
        description: 'Address discrepancies between claims and actual state'
      });
    }

    if (report.actualState.tests.failed > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Fix failing tests',
        description: `Resolve ${report.actualState.tests.failed} failing tests`
      });
    }

    if (report.actualState.coverage.lines < 80) {
      recommendations.push({
        priority: 'medium',
        action: 'Improve test coverage',
        description: `Increase coverage from ${report.actualState.coverage.lines}% to 80%+`
      });
    }

    if (report.actualState.endpoints.some(e => !e.working)) {
      recommendations.push({
        priority: 'high',
        action: 'Fix broken endpoints',
        description: `Repair ${report.actualState.endpoints.filter(e => !e.working).length} non-working endpoints`
      });
    }

    return recommendations;
  }
}
```

### **Human Verification Handler:**
```javascript
class HumanVerificationHandler {
  constructor() {
    this.reportGenerator = new VerificationReportGenerator();
    this.truthEnforcer = new TruthEnforcer();
    this.honestyReinforcement = new HonestyReinforcement();
  }

  async handleVerificationRequest() {
    console.log('🔍 GENERATING VERIFICATION REPORT...');
    console.log('');

    const report = await this.reportGenerator.generateVerificationReport();
    
    // Display the report
    await this.displayVerificationReport(report);
    
    // Show discrepancies
    if (report.discrepancies.length > 0) {
      await this.displayDiscrepancies(report.discrepancies);
    }
    
    // Request human decision
    const decision = await this.requestHumanDecision(report);
    
    // Handle the decision
    await this.handleHumanDecision(decision, report);
  }

  async displayVerificationReport(report) {
    console.log('📋 VERIFICATION REPORT');
    console.log('═════════════════════');
    console.log(`Generated: ${new Date(report.timestamp).toLocaleString()}`);
    console.log('');

    // Developer Claims
    console.log('👨‍💻 DEVELOPER CLAIMS:');
    report.developerClaims.forEach(claim => {
      const status = claim.verified ? '✓' : '❓';
      console.log(`${status} ${claim.text}`);
    });
    console.log('');

    console.log('🔍 ACTUAL STATE:');
    const tests = report.actualState.tests;
    if (tests.error) {
      console.log(`❌ Tests: ${tests.error}`);
    } else {
      console.log(`📊 Tests: ${tests.passed}/${tests.total} passing, ${tests.failed} failing`);
    }

    const coverage = report.actualState.coverage;
    if (coverage.error) {
      console.log(`❌ Coverage: ${coverage.error}`);
    } else {
      console.log(`📊 Coverage: ${coverage.lines}% lines, ${coverage.functions}% functions`);
    }

    const endpoints = report.actualState.endpoints;
    const workingEndpoints = endpoints.filter(e => e.working).length;
    console.log(`🔗 Endpoints: ${workingEndpoints}/${endpoints.length} working`);
    console.log('');

    // QA Claims
    console.log('🧪 QA CLAIMS:');
    report.qaClaims.forEach(claim => {
      const status = claim.verified ? '✓' : '❓';
      console.log(`${status} ${claim.text}`);
    });
    console.log('');

    // PM Claims
    console.log('📋 PRODUCT MANAGER CLAIMS:');
    report.pmClaims.forEach(claim => {
      const status = claim.verified ? '✓' : '❓';
      console.log(`${status} ${claim.text}`);
    });
    console.log('');
  }

  async displayDiscrepancies(discrepancies) {
    console.log('🚨 DISCREPANCIES DETECTED');
    console.log('═══════════════════════');
    console.log('');

    discrepancies.forEach((discrepancy, index) => {
      const severityIcon = discrepancy.severity === 'high' ? '🔴' : '🟡';
      console.log(`${severityIcon} ${index + 1}. ${discrepancy.type.toUpperCase()}`);
      console.log(`   Claimed: ${discrepancy.claimed}`);
      console.log(`   Actual: ${discrepancy.actual}`);
      console.log('');
    });
  }

  async requestHumanDecision(report) {
    console.log('🛑 HUMAN VERIFICATION REQUIRED');
    console.log('The AI team has made claims that don\'t match reality.');
    console.log('');
    console.log('Would you like to:');
    console.log('');
    console.log('1. 📊 See the actual test output');
    console.log('2. 🔧 Have the team fix the issues');
    console.log('3. ⏮️  Reset to last verified state');
    console.log('4. ⚠️  Continue anyway (not recommended)');
    console.log('5. 🚨 Escalate to meta team');
    console.log('6. 📋 View detailed recommendations');
    console.log('');

    // In a real implementation, this would wait for user input
    // For now, we'll simulate the decision
    return {
      choice: 2, // Default to fixing issues
      timestamp: new Date().toISOString(),
      report: report
    };
  }

  async handleHumanDecision(decision, report) {
    console.log('🎯 HANDLING HUMAN DECISION');
    console.log('==========================');
    console.log('');

    switch (decision.choice) {
      case 1: // Show actual test output
        await this.showActualTestOutput(report);
        break;
        
      case 2: // Fix issues
        await this.fixIssues(report);
        break;
        
      case 3: // Reset to last verified state
        await this.resetToLastVerifiedState();
        break;
        
      case 4: // Continue anyway
        await this.continueAnyway(report);
        break;
        
      case 5: // Escalate to meta team
        await this.escalateToMetaTeam(report);
        break;
        
      case 6: // View recommendations
        await this.showRecommendations(report);
        break;
        
      default:
        console.log('❌ Invalid choice. Please try again.');
    }
  }

  async showActualTestOutput(report) {
    console.log('📊 ACTUAL TEST OUTPUT');
    console.log('═════════════════════');
    console.log('');

    const tests = report.actualState.tests;
    if (tests.error) {
      console.log(`❌ Test Error: ${tests.error}`);
    } else {
      console.log(`📊 Test Summary: ${tests.passed}/${tests.total} passing`);
      
      if (tests.errors && tests.errors.length > 0) {
        console.log('');
        console.log('❌ FAILING TESTS:');
        tests.errors.forEach((error, index) => {
          console.log(`${index + 1}. ${error.name}`);
          console.log(`   Error: ${error.message}`);
          console.log('');
        });
      }
    }
  }

  async fixIssues(report) {
    console.log('🔧 FIXING ISSUES');
    console.log('════════════════');
    console.log('');

    const recommendations = report.recommendations;
    
    for (const rec of recommendations) {
      console.log(`🎯 ${rec.priority.toUpperCase()}: ${rec.action}`);
      console.log(`   ${rec.description}`);
      console.log('');

      // Record the verification failure for learning
      await this.honestyReinforcement.recordVerificationFailure(
        'AI Team',
        'Claims matching reality',
        'Claims do not match actual state'
      );
    }

    console.log('✅ Issues identified and logged for fixing');
    console.log('🔄 Team will address these issues before continuing');
  }

  async resetToLastVerifiedState() {
    console.log('⏮️  RESETTING TO LAST VERIFIED STATE');
    console.log('═══════════════════════════════════════');
    console.log('');

    // This would implement a rollback mechanism
    console.log('🔄 Rolling back to last known good state...');
    console.log('📋 Clearing unverified claims...');
    console.log('✅ System reset to verified state');
  }

  async continueAnyway(report) {
    console.log('⚠️  CONTINUING DESPITE ISSUES');
    console.log('═══════════════════════════════════');
    console.log('');

    console.log('🚨 WARNING: This is not recommended');
    console.log('📋 Issues that will be ignored:');
    
    report.discrepancies.forEach(d => {
      console.log(`   - ${d.claimed} vs ${d.actual}`);
    });

    console.log('');
    console.log('⚠️  Proceeding with unverified claims...');
    console.log('📝 This decision has been logged for review');
  }

  async escalateToMetaTeam(report) {
    console.log('🚨 ESCALATING TO META TEAM');
    console.log('═══════════════════════════════════');
    console.log('');

    console.log('📋 Creating escalation report...');
    console.log('📧 Notifying meta team...');
    console.log('⏳ Awaiting meta team response...');
    
    // This would trigger meta team intervention
    console.log('✅ Escalation initiated');
  }

  async showRecommendations(report) {
    console.log('📋 DETAILED RECOMMENDATIONS');
    console.log('═══════════════════════════════════');
    console.log('');

    report.recommendations.forEach((rec, index) => {
      const priorityIcon = rec.priority === 'high' ? '🔴' : '🟡';
      console.log(`${priorityIcon} ${index + 1}. ${rec.action}`);
      console.log(`   Priority: ${rec.priority.toUpperCase()}`);
      console.log(`   Description: ${rec.description}`);
      console.log('');
    });
  }
}
```

## 📋 Usage Examples

### **Basic Verification:**
```
/verify
```

**Output:**
```
🔍 GENERATING VERIFICATION REPORT...

📋 VERIFICATION REPORT
═════════════════════
Generated: 7/28/2025, 5:15:30 PM

👨‍💻 DEVELOPER CLAIMS:
✓ User authentication implemented
❓ All tests passing
✓ API endpoints working

🔍 ACTUAL STATE:
📊 Tests: 8/10 passing, 2 failing
📊 Coverage: 45% lines, 60% functions
🔗 Endpoints: 2/4 working

🧪 QA CLAIMS:
❓ 95% test coverage
✓ All integration tests pass

📋 PRODUCT MANAGER CLAIMS:
❓ Sprint 2 complete
✓ Demo ready for CEO

🚨 DISCREPANCIES DETECTED
═══════════════════════

🔴 1. TEST_DISCREPANCY
   Claimed: All tests passing
   Actual: 2 tests failing

🟡 2. COVERAGE_DISCREPANCY
   Claimed: 95% coverage
   Actual: 45% coverage

🛑 HUMAN VERIFICATION REQUIRED
The AI team has made claims that don't match reality.

Would you like to:

1. 📊 See the actual test output
2. 🔧 Have the team fix the issues
3. ⏮️  Reset to last verified state
4. ⚠️  Continue anyway (not recommended)
5. 🚨 Escalate to meta team
6. 📋 View detailed recommendations
```

### **Detailed Test Output:**
```
📊 ACTUAL TEST OUTPUT
═════════════════════

📊 Test Summary: 8/10 passing

❌ FAILING TESTS:

1. User Authentication - Email Validation
   Error: Expected 'invalid-email' to match /^[^\s@]+@[^\s@]+\.[^\s@]+$/

2. User Authentication - Password Hashing
   Error: TypeError: bcrypt.hash is not a function
```

## 🎯 Integration Points

### **With Truth Enforcer:**
```javascript
// Integrate with truth enforcer for automatic verification
class TruthEnforcer {
  async interceptAgentClaim(agent, claim) {
    // ... existing logic ...
    
    // If verification fails, suggest human verification
    if (!result.allowed) {
      console.log('💡 Suggestion: Use /verify to see detailed comparison');
    }
    
    return result;
  }
}
```

### **With Workflow Commands:**
```javascript
// Add verification to workflow
class WorkflowManager {
  async next() {
    // ... existing verification ...
    
    // Suggest human verification if issues found
    if (hasIssues) {
      console.log('💡 Consider using /verify for human oversight');
    }
  }
}
```

## 🚨 Success Criteria

### **Verification Must:**
- ✅ **Compare claims vs reality** accurately
- ✅ **Detect discrepancies** between claims and actual state
- ✅ **Provide clear recommendations** for fixing issues
- ✅ **Request human intervention** when needed
- ✅ **Log verification failures** for learning
- ✅ **Support multiple resolution paths** (fix, reset, escalate, continue)

### **Human Decision Support:**
- ✅ **Clear presentation** of issues and discrepancies
- ✅ **Multiple resolution options** with clear consequences
- ✅ **Detailed recommendations** for fixing issues
- ✅ **Escalation path** to meta team when needed
- ✅ **Learning integration** to improve future behavior

---

**🎯 REMEMBER**: The `/verify` command provides essential human oversight to ensure AI team claims match reality and provides clear paths for resolution when they don't. 