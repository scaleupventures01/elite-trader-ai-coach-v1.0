/**
 * Testing Framework Test
 * Test comprehensive testing framework
 */

const { ComprehensiveTestingFramework } = require('../frameworks/testing-framework');

async function testTestingFramework() {
  console.log('🧪 Testing Comprehensive Testing Framework...\n');
  
  const testingFramework = new ComprehensiveTestingFramework();
  
  try {
    // Create test suite
    const testSuite = {
      name: 'comprehensive-test-suite',
      tests: [
        {
          name: 'authentication-test',
          function: async () => ({ success: true, message: 'Auth test passed' })
        },
        {
          name: 'api-test',
          function: async () => ({ success: true, message: 'API test passed' })
        },
        {
          name: 'validation-test',
          function: async () => ({ success: true, message: 'Validation test passed' })
        }
      ]
    };
    
    // Run test suite
    console.log('📋 Running Test Suite');
    const results = await testingFramework.runTestSuite(testSuite);
    console.log(`Result: ${results.summary.passed}/${results.summary.total} tests passed
`);
    
    // Check metrics
    console.log('📋 Checking Test Metrics');
    const metrics = testingFramework.getTestMetrics();
    console.log('Test Metrics:', metrics);
    console.log(`Result: ✅ METRICS COLLECTED
`);
    
    console.log('🎉 Testing Framework Test Completed!');
    
  } catch (error) {
    console.error('❌ Testing framework test failed:', error.message);
  }
}

if (require.main === module) {
  testTestingFramework().catch(console.error);
}

module.exports = { testTestingFramework };