#!/usr/bin/env node

/**
 * 🔑 Claude Code API Key Manager
 * CLI tool to manage and update Claude Code API keys and OAuth tokens
 * 
 * Created by Meta Team - All Teams
 * @version 1.0.0
 * @date 2025-07-27
 */

require('dotenv').config();

// Import our working Claude Code authentication fix
const { ClaudeCodeWrapper, AuthConfigManager, fixEnvironment } = require('./utils/claude-code-auth-fix');

// API Key Validator
class APIKeyValidator {
  static async validateClaudeCodeAuth() {
    try {
      const wrapper = new ClaudeCodeWrapper();
      const result = await wrapper.query("Test authentication");
      
      // Extract response
      let response = '';
      for await (const message of result.sdkMessages) {
        if (message.type === 'content_block_delta') {
          response += message.delta.text;
        }
      }
      
      return {
        valid: true,
        authMethod: wrapper.authMethod.type,
        response: response.substring(0, 100) + '...'
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        suggestions: [
          'Check if OAuth token is set: echo $CLAUDE_CODE_OAUTH_TOKEN',
          'Check if API key is set: echo $ANTHROPIC_API_KEY',
          'Try updating credentials using: node api-key-manager.js update-oauth'
        ]
      };
    }
  }
}

// Key Update Manager
class KeyUpdateManager {
  static async updateOAuthToken() {
    const { execSync } = require('child_process');
    
    try {
      console.log('🔄 Updating OAuth token...');
      console.log('📱 Opening browser for authentication...');
      console.log('💡 Follow the browser flow to authenticate with Claude Code\n');
      
      // Run the setup command
      execSync('npx @anthropic-ai/claude-code setup-token', { 
        stdio: 'inherit' 
      });
      
      console.log('\n✅ OAuth token updated successfully!');
      console.log('💡 Don\'t forget to set the environment variable:');
      console.log('   export CLAUDE_CODE_OAUTH_TOKEN="your_new_token"');
      console.log('\n🔧 Or add it to your .env file:');
      console.log('   CLAUDE_CODE_OAUTH_TOKEN=your_new_token');
      
    } catch (error) {
      console.error('❌ Failed to update OAuth token:', error.message);
      console.log('\n💡 Manual steps:');
      console.log('1. Run: npx @anthropic-ai/claude-code setup-token');
      console.log('2. Follow the browser authentication');
      console.log('3. Copy the generated token');
      console.log('4. Set: export CLAUDE_CODE_OAUTH_TOKEN="your_token"');
    }
  }
  
  static async updateAPIKey() {
    console.log('🔑 To update API key:');
    console.log('1. Visit: https://console.anthropic.com/');
    console.log('2. Navigate to API Keys section');
    console.log('3. Create or copy existing API key');
    console.log('4. Set environment variable:');
    console.log('   export ANTHROPIC_API_KEY="your_new_key"');
    console.log('\n🔧 Or add it to your .env file:');
    console.log('   ANTHROPIC_API_KEY=your_new_key');
  }
}

// Environment Manager
class EnvironmentManager {
  static getCurrentEnvironment() {
    return {
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not Set',
      CLAUDE_CODE_OAUTH_TOKEN: process.env.CLAUDE_CODE_OAUTH_TOKEN ? 'Set' : 'Not Set',
      HOME: process.env.HOME || 'Not Set'
    };
  }
  
  static async updateEnvironmentFile(key, value) {
    const fs = require('fs');
    const path = require('path');
    
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    
    // Read existing .env file
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add the key
    const lines = envContent.split('\n');
    let found = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith(key + '=')) {
        lines[i] = `${key}=${value}`;
        found = true;
        break;
      }
    }
    
    if (!found) {
      lines.push(`${key}=${value}`);
    }
    
    // Write back to file
    fs.writeFileSync(envPath, lines.join('\n'));
    console.log(`✅ Updated .env file with ${key}`);
  }
}

// Main CLI Application
class APIManagerCLI {
  constructor() {
    this.commands = {
      'status': this.showStatus.bind(this),
      'test': this.testAuth.bind(this),
      'update-oauth': this.updateOAuth.bind(this),
      'update-api-key': this.updateAPIKey.bind(this),
      'fix': this.autoFix.bind(this),
      'help': this.showHelp.bind(this)
    };
  }

  async run() {
    const command = process.argv[2] || 'help';
    
    if (this.commands[command]) {
      await this.commands[command]();
    } else {
      console.log(`❌ Unknown command: ${command}`);
      this.showHelp();
    }
  }

  async showStatus() {
    console.log('🔍 Claude Code API Key Status\n');
    console.log('='.repeat(50));

    // Environment variables
    console.log('📋 Environment Variables:');
    const env = EnvironmentManager.getCurrentEnvironment();
    console.log(`   ANTHROPIC_API_KEY: ${env.ANTHROPIC_API_KEY}`);
    console.log(`   CLAUDE_CODE_OAUTH_TOKEN: ${env.CLAUDE_CODE_OAUTH_TOKEN}`);
    console.log(`   HOME: ${env.HOME}`);

    // Configuration file
    console.log('\n📋 Configuration File:');
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(process.env.HOME, '.claude.json');
    
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log(`   Config exists: ✅`);
        console.log(`   OAuth account: ${config.oauthAccount ? '✅' : '❌'}`);
        if (config.oauthAccount?.emailAddress) {
          console.log(`   Account email: ${config.oauthAccount.emailAddress}`);
        }
      } catch (error) {
        console.log(`   Config exists: ✅ (but has errors)`);
      }
    } else {
      console.log(`   Config exists: ❌`);
    }

    // Authentication test
    console.log('\n📋 Authentication Test:');
    const authResult = await APIKeyValidator.validateClaudeCodeAuth();
    console.log(`   Valid: ${authResult.valid ? '✅' : '❌'}`);
    if (authResult.valid) {
      console.log(`   Auth Method: ${authResult.authMethod}`);
    } else {
      console.log(`   Error: ${authResult.error}`);
    }

    // Summary
    console.log('\n📊 Summary:');
    const envOk = env.ANTHROPIC_API_KEY === 'Set' || env.CLAUDE_CODE_OAUTH_TOKEN === 'Set';
    const configOk = fs.existsSync(configPath);
    const authOk = authResult.valid;
    
    console.log(`   Environment: ${envOk ? '✅' : '❌'}`);
    console.log(`   Configuration: ${configOk ? '✅' : '❌'}`);
    console.log(`   Authentication: ${authOk ? '✅' : '❌'}`);
    
    if (authOk) {
      console.log('\n🎉 Your Claude Code API key is working perfectly!');
    } else {
      console.log('\n⚠️ Your Claude Code API key needs attention.');
      console.log('💡 Run: node api-key-manager.js fix');
    }
  }

  async testAuth() {
    console.log('🧪 Testing Claude Code Authentication...\n');
    
    const result = await APIKeyValidator.validateClaudeCodeAuth();
    
    if (result.valid) {
      console.log('✅ Authentication Test: PASSED');
      console.log(`   Auth Method: ${result.authMethod}`);
      console.log(`   Response: ${result.response}`);
      console.log('\n🎉 Your Claude Code API key is working!');
    } else {
      console.log('❌ Authentication Test: FAILED');
      console.log(`   Error: ${result.error}`);
      console.log('\n💡 Suggestions:');
      result.suggestions.forEach(suggestion => {
        console.log(`   - ${suggestion}`);
      });
      console.log('\n🔧 Try running: node api-key-manager.js fix');
    }
  }

  async updateOAuth() {
    console.log('🔄 OAuth Token Update\n');
    console.log('='.repeat(50));
    
    await KeyUpdateManager.updateOAuthToken();
  }

  async updateAPIKey() {
    console.log('🔑 API Key Update\n');
    console.log('='.repeat(50));
    
    await KeyUpdateManager.updateAPIKey();
  }

  async autoFix() {
    console.log('🔧 Auto-Fixing Common Issues...\n');
    console.log('='.repeat(50));

    const env = EnvironmentManager.getCurrentEnvironment();
    let fixesApplied = 0;

    // Check if we have any authentication method
    if (env.ANTHROPIC_API_KEY === 'Not Set' && env.CLAUDE_CODE_OAUTH_TOKEN === 'Not Set') {
      console.log('❌ No authentication method found');
      console.log('💡 You need to set up either:');
      console.log('   1. OAuth token: node api-key-manager.js update-oauth');
      console.log('   2. API key: node api-key-manager.js update-api-key');
      return;
    }

    // If API key is set but OAuth is not, suggest using OAuth
    if (env.ANTHROPIC_API_KEY === 'Set' && env.CLAUDE_CODE_OAUTH_TOKEN === 'Not Set') {
      console.log('⚠️ API key is set but OAuth token is not');
      console.log('💡 OAuth tokens are more secure and recommended');
      console.log('🔧 Run: node api-key-manager.js update-oauth');
      fixesApplied++;
    }

    // Test authentication
    console.log('\n🧪 Testing current authentication...');
    const authResult = await APIKeyValidator.validateClaudeCodeAuth();
    
    if (authResult.valid) {
      console.log('✅ Authentication is working!');
      console.log(`   Auth Method: ${authResult.authMethod}`);
    } else {
      console.log('❌ Authentication is not working');
      console.log(`   Error: ${authResult.error}`);
      
      // Suggest fixes based on error
      if (authResult.error.includes('invalid') || authResult.error.includes('expired')) {
        console.log('\n🔧 Suggested fixes:');
        if (env.CLAUDE_CODE_OAUTH_TOKEN === 'Set') {
          console.log('   1. Update OAuth token: node api-key-manager.js update-oauth');
        }
        if (env.ANTHROPIC_API_KEY === 'Set') {
          console.log('   2. Update API key: node api-key-manager.js update-api-key');
        }
      }
      fixesApplied++;
    }

    // Check configuration file
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(process.env.HOME, '.claude.json');
    
    if (!fs.existsSync(configPath)) {
      console.log('\n⚠️ No Claude configuration file found');
      console.log('🔧 Run: npx @anthropic-ai/claude-code setup-token');
      fixesApplied++;
    }

    if (fixesApplied === 0) {
      console.log('\n🎉 No issues found! Your setup is working correctly.');
    } else {
      console.log(`\n📊 Applied ${fixesApplied} fixes/suggestions`);
    }
  }

  showHelp() {
    console.log('🔑 Claude Code API Key Manager\n');
    console.log('='.repeat(50));
    console.log('Usage: node api-key-manager.js <command>\n');
    
    console.log('Commands:');
    console.log('  status        Check current API key status');
    console.log('  test          Test current API key');
    console.log('  update-oauth  Update OAuth token');
    console.log('  update-api-key Update API key');
    console.log('  fix           Auto-fix common issues');
    console.log('  help          Show this help message\n');
    
    console.log('Examples:');
    console.log('  node api-key-manager.js status');
    console.log('  node api-key-manager.js test');
    console.log('  node api-key-manager.js update-oauth\n');
    
    console.log('💡 Quick Start:');
    console.log('  1. node api-key-manager.js status');
    console.log('  2. node api-key-manager.js test');
    console.log('  3. node api-key-manager.js fix (if needed)');
  }
}

// Run the CLI
if (require.main === module) {
  const cli = new APIManagerCLI();
  cli.run().catch(console.error);
}

module.exports = { APIManagerCLI, APIKeyValidator, KeyUpdateManager, EnvironmentManager }; 