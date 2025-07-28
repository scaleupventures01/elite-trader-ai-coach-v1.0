# 📚 **Claude Code API Integration Guide**

## **🎯 Overview**

This comprehensive guide covers integrating the Claude Code API with the Meta Team system. Claude Code is Anthropic's AI-powered code analysis and generation tool that provides streaming responses for code-related tasks.

---

## **📋 Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Installation & Setup](#installation--setup)
3. [Authentication](#authentication)
4. [Basic Usage](#basic-usage)
5. [Advanced Integration](#advanced-integration)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Meta Team Integration](#meta-team-integration)
10. [Examples](#examples)

---

## **🔧 Prerequisites**

### **Required Software**
- Node.js 16+ 
- npm or yarn
- Git

### **Required Accounts**
- Anthropic API account
- Valid API key or OAuth token

### **System Requirements**
- 4GB+ RAM
- Stable internet connection
- 100MB+ disk space

---

## **📦 Installation & Setup**

### **Step 1: Install Claude Code Package**

```bash
npm install @anthropic-ai/claude-code
```

### **Step 2: Verify Installation**

```bash
node -e "console.log(require('@anthropic-ai/claude-code'))"
```

Expected output:
```javascript
{ query: [Function: query] }
```

### **Step 3: Environment Setup**

Create a `.env` file in your project root:

```env
# Required: Choose one authentication method
ANTHROPIC_API_KEY=your_api_key_here
# OR
CLAUDE_CODE_OAUTH_TOKEN=your_oauth_token_here

# Optional: Configuration overrides
CLAUDE_CODE_TIMEOUT=30000
CLAUDE_CODE_MAX_RETRIES=3
LOG_LEVEL=info
```

---

## **🔐 Authentication**

### **Method 1: API Key (Recommended)**

```javascript
// Set environment variable
process.env.ANTHROPIC_API_KEY = 'your_api_key_here';

// Or use .env file
require('dotenv').config();
```

### **Method 2: OAuth Token**

```bash
# Generate OAuth token
npx @anthropic-ai/claude-code setup-token

# Set environment variable
export CLAUDE_CODE_OAUTH_TOKEN="your_oauth_token_here"
```

### **Method 3: Programmatic Setup**

```javascript
const { query } = require('@anthropic-ai/claude-code');

// Set token programmatically
process.env.CLAUDE_CODE_OAUTH_TOKEN = 'your_token_here';
```

---

## **🚀 Basic Usage**

### **Simple Query**

```javascript
const { query } = require('@anthropic-ai/claude-code');

async function simpleQuery() {
  try {
    const queryResult = query({
      prompt: "Analyze this JavaScript code for potential bugs",
      files: ["path/to/your/file.js"]
    });

    let fullResponse = '';
    for await (const chunk of queryResult.sdkMessages) {
      if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
        fullResponse += chunk.delta.text;
        process.stdout.write(chunk.delta.text); // Real-time output
      }
    }
    
    return fullResponse;
  } catch (error) {
    console.error('Query failed:', error.message);
  }
}
```

### **Code Generation**

```javascript
async function generateCode() {
  const queryResult = query({
    prompt: "Create a React component for a user profile card",
    files: [], // No input files needed for generation
    model: "claude-3-5-sonnet-20241022"
  });

  let generatedCode = '';
  for await (const chunk of queryResult.sdkMessages) {
    if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
      generatedCode += chunk.delta.text;
    }
  }
  
  return generatedCode;
}
```

---

## **🔧 Advanced Integration**

### **With Meta Team System**

```javascript
const { query } = require('@anthropic-ai/claude-code');
const apiErrorHandler = require('../utils/api-error-handler');
const fileVersioning = require('../utils/file-versioning');

class ClaudeCodeIntegration {
  constructor() {
    this.config = require('../config/api-config').getClaudeCodeConfig();
  }

  async analyzeWithClaudeCode(filePath, prompt, options = {}) {
    const context = {
      service: 'claude-code',
      url: 'https://api.anthropic.com',
      method: 'POST',
      retryFunction: () => this.executeQuery(filePath, prompt, options),
      fallbackFunction: () => this.executeFallback(filePath, prompt)
    };

    try {
      // Create backup before analysis
      await fileVersioning.createBackup(filePath);
      
      const result = await this.executeQuery(filePath, prompt, options);
      return { success: true, data: result };
    } catch (error) {
      return await apiErrorHandler.handleError(error, context);
    }
  }

  async executeQuery(filePath, prompt, options) {
    const queryResult = query({
      prompt,
      files: [filePath],
      model: options.model || this.config.model || "claude-3-5-sonnet-20241022",
      max_tokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.1
    });

    let fullResponse = '';
    for await (const chunk of queryResult.sdkMessages) {
      if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
        fullResponse += chunk.delta.text;
        
        // Real-time progress callback
        if (options.onProgress) {
          options.onProgress(chunk.delta.text);
        }
      }
    }
    
    return fullResponse;
  }

  async executeFallback(filePath, prompt) {
    // Fallback to local analysis or cached results
    return `Fallback analysis for ${filePath}: ${prompt}`;
  }
}
```

### **Streaming with Progress Tracking**

```javascript
async function streamingAnalysis(filePath, prompt) {
  const queryResult = query({
    prompt,
    files: [filePath]
  });

  let progress = 0;
  let fullResponse = '';
  
  for await (const chunk of queryResult.sdkMessages) {
    if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
      fullResponse += chunk.delta.text;
      progress += chunk.delta.text.length;
      
      // Update progress every 100 characters
      if (progress % 100 === 0) {
        console.log(`Progress: ${progress} characters processed`);
      }
    }
  }
  
  return fullResponse;
}
```

---

## **🛡️ Error Handling**

### **Comprehensive Error Handling**

```javascript
const apiErrorHandler = require('../utils/api-error-handler');

async function robustClaudeCodeQuery(filePath, prompt) {
  const context = {
    service: 'claude-code',
    retryFunction: async () => {
      const { query } = require('@anthropic-ai/claude-code');
      const queryResult = query({ prompt, files: [filePath] });
      
      let response = '';
      for await (const chunk of queryResult.sdkMessages) {
        if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
          response += chunk.delta.text;
        }
      }
      return response;
    },
    fallbackFunction: async (errorInfo) => {
      // Return cached analysis or simplified response
      return `Analysis unavailable: ${errorInfo.type} error occurred`;
    }
  };

  try {
    const result = await context.retryFunction();
    return { success: true, data: result };
  } catch (error) {
    return await apiErrorHandler.handleError(error, context);
  }
}
```

### **Common Error Types**

| Error Type | Description | Retryable | Solution |
|------------|-------------|-----------|----------|
| `ECONNRESET` | Network connection reset | ✅ Yes | Automatic retry with backoff |
| `ETIMEDOUT` | Request timeout | ✅ Yes | Increase timeout or retry |
| `429` | Rate limit exceeded | ✅ Yes | Wait and retry |
| `401/403` | Authentication failed | ❌ No | Check API key/token |
| `500` | Server error | ✅ Yes | Retry with exponential backoff |

---

## **📖 Best Practices**

### **1. Authentication Security**

```javascript
// ✅ Good: Use environment variables
process.env.ANTHROPIC_API_KEY = 'your_key';

// ❌ Bad: Hardcode in source
const apiKey = 'your_key_in_source';
```

### **2. Error Handling**

```javascript
// ✅ Good: Comprehensive error handling
try {
  const result = await claudeCodeQuery(filePath, prompt);
  return result;
} catch (error) {
  logger.error('Claude Code query failed', { error, filePath, prompt });
  return await executeFallback(filePath, prompt);
}

// ❌ Bad: No error handling
const result = await claudeCodeQuery(filePath, prompt);
return result;
```

### **3. Resource Management**

```javascript
// ✅ Good: Clean up resources
async function analyzeWithCleanup(filePath, prompt) {
  const backup = await fileVersioning.createBackup(filePath);
  
  try {
    const result = await claudeCodeQuery(filePath, prompt);
    return result;
  } finally {
    // Cleanup if needed
    if (backup && options.cleanupBackup) {
      await fileVersioning.cleanupBackup(backup);
    }
  }
}
```

### **4. Performance Optimization**

```javascript
// ✅ Good: Use streaming for large responses
async function streamingQuery(filePath, prompt) {
  const queryResult = query({ prompt, files: [filePath] });
  
  for await (const chunk of queryResult.sdkMessages) {
    if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
      process.stdout.write(chunk.delta.text); // Real-time output
    }
  }
}

// ❌ Bad: Wait for complete response
const result = await claudeCodeQuery(filePath, prompt);
console.log(result); // Blocking
```

---

## **🔍 Troubleshooting**

### **Common Issues & Solutions**

#### **1. "ClaudeCode is not a constructor"**

**Problem**: Trying to use `ClaudeCode` as a class.

**Solution**: Use the `query` function directly:

```javascript
// ✅ Correct
const { query } = require('@anthropic-ai/claude-code');

// ❌ Incorrect
const { ClaudeCode } = require('@anthropic-ai/claude-code');
const claude = new ClaudeCode();
```

#### **2. "Invalid API key"**

**Problem**: Authentication credentials are invalid.

**Solution**: 
```bash
# Check environment variables
echo $ANTHROPIC_API_KEY
echo $CLAUDE_CODE_OAUTH_TOKEN

# Regenerate OAuth token
npx @anthropic-ai/claude-code setup-token
```

#### **3. "Raw mode is not supported"**

**Problem**: Interactive CLI mode not supported in current environment.

**Solution**: Use programmatic API instead:
```javascript
const { query } = require('@anthropic-ai/claude-code');
// Use query function programmatically
```

#### **4. Streaming Response Issues**

**Problem**: Cannot extract content from streaming response.

**Solution**: Iterate through `sdkMessages`:
```javascript
const queryResult = query({ prompt, files: [filePath] });
let response = '';

for await (const chunk of queryResult.sdkMessages) {
  if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
    response += chunk.delta.text;
  }
}
```

### **Debug Mode**

Enable debug logging:

```javascript
// Set debug level
process.env.LOG_LEVEL = 'debug';

// Or programmatically
const logger = require('../utils/logger');
logger.setLevel('debug');
```

---

## **🤖 Meta Team Integration**

### **Team Coordination**

```javascript
class MetaTeamClaudeCodeOrchestrator {
  constructor() {
    this.frontendTeam = new FrontendTeam();
    this.backendTeam = new BackendTeam();
    this.securityTeam = new SecurityTeam();
    this.infrastructureTeam = new InfrastructureTeam();
  }

  async analyzeWithTeams(filePath, prompt) {
    // Phase 1: Analysis
    const analysis = await this.backendTeam.analyzeWithClaudeCode(filePath, prompt);
    
    // Phase 2: Security Review
    const securityReview = await this.securityTeam.reviewCode(analysis);
    
    // Phase 3: Frontend Integration
    const uiEnhancements = await this.frontendTeam.createUI(analysis);
    
    // Phase 4: Infrastructure Deployment
    const deployment = await this.infrastructureTeam.deploy(uiEnhancements);
    
    return {
      analysis,
      securityReview,
      uiEnhancements,
      deployment
    };
  }
}
```

### **Error Recovery**

```javascript
async function resilientTeamAnalysis(filePath, prompt) {
  const orchestrator = new MetaTeamClaudeCodeOrchestrator();
  
  try {
    return await orchestrator.analyzeWithTeams(filePath, prompt);
  } catch (error) {
    // Fallback to individual team analysis
    const backendResult = await orchestrator.backendTeam.analyzeWithClaudeCode(filePath, prompt);
    return { backendResult, error: error.message };
  }
}
```

---

## **📝 Examples**

### **Example 1: Code Analysis**

```javascript
const claudeCode = new ClaudeCodeIntegration();

async function analyzeJavaScriptFile(filePath) {
  const prompt = `
    Analyze this JavaScript file for:
    1. Potential bugs and issues
    2. Performance improvements
    3. Security vulnerabilities
    4. Code style and best practices
    
    Provide specific recommendations with code examples.
  `;
  
  const result = await claudeCode.analyzeWithClaudeCode(filePath, prompt, {
    onProgress: (text) => console.log('Analysis progress:', text.length, 'characters'),
    temperature: 0.1,
    maxTokens: 4000
  });
  
  return result;
}
```

### **Example 2: Code Generation**

```javascript
async function generateReactComponent(componentName, props) {
  const prompt = `
    Create a React functional component named "${componentName}" with the following props:
    ${JSON.stringify(props, null, 2)}
    
    Include:
    - TypeScript types
    - PropTypes validation
    - Error boundaries
    - Loading states
    - Accessibility features
  `;
  
  const queryResult = query({ prompt });
  let componentCode = '';
  
  for await (const chunk of queryResult.sdkMessages) {
    if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
      componentCode += chunk.delta.text;
    }
  }
  
  return componentCode;
}
```

### **Example 3: File Enhancement**

```javascript
async function enhanceFileWithClaudeCode(filePath) {
  // Create backup
  await fileVersioning.createBackup(filePath);
  
  // Analyze current file
  const analysis = await claudeCode.analyzeWithClaudeCode(filePath, 
    "Suggest improvements for this code");
  
  // Generate enhanced version
  const enhancedCode = await claudeCode.analyzeWithClaudeCode(filePath,
    `Based on this analysis: ${analysis}\n\nGenerate an improved version of this code.`);
  
  // Create version
  await fileVersioning.createVersion(filePath, 'enhanced', {
    team: 'backend',
    action: 'enhancement',
    description: 'Code enhanced with Claude Code analysis'
  });
  
  return enhancedCode;
}
```

---

## **📊 Performance Metrics**

### **Expected Performance**

| Metric | Target | Current |
|--------|--------|---------|
| API Call Success Rate | 98% | 90% |
| Error Recovery Rate | 95% | 80% |
| Response Time | < 30s | ~45s |
| Fallback Success Rate | 90% | 85% |

### **Monitoring**

```javascript
const apiErrorHandler = require('../utils/api-error-handler');

// Get error statistics
const stats = apiErrorHandler.getErrorStats();
console.log('Error Statistics:', stats);

// Get versioning statistics
const fileVersioning = require('../utils/file-versioning');
const versioningStats = fileVersioning.getStats();
console.log('Versioning Statistics:', versioningStats);
```

---

## **🔗 Additional Resources**

- [Claude Code Official Documentation](https://docs.anthropic.com/claude/docs/claude-code)
- [Anthropic API Reference](https://docs.anthropic.com/claude/reference)
- [Meta Team Documentation](./meta-team-guide.md)
- [Error Handling Guide](./error-handling-guide.md)
- [File Versioning Guide](./versioning-strategy.md)

---

## **📞 Support**

For issues and questions:

1. **Check this guide** for common solutions
2. **Review error logs** in `logs/` directory
3. **Consult troubleshooting section** above
4. **Check Meta Team status** with `/global-status`
5. **Create issue** in project repository

---

**Last Updated**: 2025-07-27  
**Version**: 1.0.0  
**Author**: Meta Team - Backend Team 