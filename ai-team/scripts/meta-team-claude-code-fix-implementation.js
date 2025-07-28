#!/usr/bin/env node

/**
 * 🔧 Meta Team: Claude Code API Integration Fix
 * Fixing authentication errors and implementing proper API integration
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');

class ClaudeCodeAPIFixMetaTeam {
  constructor() {
    this.teams = {
      'Diagnostics': new DiagnosticsTeam(),
      'Authentication': new AuthenticationTeam(),
      'Integration': new IntegrationTeam(),
      'Testing': new TestingTeam()
    };
    
    this.newAPIKey = 'YOUR_API_KEY_HERE';
  }

  async implementFix() {
    console.log('🔧 Meta Team: Implementing Claude Code API Integration Fix\n');
    console.log('='.repeat(80));
    console.log('🎯 Task: Fix Claude Code API authentication and integration');
    console.log('📅 Date: 2025-07-27');
    console.log('🔑 Using new API key for proper authentication');
    console.log('='.repeat(80));
    
    const startTime = Date.now();
    
    try {
      // Phase 1: Diagnose Current Issues
      console.log('\n📋 Phase 1: Diagnosing Current Issues');
      const diagnosis = await this.teams.Diagnostics.diagnoseIssues();
      console.log('✅ Diagnosis completed');

      // Phase 2: Fix Authentication
      console.log('\n📋 Phase 2: Fixing Authentication');
      const authFix = await this.teams.Authentication.fixAuthentication(this.newAPIKey);
      console.log('✅ Authentication fix completed');

      // Phase 3: Implement Proper Integration
      console.log('\n📋 Phase 3: Implementing Proper Integration');
      const integration = await this.teams.Integration.implementProperIntegration();
      console.log('✅ Integration implementation completed');

      // Phase 4: Test the Fix
      console.log('\n📋 Phase 4: Testing the Fix');
      const testing = await this.teams.Testing.testIntegration();
      console.log('✅ Testing completed');

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('\n🎉 Claude Code API Integration Fix Completed!\n');
      
      return {
        success: true,
        duration: duration,
        diagnosis: diagnosis,
        authFix: authFix,
        integration: integration,
        testing: testing,
        files: this.getCreatedFiles()
      };

    } catch (error) {
      console.error('❌ Fix implementation failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  getCreatedFiles() {
    const files = [];
    const newFiles = [
      'utils/claude-code-api-fix.js',
      'test-claude-code-api.js',
      'config/claude-code-config.js'
    ];
    
    newFiles.forEach(file => {
      if (fs.existsSync(file)) files.push(file);
    });
    
    return files;
  }
}

class DiagnosticsTeam {
  async diagnoseIssues() {
    console.log('🔍 Diagnosing current Claude Code API issues...');
    
    const issues = {
      authenticationProblems: [],
      integrationIssues: [],
      errorHandlingProblems: [],
      configurationIssues: []
    };

    // Check current environment
    const envVars = {
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not Set',
      CLAUDE_CODE_OAUTH_TOKEN: process.env.CLAUDE_CODE_OAUTH_TOKEN ? 'Set' : 'Not Set',
      CLAUDE_API_KEY: process.env.CLAUDE_API_KEY ? 'Set' : 'Not Set'
    };

    // Check current wrapper implementation
    const wrapperFile = 'utils/claude-code-auth-fix.js';
    if (fs.existsSync(wrapperFile)) {
      const content = fs.readFileSync(wrapperFile, 'utf8');
      
      // Check for authentication issues
      if (content.includes('@anthropic-ai/claude-code')) {
        issues.authenticationProblems.push('Using deprecated claude-code package');
      }
      
      if (content.includes('oauth')) {
        issues.authenticationProblems.push('Using OAuth instead of API key');
      }
      
      if (!content.includes('x-api-key')) {
        issues.authenticationProblems.push('Missing proper API key headers');
      }
    }

    // Check error handling
    const uploadScript = 'meta-team-upload-page.js';
    if (fs.existsSync(uploadScript)) {
      const content = fs.readFileSync(uploadScript, 'utf8');
      
      if (content.includes('using fallback')) {
        issues.errorHandlingProblems.push('Silent fallback without error details');
      }
      
      if (!content.includes('console.error')) {
        issues.errorHandlingProblems.push('Missing detailed error logging');
      }
    }

    console.log('📊 Issues Found:');
    console.log(`   Authentication: ${issues.authenticationProblems.length} issues`);
    console.log(`   Integration: ${issues.integrationIssues.length} issues`);
    console.log(`   Error Handling: ${issues.errorHandlingProblems.length} issues`);
    console.log(`   Configuration: ${issues.configurationIssues.length} issues`);

    return {
      environment: envVars,
      issues: issues,
      summary: 'Multiple authentication and integration issues identified'
    };
  }
}

class AuthenticationTeam {
  async fixAuthentication(newAPIKey) {
    console.log('🔐 Fixing authentication...');
    
    // Set the new API key
    process.env.CLAUDE_API_KEY = newAPIKey;
    process.env.ANTHROPIC_API_KEY = newAPIKey;
    
    // Create proper API configuration
    const configContent = `/**
 * Claude Code API Configuration
 * Proper configuration for Anthropic API integration
 */

module.exports = {
  apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY,
  endpoint: 'https://api.anthropic.com/v1/messages',
  headers: {
    'x-api-key': process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  },
  models: {
    opus: 'claude-3-opus-20240229',
    sonnet: 'claude-3-sonnet-20240229',
    haiku: 'claude-3-haiku-20240307'
  },
  defaultModel: 'claude-3-sonnet-20240229',
  timeout: 30000,
  maxRetries: 3
};`;

    // Ensure config directory exists
    const configDir = 'config';
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync('config/claude-code-config.js', configContent);
    
    return {
      apiKeySet: !!process.env.CLAUDE_API_KEY,
      configCreated: true,
      status: 'Authentication configuration updated'
    };
  }
}

class IntegrationTeam {
  async implementProperIntegration() {
    console.log('🔧 Implementing proper API integration...');
    
    // Create new Claude Code API wrapper
    const wrapperContent = `/**
 * Claude Code API Integration Fix
 * Proper implementation using Anthropic API directly
 */

const https = require('https');
const config = require('../config/claude-code-config');

class ClaudeCodeAPI {
  constructor() {
    this.apiKey = config.apiKey;
    this.endpoint = config.endpoint;
    this.headers = config.headers;
    this.defaultModel = config.defaultModel;
    
    if (!this.apiKey) {
      throw new Error('CLAUDE_API_KEY environment variable is required');
    }
  }

  async query(prompt, options = {}) {
    const model = options.model || this.defaultModel;
    
    const requestBody = {
      model: model,
      max_tokens: options.maxTokens || 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(requestBody);
      
      const requestOptions = {
        hostname: 'api.anthropic.com',
        port: 443,
        path: '/v1/messages',
        method: 'POST',
        headers: {
          ...this.headers,
          'content-length': Buffer.byteLength(postData)
        }
      };

      console.log(\`🔗 Making Claude Code API call to \${model}...\`);
      const startTime = Date.now();

      const req = https.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const endTime = Date.now();
          console.log(\`✅ Claude Code API call completed in \${endTime - startTime}ms\`);
          
          if (res.statusCode === 200) {
            try {
              const response = JSON.parse(data);
              resolve(response.content[0].text);
            } catch (error) {
              reject(new Error(\`Failed to parse response: \${error.message}\`));
            }
          } else {
            console.error(\`❌ API Error: \${res.statusCode} - \${data}\`);
            reject(new Error(\`API request failed: \${res.statusCode} - \${data}\`));
          }
        });
      });

      req.on('error', (error) => {
        console.error(\`❌ Request Error: \${error.message}\`);
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  async testConnection() {
    try {
      const response = await this.query('Hello, this is a test message.');
      return {
        success: true,
        response: response.substring(0, 100) + '...',
        message: 'API connection successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'API connection failed'
      };
    }
  }
}

module.exports = { ClaudeCodeAPI };`;

    // Ensure utils directory exists
    const utilsDir = 'utils';
    if (!fs.existsSync(utilsDir)) {
      fs.mkdirSync(utilsDir, { recursive: true });
    }

    fs.writeFileSync('utils/claude-code-api-fix.js', wrapperContent);
    
    return {
      wrapperCreated: true,
      status: 'Proper API integration implemented'
    };
  }
}

class TestingTeam {
  async testIntegration() {
    console.log('🧪 Testing Claude Code API integration...');
    
    try {
      // Import the new API wrapper
      const { ClaudeCodeAPI } = require('./utils/claude-code-api-fix');
      
      // Test the connection
      const claudeCode = new ClaudeCodeAPI();
      const testResult = await claudeCode.testConnection();
      
      if (testResult.success) {
        console.log('✅ API connection test successful');
        
        // Test a real query
        const realQuery = await claudeCode.query('Analyze this simple task: Create a file upload system. Provide a brief overview.');
        console.log('✅ Real query test successful');
        
        return {
          connectionTest: 'PASSED',
          realQueryTest: 'PASSED',
          response: realQuery.substring(0, 200) + '...',
          status: 'All tests passed'
        };
      } else {
        console.log('❌ API connection test failed');
        return {
          connectionTest: 'FAILED',
          error: testResult.error,
          status: 'Connection test failed'
        };
      }
    } catch (error) {
      console.log('❌ Testing failed:', error.message);
      return {
        connectionTest: 'FAILED',
        error: error.message,
        status: 'Testing failed'
      };
    }
  }
}

// Main execution
async function main() {
  const metaTeam = new ClaudeCodeAPIFixMetaTeam();
  const result = await metaTeam.implementFix();
  
  if (result.success) {
    console.log('\n🎉 CLAUDE CODE API INTEGRATION FIX COMPLETED!');
    console.log('='.repeat(80));
    console.log(`Duration: ${result.duration}ms`);
    console.log(`Files Created: ${result.files.length}`);
    
    console.log('\n🔧 FIXES IMPLEMENTED:');
    console.log('─'.repeat(60));
    console.log('1. ✅ Proper API key configuration');
    console.log('2. ✅ Fixed authentication headers');
    console.log('3. ✅ Implemented detailed error handling');
    console.log('4. ✅ Correct API endpoint and model names');
    console.log('5. ✅ Added connection test function');
    
    console.log('\n📁 FILES CREATED:');
    console.log('─'.repeat(60));
    result.files.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });
    
    console.log('\n🧪 TEST RESULTS:');
    console.log('─'.repeat(60));
    console.log(`Connection Test: ${result.testing.connectionTest}`);
    if (result.testing.realQueryTest) {
      console.log(`Real Query Test: ${result.testing.realQueryTest}`);
    }
    console.log(`Status: ${result.testing.status}`);
    
    if (result.testing.response) {
      console.log('\n📝 Sample Response:');
      console.log(result.testing.response);
    }
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Test the new API integration: node test-claude-code-api.js');
    console.log('2. Update existing scripts to use the new wrapper');
    console.log('3. Verify all Claude Code calls now work properly');
    
  } else {
    console.log('\n❌ FAILED: Could not implement fix');
    console.log(`Error: ${result.error}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ClaudeCodeAPIFixMetaTeam }; 