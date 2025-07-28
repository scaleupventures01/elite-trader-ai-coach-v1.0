/**
 * 🔧 Claude Code Authentication Fix
 * Solution developed by Meta Team to resolve authentication conflicts
 */

const { query } = require('@anthropic-ai/claude-code');
const fs = require('fs');
const path = require('path');

/**
 * Environment Variable Management Fix
 * Unsets conflicting API key when using OAuth
 */
function fixEnvironment() {
  const originalApiKey = process.env.ANTHROPIC_API_KEY;
  
  // Unset conflicting API key when using OAuth
  if (process.env.CLAUDE_CODE_OAUTH_TOKEN && process.env.ANTHROPIC_API_KEY) {
    console.log('⚠️ Unsetting ANTHROPIC_API_KEY to use OAuth authentication');
    delete process.env.ANTHROPIC_API_KEY;
  }
  
  return {
    oauthToken: process.env.CLAUDE_CODE_OAUTH_TOKEN,
    apiKey: originalApiKey,
    useOAuth: !!process.env.CLAUDE_CODE_OAUTH_TOKEN,
    originalApiKey
  };
}

/**
 * Claude Code SDK Authentication Wrapper
 * Handles authentication conflicts automatically
 */
class ClaudeCodeWrapper {
  constructor() {
    this.authMethod = this.detectAuthMethod();
    this.originalApiKey = process.env.ANTHROPIC_API_KEY;
  }

  detectAuthMethod() {
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN) {
      // Temporarily unset API key to use OAuth
      delete process.env.ANTHROPIC_API_KEY;
      
      return {
        type: 'oauth',
        token: process.env.CLAUDE_CODE_OAUTH_TOKEN,
        originalApiKey: this.originalApiKey
      };
    } else if (process.env.ANTHROPIC_API_KEY) {
      return {
        type: 'api_key',
        key: process.env.ANTHROPIC_API_KEY
      };
    } else {
      throw new Error('No authentication method available');
    }
  }

  async query(prompt, options = {}) {
    try {
      // Ensure OAuth is used if available
      if (this.authMethod.type === 'oauth') {
        delete process.env.ANTHROPIC_API_KEY;
      }
      
      console.log(`🔗 Making Claude Code API call (${this.authMethod.type})...`);
      const startTime = Date.now();
      
      const result = await query({
        prompt,
        model: options.model || 'claude-3-5-sonnet-20241022'
      });
      
      const endTime = Date.now();
      console.log(`✅ Claude Code API call completed in ${endTime - startTime}ms`);
      
      return result;
    } catch (error) {
      console.error('❌ Claude Code query failed:', error.message);
      throw error;
    } finally {
      // Restore original API key if it was unset
      if (this.authMethod.originalApiKey) {
        process.env.ANTHROPIC_API_KEY = this.authMethod.originalApiKey;
      }
    }
  }

  async analyzeFile(filePath, prompt, options = {}) {
    const fullPrompt = `Analyze the file ${filePath}:\n\n${prompt}`;
    return await this.query(fullPrompt, options);
  }

  async generateCode(prompt, options = {}) {
    const fullPrompt = `Generate code for the following request:\n\n${prompt}`;
    return await this.query(fullPrompt, options);
  }
}

/**
 * Authentication Configuration Manager
 * Centralizes authentication configuration
 */
class AuthConfigManager {
  constructor() {
    this.configPath = path.join(process.env.HOME, '.claude.json');
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      }
    } catch (error) {
      console.error('Failed to load Claude config:', error.message);
    }
    return {};
  }

  getAuthMethod() {
    // Priority: OAuth Token > API Key > Config File
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN) {
      return {
        type: 'oauth',
        source: 'environment',
        token: process.env.CLAUDE_CODE_OAUTH_TOKEN
      };
    }
    
    if (process.env.ANTHROPIC_API_KEY) {
      return {
        type: 'api_key',
        source: 'environment',
        key: process.env.ANTHROPIC_API_KEY
      };
    }
    
    if (this.config.oauthAccount) {
      return {
        type: 'oauth',
        source: 'config_file',
        account: this.config.oauthAccount
      };
    }
    
    throw new Error('No authentication method found');
  }

  setupEnvironment() {
    const authMethod = this.getAuthMethod();
    
    if (authMethod.type === 'oauth') {
      // Ensure API key doesn't interfere with OAuth
      if (process.env.ANTHROPIC_API_KEY) {
        console.log('⚠️ Unsetting ANTHROPIC_API_KEY to use OAuth');
        delete process.env.ANTHROPIC_API_KEY;
      }
    }
    
    return authMethod;
  }

  getStatus() {
    return {
      oauthToken: !!process.env.CLAUDE_CODE_OAUTH_TOKEN,
      apiKey: !!process.env.ANTHROPIC_API_KEY,
      configFile: !!this.config.oauthAccount,
      authMethod: this.getAuthMethod()
    };
  }
}

/**
 * Test the authentication fix
 */
async function testAuthenticationFix() {
  console.log('🧪 Testing Claude Code Authentication Fix...\n');
  
  try {
    // Test 1: Environment Fix
    console.log('📋 Test 1: Environment Variable Management');
    const envStatus = fixEnvironment();
    console.log(`   OAuth Token: ${envStatus.oauthToken ? '✅' : '❌'}`);
    console.log(`   Use OAuth: ${envStatus.useOAuth ? '✅' : '❌'}`);
    console.log('✅ Environment fix applied\n');

    // Test 2: SDK Wrapper
    console.log('📋 Test 2: SDK Authentication Wrapper');
    const wrapper = new ClaudeCodeWrapper();
    console.log(`   Auth Method: ${wrapper.authMethod.type}`);
    console.log(`   Source: ${wrapper.authMethod.source || 'environment'}`);
    console.log('✅ SDK wrapper created\n');

    // Test 3: Config Manager
    console.log('📋 Test 3: Configuration Manager');
    const configManager = new AuthConfigManager();
    const status = configManager.getStatus();
    console.log(`   OAuth Token: ${status.oauthToken ? '✅' : '❌'}`);
    console.log(`   API Key: ${status.apiKey ? '✅' : '❌'}`);
    console.log(`   Config File: ${status.configFile ? '✅' : '❌'}`);
    console.log(`   Auth Method: ${status.authMethod.type}`);
    console.log('✅ Config manager working\n');

    // Test 4: Actual API Call
    console.log('📋 Test 4: Actual Claude Code API Call');
    const result = await wrapper.query("Write a simple 'Hello World' function in JavaScript");
    
    // Process the streaming response
    let fullResponse = '';
    for await (const message of result.sdkMessages) {
      if (message.type === 'content_block_delta') {
        fullResponse += message.delta.text;
      }
    }
    
    console.log('📋 API Response:');
    console.log('─'.repeat(50));
    console.log(fullResponse.substring(0, 200) + '...');
    console.log('─'.repeat(50));
    console.log('✅ Claude Code API call successful!\n');

    console.log('🎉 ALL TESTS PASSED! Claude Code authentication is working!');
    return true;

  } catch (error) {
    console.error('❌ Authentication fix test failed:', error.message);
    return false;
  }
}

module.exports = {
  fixEnvironment,
  ClaudeCodeWrapper,
  AuthConfigManager,
  testAuthenticationFix
};

// Run test if called directly
if (require.main === module) {
  testAuthenticationFix().then(success => {
    if (success) {
      console.log('\n🚀 Claude Code is ready for Meta Team integration!');
    } else {
      console.log('\n❌ Authentication fix needs more work');
    }
  }).catch(console.error);
} 