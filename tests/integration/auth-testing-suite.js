/**
 * Authentication Testing Suite
 * Comprehensive tests for authentication framework
 */

const { AuthTestingFramework } = require('../utils/auth-testing-framework');

async function runAuthTests() {
  console.log('🧪 Running Authentication Test Suite...\n');
  
  const authFramework = new AuthTestingFramework();
  
  try {
    // Test 1: Claude Code Authentication
    console.log('📋 Test 1: Claude Code Authentication');
    const claudeAuth = await authFramework.testClaudeCodeAuth();
    console.log(`Result: ${claudeAuth ? '✅ PASSED' : '❌ FAILED'}\n`);
    
    // Test 2: API Key Validation
    console.log('📋 Test 2: API Key Validation');
    const apiKey = process.env.CLAUDE_API_KEY;
    const keyValidation = await authFramework.validateAPIKey(apiKey, 'claude-code');
    console.log(`Result: ${keyValidation ? '✅ PASSED' : '❌ FAILED'}\n`);
    
    // Test 3: All Integrations Test
    console.log('📋 Test 3: All Integrations Test');
    const allIntegrations = await authFramework.testAllIntegrations();
    console.log(`Result: ${allIntegrations.claudeCode ? '✅ PASSED' : '❌ FAILED'}\n`);
    
    // Test 4: Pre-Integration Validation
    console.log('📋 Test 4: Pre-Integration Validation');
    const preIntegration = await authFramework.validateBeforeIntegration('test-service');
    console.log(`Result: ${preIntegration ? '✅ PASSED' : '❌ FAILED'}\n`);
    
    console.log('🎉 Authentication Test Suite Completed!');
    console.log('📊 Auth Status:', authFramework.getAuthStatus());
    
  } catch (error) {
    console.error('❌ Authentication test suite failed:', error.message);
  }
}

if (require.main === module) {
  runAuthTests().catch(console.error);
}

module.exports = { runAuthTests };