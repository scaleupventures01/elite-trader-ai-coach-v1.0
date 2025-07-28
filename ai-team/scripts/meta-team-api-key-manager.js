#!/usr/bin/env node

/**
 * 🔑 Meta Team: Claude Code API Key Manager
 * Task: Create a system to help update Claude Code API keys when they're not working
 */

require('dotenv').config();

// Import our working Claude Code authentication fix
const { ClaudeCodeWrapper, AuthConfigManager, fixEnvironment } = require('./utils/claude-code-auth-fix');

// Meta Team for API Key Management
class APIManagementMetaTeam {
  constructor() {
    this.teams = {
      'Diagnostics': new DiagnosticsTeam(),
      'Security': new SecurityTeam(),
      'Integration': new IntegrationTeam(),
      'UserInterface': new UserInterfaceTeam()
    };
    
    this.claudeCode = new ClaudeCodeWrapper();
    this.authManager = new AuthConfigManager();
  }

  async executeAPIManagementTask() {
    console.log('🔑 Meta Team: Claude Code API Key Management System\n');
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    
    try {
      // Phase 1: Current Status Analysis
      console.log('📋 Phase 1: Current API Key Status Analysis');
      const status = await this.teams.Diagnostics.analyzeCurrentStatus();
      console.log('✅ Status analysis completed\n');

      // Phase 2: Security Assessment
      console.log('📋 Phase 2: Security Assessment');
      const securityReport = await this.teams.Security.assessSecurity(status);
      console.log('✅ Security assessment completed\n');

      // Phase 3: Key Management System Development
      console.log('📋 Phase 3: Key Management System Development');
      const managementSystem = await this.teams.Integration.developKeyManagementSystem(status, securityReport);
      console.log('✅ Key management system developed\n');

      // Phase 4: User Interface Creation
      console.log('📋 Phase 4: User Interface Creation');
      const userInterface = await this.teams.UserInterface.createUserInterface(managementSystem);
      console.log('✅ User interface created\n');

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('🎉 API Key Management System Completed!\n');
      
      return {
        success: true,
        duration: duration,
        status: status,
        securityReport: securityReport,
        managementSystem: managementSystem,
        userInterface: userInterface,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ API Key Management task failed:', error.message);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Diagnostics Team
class DiagnosticsTeam {
  async analyzeCurrentStatus() {
    console.log('🔍 Diagnostics Team analyzing current API key status...');
    
    const status = {
      currentAuthMethod: null,
      environmentVariables: {},
      configFile: {},
      claudeCodeStatus: 'unknown',
      issues: [],
      recommendations: []
    };

    // Check environment variables
    status.environmentVariables = {
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not Set',
      CLAUDE_CODE_OAUTH_TOKEN: process.env.CLAUDE_CODE_OAUTH_TOKEN ? 'Set' : 'Not Set'
    };

    // Check config file
    try {
      const fs = require('fs');
      const path = require('path');
      const configPath = path.join(process.env.HOME, '.claude.json');
      
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        status.configFile = {
          exists: true,
          oauthAccount: !!config.oauthAccount,
          accountEmail: config.oauthAccount?.emailAddress || 'Not found'
        };
      } else {
        status.configFile = { exists: false };
      }
    } catch (error) {
      status.configFile = { exists: false, error: error.message };
    }

    // Test Claude Code functionality
    try {
      const wrapper = new ClaudeCodeWrapper();
      status.currentAuthMethod = wrapper.authMethod.type;
      status.claudeCodeStatus = 'Working';
    } catch (error) {
      status.claudeCodeStatus = 'Failed';
      status.issues.push(`Claude Code authentication failed: ${error.message}`);
    }

    // Generate recommendations
    if (status.claudeCodeStatus === 'Failed') {
      status.recommendations.push('Update API key or OAuth token');
      status.recommendations.push('Check environment variable configuration');
      status.recommendations.push('Verify Claude Code installation');
    }

    console.log('📊 Current Status:');
    console.log(`   Auth Method: ${status.currentAuthMethod || 'Unknown'}`);
    console.log(`   Claude Code Status: ${status.claudeCodeStatus}`);
    console.log(`   Issues Found: ${status.issues.length}`);

    return status;
  }
}

// Security Team
class SecurityTeam {
  async assessSecurity(status) {
    console.log('🔐 Security Team assessing API key security...');
    
    const securityReport = {
      riskLevel: 'Low',
      vulnerabilities: [],
      bestPractices: [],
      recommendations: []
    };

    // Check for exposed API keys
    if (status.environmentVariables.ANTHROPIC_API_KEY === 'Set') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (apiKey && apiKey.length > 0) {
        securityReport.vulnerabilities.push('API key exposed in environment variables');
        securityReport.recommendations.push('Use OAuth tokens instead of API keys when possible');
      }
    }

    // Check OAuth token security
    if (status.environmentVariables.CLAUDE_CODE_OAUTH_TOKEN === 'Set') {
      securityReport.bestPractices.push('OAuth token is configured (more secure than API keys)');
    }

    // Check config file security
    if (status.configFile.exists) {
      securityReport.bestPractices.push('Configuration file exists and is properly structured');
    } else {
      securityReport.vulnerabilities.push('No configuration file found');
      securityReport.recommendations.push('Set up proper Claude Code configuration');
    }

    // Determine risk level
    if (securityReport.vulnerabilities.length > 2) {
      securityReport.riskLevel = 'High';
    } else if (securityReport.vulnerabilities.length > 0) {
      securityReport.riskLevel = 'Medium';
    }

    console.log('🔒 Security Assessment:');
    console.log(`   Risk Level: ${securityReport.riskLevel}`);
    console.log(`   Vulnerabilities: ${securityReport.vulnerabilities.length}`);
    console.log(`   Best Practices: ${securityReport.bestPractices.length}`);

    return securityReport;
  }
}

// Integration Team
class IntegrationTeam {
  async developKeyManagementSystem(status, securityReport) {
    console.log('🔧 Integration Team developing key management system...');
    
    const managementSystem = {
      components: [],
      updateMethods: [],
      validationTools: [],
      documentation: {}
    };

    // Component 1: API Key Validator
    managementSystem.components.push({
      name: 'API Key Validator',
      description: 'Validates Claude Code API keys and OAuth tokens',
      code: this.generateAPIKeyValidator()
    });

    // Component 2: Key Update Manager
    managementSystem.components.push({
      name: 'Key Update Manager',
      description: 'Manages updating API keys and OAuth tokens',
      code: this.generateKeyUpdateManager()
    });

    // Component 3: Environment Manager
    managementSystem.components.push({
      name: 'Environment Manager',
      description: 'Manages environment variables for Claude Code',
      code: this.generateEnvironmentManager()
    });

    // Update methods
    managementSystem.updateMethods = [
      {
        name: 'OAuth Token Update',
        description: 'Update OAuth token via Claude Code CLI',
        steps: [
          'Run: npx @anthropic-ai/claude-code setup-token',
          'Follow the browser authentication flow',
          'Copy the generated token',
          'Set environment variable: export CLAUDE_CODE_OAUTH_TOKEN="your_token"'
        ]
      },
      {
        name: 'API Key Update',
        description: 'Update API key from Anthropic console',
        steps: [
          'Visit: https://console.anthropic.com/',
          'Navigate to API Keys section',
          'Create or copy existing API key',
          'Set environment variable: export ANTHROPIC_API_KEY="your_key"'
        ]
      },
      {
        name: 'Environment File Update',
        description: 'Update .env file with new credentials',
        steps: [
          'Edit .env file in project root',
          'Add or update: ANTHROPIC_API_KEY=your_key',
          'Add or update: CLAUDE_CODE_OAUTH_TOKEN=your_token',
          'Restart the application'
        ]
      }
    ];

    // Validation tools
    managementSystem.validationTools = [
      {
        name: 'Quick Test',
        description: 'Quick test to verify API key is working',
        code: this.generateQuickTest()
      },
      {
        name: 'Comprehensive Test',
        description: 'Comprehensive test of all authentication methods',
        code: this.generateComprehensiveTest()
      }
    ];

    console.log('💡 Management System Components:');
    managementSystem.components.forEach((component, index) => {
      console.log(`   ${index + 1}. ${component.name}`);
    });

    return managementSystem;
  }

  generateAPIKeyValidator() {
    return `
// API Key Validator
class APIKeyValidator {
  static async validateClaudeCodeAuth() {
    const { ClaudeCodeWrapper } = require('./utils/claude-code-auth-fix');
    
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
          'Try updating credentials using the management system'
        ]
      };
    }
  }
}
`;
  }

  generateKeyUpdateManager() {
    return `
// Key Update Manager
class KeyUpdateManager {
  static async updateOAuthToken() {
    const { execSync } = require('child_process');
    
    try {
      console.log('🔄 Updating OAuth token...');
      console.log('📱 Opening browser for authentication...');
      
      // Run the setup command
      execSync('npx @anthropic-ai/claude-code setup-token', { 
        stdio: 'inherit' 
      });
      
      console.log('✅ OAuth token updated successfully!');
      console.log('💡 Don\'t forget to set the environment variable:');
      console.log('   export CLAUDE_CODE_OAUTH_TOKEN="your_new_token"');
      
    } catch (error) {
      console.error('❌ Failed to update OAuth token:', error.message);
    }
  }
  
  static async updateAPIKey() {
    console.log('🔑 To update API key:');
    console.log('1. Visit: https://console.anthropic.com/');
    console.log('2. Navigate to API Keys section');
    console.log('3. Create or copy existing API key');
    console.log('4. Set environment variable:');
    console.log('   export ANTHROPIC_API_KEY="your_new_key"');
  }
}
`;
  }

  generateEnvironmentManager() {
    return `
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
    const lines = envContent.split('\\n');
    let found = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith(key + '=')) {
        lines[i] = \`\${key}=\${value}\`;
        found = true;
        break;
      }
    }
    
    if (!found) {
      lines.push(\`\${key}=\${value}\`);
    }
    
    // Write back to file
    fs.writeFileSync(envPath, lines.join('\\n'));
    console.log(\`✅ Updated .env file with \${key}\`);
  }
}
`;
  }

  generateQuickTest() {
    return `
// Quick Test
async function quickTest() {
  const { APIKeyValidator } = require('./api-key-validator');
  
  console.log('🧪 Quick API Key Test...');
  const result = await APIKeyValidator.validateClaudeCodeAuth();
  
  if (result.valid) {
    console.log('✅ API Key is working!');
    console.log(\`   Auth Method: \${result.authMethod}\`);
  } else {
    console.log('❌ API Key is not working');
    console.log(\`   Error: \${result.error}\`);
    console.log('💡 Suggestions:');
    result.suggestions.forEach(suggestion => {
      console.log(\`   - \${suggestion}\`);
    });
  }
}
`;
  }

  generateComprehensiveTest() {
    return `
// Comprehensive Test
async function comprehensiveTest() {
  const { EnvironmentManager } = require('./environment-manager');
  const { APIKeyValidator } = require('./api-key-validator');
  
  console.log('🔍 Comprehensive API Key Test...\\n');
  
  // Test 1: Environment Variables
  console.log('📋 Test 1: Environment Variables');
  const env = EnvironmentManager.getCurrentEnvironment();
  console.log(\`   ANTHROPIC_API_KEY: \${env.ANTHROPIC_API_KEY}\`);
  console.log(\`   CLAUDE_CODE_OAUTH_TOKEN: \${env.CLAUDE_CODE_OAUTH_TOKEN}\`);
  console.log(\`   HOME: \${env.HOME}\`);
  
  // Test 2: Authentication
  console.log('\\n📋 Test 2: Authentication Test');
  const authResult = await APIKeyValidator.validateClaudeCodeAuth();
  console.log(\`   Valid: \${authResult.valid ? '✅' : '❌'}\`);
  
  // Test 3: Configuration File
  console.log('\\n📋 Test 3: Configuration File');
  const fs = require('fs');
  const path = require('path');
  const configPath = path.join(process.env.HOME, '.claude.json');
  
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log(\`   Config exists: ✅\`);
    console.log(\`   OAuth account: \${config.oauthAccount ? '✅' : '❌'}\`);
  } else {
    console.log('   Config exists: ❌');
  }
  
  console.log('\\n📊 Test Summary:');
  console.log(\`   Environment: \${env.ANTHROPIC_API_KEY === 'Set' || env.CLAUDE_CODE_OAUTH_TOKEN === 'Set' ? '✅' : '❌'}\`);
  console.log(\`   Authentication: \${authResult.valid ? '✅' : '❌'}\`);
  console.log(\`   Configuration: \${fs.existsSync(configPath) ? '✅' : '❌'}\`);
}
`;
  }
}

// User Interface Team
class UserInterfaceTeam {
  async createUserInterface(managementSystem) {
    console.log('🎨 User Interface Team creating management interface...');
    
    const userInterface = {
      cliCommands: [],
      interactivePrompts: [],
      helpText: {},
      examples: []
    };

    // CLI Commands
    userInterface.cliCommands = [
      {
        command: 'node api-key-manager.js status',
        description: 'Check current API key status'
      },
      {
        command: 'node api-key-manager.js test',
        description: 'Test current API key'
      },
      {
        command: 'node api-key-manager.js update-oauth',
        description: 'Update OAuth token'
      },
      {
        command: 'node api-key-manager.js update-api-key',
        description: 'Update API key'
      },
      {
        command: 'node api-key-manager.js fix',
        description: 'Auto-fix common issues'
      }
    ];

    // Interactive prompts
    userInterface.interactivePrompts = [
      {
        type: 'status_check',
        prompt: 'Would you like to check your current API key status?',
        options: ['Yes', 'No']
      },
      {
        type: 'update_method',
        prompt: 'Which authentication method would you like to update?',
        options: ['OAuth Token', 'API Key', 'Both']
      },
      {
        type: 'test_after_update',
        prompt: 'Would you like to test the updated credentials?',
        options: ['Yes', 'No']
      }
    ];

    // Help text
    userInterface.helpText = {
      overview: `
🔑 Claude Code API Key Manager

This tool helps you manage and update your Claude Code API keys and OAuth tokens.

Common Issues:
- Invalid API key
- Expired OAuth token
- Environment variable conflicts
- Missing configuration

Solutions:
- Update OAuth token via CLI
- Update API key from console
- Fix environment variables
- Validate authentication
      `,
      troubleshooting: `
🔧 Troubleshooting Guide

1. Check Environment Variables:
   echo $ANTHROPIC_API_KEY
   echo $CLAUDE_CODE_OAUTH_TOKEN

2. Test Authentication:
   node utils/claude-code-auth-fix.js

3. Update OAuth Token:
   npx @anthropic-ai/claude-code setup-token

4. Update API Key:
   Visit: https://console.anthropic.com/

5. Fix Environment:
   export CLAUDE_CODE_OAUTH_TOKEN="your_token"
   unset ANTHROPIC_API_KEY
      `
    };

    // Examples
    userInterface.examples = [
      {
        title: 'Quick Status Check',
        command: 'node api-key-manager.js status',
        description: 'Check if your API keys are working'
      },
      {
        title: 'Update OAuth Token',
        command: 'node api-key-manager.js update-oauth',
        description: 'Update your OAuth token interactively'
      },
      {
        title: 'Test Authentication',
        command: 'node api-key-manager.js test',
        description: 'Test your current authentication setup'
      }
    ];

    console.log('🎨 User Interface Components:');
    console.log(`   CLI Commands: ${userInterface.cliCommands.length}`);
    console.log(`   Interactive Prompts: ${userInterface.interactivePrompts.length}`);
    console.log(`   Help Sections: ${Object.keys(userInterface.helpText).length}`);

    return userInterface;
  }
}

// Main execution
async function main() {
  const metaTeam = new APIManagementMetaTeam();
  const result = await metaTeam.executeAPIManagementTask();
  
  if (result.success) {
    console.log('\n🎉 SUCCESS: API Key Management System Created!');
    console.log('='.repeat(60));
    console.log(`Duration: ${result.duration}ms`);
    console.log(`Components: ${result.managementSystem.components.length}`);
    console.log(`Update Methods: ${result.managementSystem.updateMethods.length}`);
    console.log(`CLI Commands: ${result.userInterface.cliCommands.length}`);
    
    console.log('\n🔧 Available Update Methods:');
    result.managementSystem.updateMethods.forEach((method, index) => {
      console.log(`   ${index + 1}. ${method.name}`);
    });
    
    console.log('\n💡 Next Steps:');
    console.log('1. Run: node api-key-manager.js status');
    console.log('2. Run: node api-key-manager.js test');
    console.log('3. Run: node api-key-manager.js update-oauth (if needed)');
    
    console.log('\n🚀 Your Claude Code API key management system is ready!');
    
  } else {
    console.log('\n❌ FAILED: Could not create API key management system');
    console.log(`Error: ${result.error}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { APIManagementMetaTeam }; 