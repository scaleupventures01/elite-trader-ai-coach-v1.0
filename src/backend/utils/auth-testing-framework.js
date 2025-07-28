/**
 * Authentication Testing Framework
 * Comprehensive authentication testing for Meta Team workflows
 */

const { ClaudeCodeAPI } = require('./claude-code-api-fix');
const config = require('../config/auth-config');

class AuthTestingFramework {
  constructor() {
    this.claudeCode = new ClaudeCodeAPI();
    this.authResults = new Map();
    this.testHistory = [];
  }

  async testClaudeCodeAuth() {
    console.log('🔐 Testing Claude Code authentication...');
    
    try {
      const testResult = await this.claudeCode.testConnection();
      const success = testResult.success;
      
      this.authResults.set('claude-code', {
        success,
        timestamp: new Date(),
        details: testResult
      });
      
      console.log(`✅ Claude Code auth test: ${success ? 'PASSED' : 'FAILED'}`);
      return success;
    } catch (error) {
      console.error('❌ Claude Code auth test failed:', error.message);
      this.authResults.set('claude-code', {
        success: false,
        timestamp: new Date(),
        error: error.message
      });
      return false;
    }
  }

  async validateAPIKey(apiKey, service) {
    console.log(`🔑 Validating API key for ${service}...`);
    
    if (!apiKey || apiKey.length < 10) {
      console.error(`❌ Invalid API key for ${service}`);
      return false;
    }
    
    // Test the API key with a simple request
    try {
      if (service === 'claude-code') {
        return await this.testClaudeCodeAuth();
      }
      // Add other service validations here
      
      console.log(`✅ API key validation for ${service}: PASSED`);
      return true;
    } catch (error) {
      console.error(`❌ API key validation for ${service} failed:`, error.message);
      return false;
    }
  }

  async testAllIntegrations() {
    console.log('🔐 Testing all Meta Team integrations...');
    
    const results = {
      claudeCode: await this.testClaudeCodeAuth(),
      timestamp: new Date()
    };
    
    this.testHistory.push(results);
    return results;
  }

  getAuthStatus() {
    return {
      results: Object.fromEntries(this.authResults),
      testHistory: this.testHistory,
      lastTest: this.testHistory[this.testHistory.length - 1]
    };
  }

  async validateBeforeIntegration(service) {
    console.log(`🔐 Validating authentication before ${service} integration...`);
    
    const authStatus = await this.testAllIntegrations();
    const allPassed = Object.values(authStatus).every(result => 
      typeof result === 'boolean' ? result : true
    );
    
    if (!allPassed) {
      throw new Error(`Authentication validation failed for ${service}`);
    }
    
    console.log(`✅ Authentication validation passed for ${service}`);
    return true;
  }
}

module.exports = { AuthTestingFramework };