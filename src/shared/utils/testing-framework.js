/**
 * Comprehensive Testing Framework
 * Test-driven development framework for Meta Team
 */

const { AuthTestingFramework } = require('../utils/auth-testing-framework');
const { ComprehensiveErrorHandler } = require('../utils/comprehensive-error-handler');
const { ValidationCheckpoints } = require('../utils/validation-checkpoints');
const config = require('../config/testing-config');

class ComprehensiveTestingFramework {
  constructor() {
    this.authFramework = new AuthTestingFramework();
    this.errorHandler = new ComprehensiveErrorHandler();
    this.validation = new ValidationCheckpoints();
    this.testResults = new Map();
    this.testMetrics = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      testDuration: 0
    };
  }

  async runTestSuite(testSuite) {
    console.log(`🧪 Running test suite: ${testSuite.name}`);
    
    const startTime = Date.now();
    const results = {
      suite: testSuite.name,
      tests: [],
      summary: { passed: 0, failed: 0, total: 0 }
    };

    for (const test of testSuite.tests) {
      const testResult = await this.runTest(test);
      results.tests.push(testResult);
      
      if (testResult.passed) {
        results.summary.passed++;
      } else {
        results.summary.failed++;
      }
      results.summary.total++;
    }

    const endTime = Date.now();
    results.duration = endTime - startTime;
    
    this.testResults.set(testSuite.name, results);
    this.updateMetrics(results);
    
    return results;
  }

  async runTest(test) {
    console.log(`  📋 Running test: ${test.name}`);
    
    const startTime = Date.now();
    const result = {
      name: test.name,
      passed: false,
      error: null,
      duration: 0,
      timestamp: new Date()
    };

    try {
      // Pre-test validation
      await this.runPreTestValidation(test);
      
      // Run the test
      const testResult = await test.function();
      
      // Post-test validation
      await this.runPostTestValidation(test, testResult);
      
      result.passed = true;
      result.result = testResult;
      
    } catch (error) {
      result.passed = false;
      result.error = error.message;
      
      // Handle test error
      await this.errorHandler.handleError(error, `test-${test.name}`);
    }

    const endTime = Date.now();
    result.duration = endTime - startTime;
    
    console.log(`    ${result.passed ? '✅' : '❌'} ${test.name}: ${result.passed ? 'PASSED' : 'FAILED'}`);
    
    return result;
  }

  async runPreTestValidation(test) {
    // Validate authentication
    const authStatus = await this.authFramework.getAuthStatus();
    if (!authStatus.results['claude-code']?.success) {
      throw new Error('Authentication validation failed for test');
    }
    
    // Validate environment
    if (!process.env.CLAUDE_API_KEY) {
      throw new Error('Required environment variables not set for test');
    }
  }

  async runPostTestValidation(test, result) {
    // Validate test result structure
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid test result structure');
    }
    
    // Validate required fields
    if (result.success === undefined) {
      throw new Error('Test result missing success field');
    }
  }

  updateMetrics(results) {
    this.testMetrics.totalTests += results.summary.total;
    this.testMetrics.passedTests += results.summary.passed;
    this.testMetrics.failedTests += results.summary.failed;
    this.testMetrics.testDuration += results.duration;
  }

  getTestMetrics() {
    return {
      ...this.testMetrics,
      successRate: this.testMetrics.totalTests > 0 ? 
        (this.testMetrics.passedTests / this.testMetrics.totalTests * 100).toFixed(2) + '%' : '0%'
    };
  }

  async runAllTests() {
    console.log('🧪 Running all test suites...');
    
    const allResults = [];
    
    for (const [suiteName, suite] of this.testResults) {
      const results = await this.runTestSuite(suite);
      allResults.push(results);
    }
    
    return allResults;
  }
}

module.exports = { ComprehensiveTestingFramework };