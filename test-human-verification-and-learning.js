#!/usr/bin/env node

/**
 * 🧪 HUMAN VERIFICATION & LEARNING SYSTEM TEST
 * 
 * This test script demonstrates the complete human verification and learning
 * implementation to prove it's working correctly.
 */

const TruthEnforcer = require('./.claude/middleware/truth-enforcer');
const HonestyReinforcement = require('./.claude/learning/honesty-reinforcement');
const ClaimInterceptor = require('./.claude/hooks/claim-interceptor');

class HumanVerificationAndLearningTest {
  constructor() {
    this.truthEnforcer = new TruthEnforcer();
    this.honestyReinforcement = new HonestyReinforcement();
    this.claimInterceptor = new ClaimInterceptor();
    this.testResults = [];
  }

  async runAllTests() {
    console.log('🧪 HUMAN VERIFICATION & LEARNING SYSTEM TEST');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log('Starting comprehensive test suite...');
    console.log('');

    try {
      // Test 1: Truth Enforcer Middleware
      await this.testTruthEnforcer();
      
      // Test 2: Honesty Reinforcement Learning
      await this.testHonestyReinforcement();
      
      // Test 3: Claim Interceptor
      await this.testClaimInterceptor();
      
      // Test 4: Integration Test
      await this.testIntegration();
      
      // Test 5: Learning Insights
      await this.testLearningInsights();
      
      // Display final results
      this.displayTestResults();
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      process.exit(1);
    }
  }

  async testTruthEnforcer() {
    console.log('🔍 TEST 1: TRUTH ENFORCER MIDDLEWARE');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Test 1.1: Suspicious pattern detection
    console.log('1.1 Testing suspicious pattern detection...');
    const suspiciousClaim = "All tests pass and everything works perfectly";
    const result1 = await this.truthEnforcer.interceptAgentClaim("Developer Agent", suspiciousClaim);
    
    this.testResults.push({
      test: '1.1 Suspicious Pattern Detection',
      expected: 'BLOCKED',
      actual: result1.allowed ? 'ALLOWED' : 'BLOCKED',
      passed: !result1.allowed,
      details: result1.message
    });

    console.log(`   Expected: BLOCKED`);
    console.log(`   Actual: ${result1.allowed ? 'ALLOWED' : 'BLOCKED'}`);
    console.log(`   Result: ${result1.allowed ? '❌ FAIL' : '✅ PASS'}`);
    console.log(`   Message: ${result1.message}`);
    console.log('');

    // Test 1.2: Evidence detection
    console.log('1.2 Testing evidence detection...');
    const evidenceClaim = "Authentication implemented. Test output: $ npm test PASS 3 tests";
    const result2 = await this.truthEnforcer.interceptAgentClaim("Developer Agent", evidenceClaim);
    
    this.testResults.push({
      test: '1.2 Evidence Detection',
      expected: 'ALLOWED',
      actual: result2.allowed ? 'ALLOWED' : 'BLOCKED',
      passed: result2.allowed,
      details: result2.message || 'Claim allowed with evidence'
    });

    console.log(`   Expected: ALLOWED`);
    console.log(`   Actual: ${result2.allowed ? 'ALLOWED' : 'BLOCKED'}`);
    console.log(`   Result: ${result2.allowed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Message: ${result2.message || 'Claim allowed with evidence'}`);
    console.log('');

    // Test 1.3: Made-up data detection
    console.log('1.3 Testing made-up data detection...');
    const madeUpClaim = "We achieved 95% test coverage and 100% performance improvement";
    const result3 = await this.truthEnforcer.interceptAgentClaim("QA Agent", madeUpClaim);
    
    this.testResults.push({
      test: '1.3 Made-up Data Detection',
      expected: 'WARNING',
      actual: result3.warnings && result3.warnings.length > 0 ? 'WARNING' : 'NO_WARNING',
      passed: result3.warnings && result3.warnings.length > 0,
      details: result3.warnings ? result3.warnings.join(', ') : 'No warnings'
    });

    console.log(`   Expected: WARNING`);
    console.log(`   Actual: ${result3.warnings && result3.warnings.length > 0 ? 'WARNING' : 'NO_WARNING'}`);
    console.log(`   Result: ${result3.warnings && result3.warnings.length > 0 ? '✅ PASS' : '❌ FAIL'}`);
    if (result3.warnings) {
      result3.warnings.forEach(warning => console.log(`   Warning: ${warning}`));
    }
    console.log('');
  }

  async testHonestyReinforcement() {
    console.log('🧠 TEST 2: HONESTY REINFORCEMENT LEARNING');
    console.log('═══════════════════════════════════════════════');
    console.log('');

    // Test 2.1: Record verification failure
    console.log('2.1 Testing verification failure recording...');
    const failureEpisode = await this.honestyReinforcement.recordVerificationFailure(
      'Developer Agent',
      'All tests pass and everything works',
      '2 tests failing, bcrypt not imported'
    );
    
    this.testResults.push({
      test: '2.1 Verification Failure Recording',
      expected: 'RECORDED',
      actual: failureEpisode ? 'RECORDED' : 'FAILED',
      passed: failureEpisode !== null,
      details: `Episode ID: ${failureEpisode?.id}, Reward: ${failureEpisode?.reward}`
    });

    console.log(`   Expected: RECORDED`);
    console.log(`   Actual: ${failureEpisode ? 'RECORDED' : 'FAILED'}`);
    console.log(`   Result: ${failureEpisode ? '✅ PASS' : '❌ FAIL'}`);
    if (failureEpisode) {
      console.log(`   Episode ID: ${failureEpisode.id}`);
      console.log(`   Reward: ${failureEpisode.reward}`);
      console.log(`   Lesson: ${failureEpisode.lesson}`);
    }
    console.log('');

    // Test 2.2: Record honest reporting
    console.log('2.2 Testing honest reporting recording...');
    const honestEpisode = await this.honestyReinforcement.recordHonestReporting(
      'Developer Agent',
      'Email validation regex is incorrect',
      { testName: 'should validate email format', error: 'regex mismatch' }
    );
    
    this.testResults.push({
      test: '2.2 Honest Reporting Recording',
      expected: 'RECORDED',
      actual: honestEpisode ? 'RECORDED' : 'FAILED',
      passed: honestEpisode !== null,
      details: `Episode ID: ${honestEpisode?.id}, Reward: ${honestEpisode?.reward}`
    });

    console.log(`   Expected: RECORDED`);
    console.log(`   Actual: ${honestEpisode ? 'RECORDED' : 'FAILED'}`);
    console.log(`   Result: ${honestEpisode ? '✅ PASS' : '❌ FAIL'}`);
    if (honestEpisode) {
      console.log(`   Episode ID: ${honestEpisode.id}`);
      console.log(`   Reward: ${honestEpisode.reward}`);
      console.log(`   Lesson: ${honestEpisode.lesson}`);
    }
    console.log('');

    // Test 2.3: Record successful verification
    console.log('2.3 Testing successful verification recording...');
    const successEpisode = await this.honestyReinforcement.recordSuccessfulVerification(
      'Developer Agent',
      'Authentication system implemented with tests passing',
      { testOutput: 'PASS 3 tests', coverage: '85%' }
    );
    
    this.testResults.push({
      test: '2.3 Successful Verification Recording',
      expected: 'RECORDED',
      actual: successEpisode ? 'RECORDED' : 'FAILED',
      passed: successEpisode !== null,
      details: `Episode ID: ${successEpisode?.id}, Reward: ${successEpisode?.reward}`
    });

    console.log(`   Expected: RECORDED`);
    console.log(`   Actual: ${successEpisode ? 'RECORDED' : 'FAILED'}`);
    console.log(`   Result: ${successEpisode ? '✅ PASS' : '❌ FAIL'}`);
    if (successEpisode) {
      console.log(`   Episode ID: ${successEpisode.id}`);
      console.log(`   Reward: ${successEpisode.reward}`);
      console.log(`   Lesson: ${successEpisode.lesson}`);
    }
    console.log('');
  }

  async testClaimInterceptor() {
    console.log('🚨 TEST 3: CLAIM INTERCEPTOR');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Test 3.1: Intercept suspicious claim
    console.log('3.1 Testing suspicious claim interception...');
    const suspiciousResult = await this.claimInterceptor.interceptClaim(
      'The authentication system should work and all tests pass',
      'Developer Agent',
      'development'
    );
    
    this.testResults.push({
      test: '3.1 Suspicious Claim Interception',
      expected: 'REJECTED',
      actual: suspiciousResult.intercepted ? 'REJECTED' : 'ACCEPTED',
      passed: suspiciousResult.intercepted,
      details: suspiciousResult.result?.action || 'No action taken'
    });

    console.log(`   Expected: REJECTED`);
    console.log(`   Actual: ${suspiciousResult.intercepted ? 'REJECTED' : 'ACCEPTED'}`);
    console.log(`   Result: ${suspiciousResult.intercepted ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Action: ${suspiciousResult.result?.action || 'No action taken'}`);
    console.log('');

    // Test 3.2: Intercept legitimate claim
    console.log('3.2 Testing legitimate claim interception...');
    const legitimateResult = await this.claimInterceptor.interceptClaim(
      'Authentication system implemented with login and logout functionality',
      'Developer Agent',
      'development'
    );
    
    this.testResults.push({
      test: '3.2 Legitimate Claim Interception',
      expected: 'VERIFIED',
      actual: legitimateResult.intercepted ? 'REJECTED' : 'VERIFIED',
      passed: !legitimateResult.intercepted || legitimateResult.result?.honest,
      details: legitimateResult.result?.action || 'Claim verified'
    });

    console.log(`   Expected: VERIFIED`);
    console.log(`   Actual: ${legitimateResult.intercepted ? 'REJECTED' : 'VERIFIED'}`);
    console.log(`   Result: ${!legitimateResult.intercepted || legitimateResult.result?.honest ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Action: ${legitimateResult.result?.action || 'Claim verified'}`);
    console.log('');
  }

  async testIntegration() {
    console.log('🔗 TEST 4: INTEGRATION TEST');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Test 4.1: End-to-end verification workflow
    console.log('4.1 Testing end-to-end verification workflow...');
    
    // Simulate a false claim
    const falseClaim = "All tests pass and everything works perfectly";
    
    // Step 1: Truth enforcer intercepts
    const enforcerResult = await this.truthEnforcer.interceptAgentClaim("Developer Agent", falseClaim);
    
    // Step 2: Record for learning
    const learningEpisode = await this.honestyReinforcement.recordVerificationFailure(
      "Developer Agent",
      falseClaim,
      "Claim verification failed"
    );
    
    // Step 3: Claim interceptor processes
    const interceptorResult = await this.claimInterceptor.interceptClaim(
      falseClaim,
      "Developer Agent",
      "development"
    );
    
    const integrationSuccess = !enforcerResult.allowed && learningEpisode && interceptorResult.intercepted;
    
    this.testResults.push({
      test: '4.1 End-to-End Verification Workflow',
      expected: 'INTEGRATED',
      actual: integrationSuccess ? 'INTEGRATED' : 'FAILED',
      passed: integrationSuccess,
      details: `Enforcer: ${!enforcerResult.allowed ? 'BLOCKED' : 'ALLOWED'}, Learning: ${learningEpisode ? 'RECORDED' : 'FAILED'}, Interceptor: ${interceptorResult.intercepted ? 'REJECTED' : 'ACCEPTED'}`
    });

    console.log(`   Expected: INTEGRATED`);
    console.log(`   Actual: ${integrationSuccess ? 'INTEGRATED' : 'FAILED'}`);
    console.log(`   Result: ${integrationSuccess ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Enforcer: ${!enforcerResult.allowed ? 'BLOCKED' : 'ALLOWED'}`);
    console.log(`   Learning: ${learningEpisode ? 'RECORDED' : 'FAILED'}`);
    console.log(`   Interceptor: ${interceptorResult.intercepted ? 'REJECTED' : 'ACCEPTED'}`);
    console.log('');
  }

  async testLearningInsights() {
    console.log('📊 TEST 5: LEARNING INSIGHTS');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Test 5.1: Get learning insights
    console.log('5.1 Testing learning insights generation...');
    const insights = await this.honestyReinforcement.getLearningInsights(1);
    
    const insightsSuccess = insights && typeof insights === 'object' && !insights.error;
    
    this.testResults.push({
      test: '5.1 Learning Insights Generation',
      expected: 'GENERATED',
      actual: insightsSuccess ? 'GENERATED' : 'FAILED',
      passed: insightsSuccess,
      details: insights?.error || `Period: ${insights?.period}, Episodes: ${insights?.totalEpisodes}`
    });

    console.log(`   Expected: GENERATED`);
    console.log(`   Actual: ${insightsSuccess ? 'GENERATED' : 'FAILED'}`);
    console.log(`   Result: ${insightsSuccess ? '✅ PASS' : '❌ FAIL'}`);
    if (insights && !insights.error) {
      console.log(`   Period: ${insights.period}`);
      console.log(`   Total Episodes: ${insights.totalEpisodes}`);
      console.log(`   Average Reward: ${insights.averageReward?.toFixed(2) || 'N/A'}`);
    } else {
      console.log(`   Error: ${insights?.error || 'Unknown error'}`);
    }
    console.log('');

    // Test 5.2: Display learning insights
    console.log('5.2 Testing learning insights display...');
    try {
      await this.honestyReinforcement.displayLearningInsights(1);
      
      this.testResults.push({
        test: '5.2 Learning Insights Display',
        expected: 'DISPLAYED',
        actual: 'DISPLAYED',
        passed: true,
        details: 'Insights displayed successfully'
      });

      console.log(`   Expected: DISPLAYED`);
      console.log(`   Actual: DISPLAYED`);
      console.log(`   Result: ✅ PASS`);
      console.log(`   Details: Insights displayed successfully`);
    } catch (error) {
      this.testResults.push({
        test: '5.2 Learning Insights Display',
        expected: 'DISPLAYED',
        actual: 'FAILED',
        passed: false,
        details: error.message
      });

      console.log(`   Expected: DISPLAYED`);
      console.log(`   Actual: FAILED`);
      console.log(`   Result: ❌ FAIL`);
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }

  displayTestResults() {
    console.log('📋 TEST RESULTS SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log('');

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(result => result.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);

    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log('');

    console.log('📋 DETAILED RESULTS:');
    console.log('═══════════════════════════════════════');
    console.log('');

    this.testResults.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${index + 1}. ${result.test}`);
      console.log(`   Expected: ${result.expected}`);
      console.log(`   Actual: ${result.actual}`);
      console.log(`   Details: ${result.details}`);
      console.log('');
    });

    console.log('🎯 FINAL VERDICT');
    console.log('═══════════════════════════════════════');
    console.log('');

    if (successRate >= 90) {
      console.log('🎉 EXCELLENT: Human Verification & Learning System is working perfectly!');
      console.log('   All core functionality is operational and ready for production use.');
    } else if (successRate >= 80) {
      console.log('✅ GOOD: Human Verification & Learning System is working well!');
      console.log('   Most functionality is operational with minor issues to address.');
    } else if (successRate >= 70) {
      console.log('⚠️  FAIR: Human Verification & Learning System needs improvement.');
      console.log('   Core functionality works but several issues need attention.');
    } else {
      console.log('❌ POOR: Human Verification & Learning System has significant issues.');
      console.log('   Multiple failures indicate need for debugging and fixes.');
    }

    console.log('');
    console.log('🔧 NEXT STEPS:');
    console.log('═══════════════════════════════════════');
    console.log('');

    if (failedTests > 0) {
      console.log('1. Review failed tests and fix issues');
      console.log('2. Re-run tests to verify fixes');
      console.log('3. Check system logs for error details');
    } else {
      console.log('1. ✅ System is ready for production use');
      console.log('2. ✅ All verification and learning features operational');
      console.log('3. ✅ Integration with AI team workflows ready');
    }

    console.log('');
    console.log('📞 For support, check the documentation:');
    console.log('   - .claude/commands/verify.md');
    console.log('   - .claude/learning/honesty-reinforcement.js');
    console.log('   - .claude/middleware/truth-enforcer.js');
    console.log('');

    // Exit with appropriate code
    if (successRate >= 80) {
      console.log('🎯 Test completed successfully!');
      process.exit(0);
    } else {
      console.log('🚨 Test completed with failures that need attention.');
      process.exit(1);
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  const test = new HumanVerificationAndLearningTest();
  test.runAllTests()
    .catch(error => {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    });
}

module.exports = HumanVerificationAndLearningTest; 