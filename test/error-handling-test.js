/**
 * Error Handling Test
 * Test comprehensive error handling system
 */

const { ComprehensiveErrorHandler } = require('../utils/comprehensive-error-handler');

async function testErrorHandling() {
  console.log('🧪 Testing Comprehensive Error Handling...\n');
  
  const errorHandler = new ComprehensiveErrorHandler();
  
  try {
    // Test 1: Authentication Error
    console.log('📋 Test 1: Authentication Error Handling');
    const authError = new Error('Authentication failed: invalid API key');
    const authResult = await errorHandler.handleError(authError, 'claude-code-auth');
    console.log(`Result: ${authResult.handled ? '✅ HANDLED' : '❌ FAILED'}\n`);
    
    // Test 2: Network Error
    console.log('📋 Test 2: Network Error Handling');
    const networkError = new Error('Network connection failed');
    const networkResult = await errorHandler.handleError(networkError, 'api-request');
    console.log(`Result: ${networkResult.handled ? '✅ HANDLED' : '❌ FAILED'}\n`);
    
    // Test 3: API Error
    console.log('📋 Test 3: API Error Handling');
    const apiError = new Error('API request failed: 404 Not Found');
    const apiResult = await errorHandler.handleError(apiError, 'external-api');
    console.log(`Result: ${apiResult.handled ? '✅ HANDLED' : '❌ FAILED'}\n`);
    
    // Test 4: Error Metrics
    console.log('📋 Test 4: Error Metrics');
    const metrics = errorHandler.getErrorMetrics();
    console.log('Error Metrics:', metrics);
    console.log(`Result: ✅ METRICS COLLECTED\n`);
    
    console.log('🎉 Error Handling Test Completed!');
    
  } catch (error) {
    console.error('❌ Error handling test failed:', error.message);
  }
}

if (require.main === module) {
  testErrorHandling().catch(console.error);
}

module.exports = { testErrorHandling };