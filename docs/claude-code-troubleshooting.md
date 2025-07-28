# 🔍 **Claude Code Troubleshooting Guide**

## **🎯 Overview**

This troubleshooting guide provides solutions for common issues encountered when integrating Claude Code with the Meta Team system. Each section includes error descriptions, root causes, and step-by-step solutions.

---

## **📋 Quick Reference**

| Issue | Section | Priority |
|-------|---------|----------|
| Authentication errors | [Authentication Issues](#authentication-issues) | High |
| Streaming response problems | [Streaming Issues](#streaming-issues) | High |
| Rate limiting | [Rate Limiting](#rate-limiting) | Medium |
| Network connectivity | [Network Issues](#network-issues) | Medium |
| Model errors | [Model Issues](#model-issues) | Medium |
| File handling | [File Issues](#file-issues) | Low |

---

## **🔐 Authentication Issues**

### **Error: "Invalid API key"**

**Symptoms:**
- `Error: Invalid API key`
- `401 Unauthorized`
- `403 Forbidden`

**Root Cause:**
- Invalid or expired API key
- Incorrect environment variable setup
- Missing authentication credentials

**Solutions:**

#### **1. Verify API Key**
```bash
# Check if API key is set
echo $ANTHROPIC_API_KEY

# Check if OAuth token is set
echo $CLAUDE_CODE_OAUTH_TOKEN
```

#### **2. Regenerate API Key**
```bash
# Visit Anthropic Console
open https://console.anthropic.com/

# Generate new API key
# Copy and set environment variable
export ANTHROPIC_API_KEY="your_new_api_key_here"
```

#### **3. Set Up OAuth Token**
```bash
# Generate OAuth token
npx @anthropic-ai/claude-code setup-token

# Set environment variable
export CLAUDE_CODE_OAUTH_TOKEN="your_oauth_token_here"
```

#### **4. Update .env File**
```env
# .env file
ANTHROPIC_API_KEY=your_api_key_here
# OR
CLAUDE_CODE_OAUTH_TOKEN=your_oauth_token_here
```

#### **5. Test Authentication**
```javascript
// Test script
const { query } = require('@anthropic-ai/claude-code');

async function testAuth() {
  try {
    const result = query({ prompt: "Hello", files: [] });
    console.log('Authentication successful');
  } catch (error) {
    console.error('Authentication failed:', error.message);
  }
}

testAuth();
```

---

## **🌊 Streaming Issues**

### **Error: "Cannot read property 'sdkMessages' of undefined"**

**Symptoms:**
- `TypeError: Cannot read property 'sdkMessages' of undefined`
- Empty response from Claude Code
- Streaming not working

**Root Cause:**
- Incorrect handling of streaming response
- Missing await on query function
- Response object structure changed

**Solutions:**

#### **1. Correct Streaming Implementation**
```javascript
// ✅ Correct
const { query } = require('@anthropic-ai/claude-code');

async function correctStreaming() {
  const queryResult = query({
    prompt: "Analyze this code",
    files: ["file.js"]
  });

  let response = '';
  for await (const chunk of queryResult.sdkMessages) {
    if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
      response += chunk.delta.text;
    }
  }
  return response;
}

// ❌ Incorrect
const result = await query({ prompt: "Hello" });
console.log(result.sdkMessages); // This won't work
```

#### **2. Handle Different Response Types**
```javascript
async function robustStreaming() {
  try {
    const queryResult = query({
      prompt: "Analyze this code",
      files: ["file.js"]
    });

    let response = '';
    
    // Handle streaming response
    if (queryResult.sdkMessages) {
      for await (const chunk of queryResult.sdkMessages) {
        if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
          response += chunk.delta.text;
        }
      }
    } else {
      // Handle non-streaming response
      response = queryResult.toString();
    }
    
    return response;
  } catch (error) {
    console.error('Streaming error:', error);
    throw error;
  }
}
```

#### **3. Debug Streaming Response**
```javascript
async function debugStreaming() {
  const queryResult = query({ prompt: "Hello" });
  
  console.log('Query result type:', typeof queryResult);
  console.log('Query result keys:', Object.keys(queryResult));
  
  if (queryResult.sdkMessages) {
    console.log('sdkMessages available');
    for await (const chunk of queryResult.sdkMessages) {
      console.log('Chunk:', chunk);
    }
  } else {
    console.log('No sdkMessages, using fallback');
  }
}
```

---

## **⏱️ Rate Limiting**

### **Error: "Rate limit exceeded"**

**Symptoms:**
- `429 Too Many Requests`
- `Rate limit exceeded`
- Requests failing intermittently

**Root Cause:**
- Too many requests in short time
- Exceeded API rate limits
- No retry mechanism

**Solutions:**

#### **1. Implement Exponential Backoff**
```javascript
const RetryStrategy = require('../utils/retry-strategy');

async function rateLimitRetry() {
  const strategy = RetryStrategy.createForService('claude-code');
  
  return await strategy.execute(async () => {
    const { query } = require('@anthropic-ai/claude-code');
    const result = query({ prompt: "Hello" });
    
    let response = '';
    for await (const chunk of result.sdkMessages) {
      if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
        response += chunk.delta.text;
      }
    }
    return response;
  });
}
```

#### **2. Add Request Throttling**
```javascript
class RequestThrottler {
  constructor(maxRequests = 60, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async throttle(fn) {
    const now = Date.now();
    
    // Remove old requests
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    // Check if we can make a request
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // Add current request
    this.requests.push(now);
    
    // Execute function
    return await fn();
  }
}

const throttler = new RequestThrottler(60, 60000); // 60 requests per minute
```

#### **3. Monitor Rate Limits**
```javascript
async function monitorRateLimits() {
  const headers = {}; // Store response headers
  
  try {
    const result = query({ prompt: "Hello" });
    
    // Monitor rate limit headers
    if (result.headers) {
      const remaining = result.headers['x-ratelimit-remaining'];
      const reset = result.headers['x-ratelimit-reset'];
      
      console.log(`Remaining requests: ${remaining}`);
      console.log(`Reset time: ${new Date(reset * 1000)}`);
    }
  } catch (error) {
    if (error.status === 429) {
      console.log('Rate limit exceeded, waiting...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}
```

---

## **🌐 Network Issues**

### **Error: "ECONNRESET" or "ENOTFOUND"**

**Symptoms:**
- `ECONNRESET`
- `ENOTFOUND`
- `ETIMEDOUT`
- Connection refused

**Root Cause:**
- Network connectivity issues
- DNS resolution problems
- Firewall blocking requests
- Proxy configuration

**Solutions:**

#### **1. Check Network Connectivity**
```bash
# Test basic connectivity
ping api.anthropic.com

# Test DNS resolution
nslookup api.anthropic.com

# Test HTTP connectivity
curl -I https://api.anthropic.com
```

#### **2. Configure Proxy (if needed)**
```javascript
// Set proxy environment variables
process.env.HTTP_PROXY = 'http://proxy.company.com:8080';
process.env.HTTPS_PROXY = 'http://proxy.company.com:8080';

// Or configure in .env file
// HTTP_PROXY=http://proxy.company.com:8080
// HTTPS_PROXY=http://proxy.company.com:8080
```

#### **3. Implement Network Retry**
```javascript
const apiErrorHandler = require('../utils/api-error-handler');

async function networkRetry() {
  const context = {
    service: 'claude-code',
    retryFunction: async () => {
      const { query } = require('@anthropic-ai/claude-code');
      return query({ prompt: "Hello" });
    }
  };

  try {
    const result = await context.retryFunction();
    return result;
  } catch (error) {
    return await apiErrorHandler.handleError(error, context);
  }
}
```

#### **4. Check Firewall Settings**
```bash
# Check if port 443 is open
telnet api.anthropic.com 443

# Check firewall rules (macOS)
sudo pfctl -s rules

# Check firewall rules (Linux)
sudo iptables -L
```

---

## **🤖 Model Issues**

### **Error: "Invalid model" or "Model not found"**

**Symptoms:**
- `Invalid model: claude-3-5-sonnet-20241022`
- `Model not found`
- Model-specific errors

**Root Cause:**
- Invalid model name
- Model not available in region
- Model deprecated or removed

**Solutions:**

#### **1. Verify Available Models**
```javascript
// List available models
const availableModels = [
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022',
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229'
];

// Test each model
async function testModels() {
  for (const model of availableModels) {
    try {
      const result = query({
        prompt: "Hello",
        model: model
      });
      console.log(`Model ${model} is available`);
    } catch (error) {
      console.log(`Model ${model} failed: ${error.message}`);
    }
  }
}
```

#### **2. Use Model Fallback**
```javascript
async function modelFallback() {
  const models = [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229'
  ];

  for (const model of models) {
    try {
      const result = query({
        prompt: "Hello",
        model: model
      });
      
      let response = '';
      for await (const chunk of result.sdkMessages) {
        if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
          response += chunk.delta.text;
        }
      }
      
      return { model, response };
    } catch (error) {
      console.log(`Model ${model} failed, trying next...`);
    }
  }
  
  throw new Error('All models failed');
}
```

#### **3. Check Model Documentation**
```bash
# Check latest model information
curl https://api.anthropic.com/v1/models \
  -H "x-api-key: $ANTHROPIC_API_KEY"
```

---

## **📁 File Issues**

### **Error: "File not found" or "Permission denied"**

**Symptoms:**
- `ENOENT: no such file or directory`
- `EACCES: permission denied`
- File path issues

**Root Cause:**
- Incorrect file path
- File permissions
- File doesn't exist
- Path encoding issues

**Solutions:**

#### **1. Verify File Path**
```javascript
const fs = require('fs');
const path = require('path');

function verifyFile(filePath) {
  const absolutePath = path.resolve(filePath);
  
  console.log('Original path:', filePath);
  console.log('Absolute path:', absolutePath);
  console.log('File exists:', fs.existsSync(absolutePath));
  
  if (fs.existsSync(absolutePath)) {
    const stats = fs.statSync(absolutePath);
    console.log('File size:', stats.size);
    console.log('Permissions:', stats.mode.toString(8));
  }
}
```

#### **2. Fix File Permissions**
```bash
# Check file permissions
ls -la file.js

# Fix permissions
chmod 644 file.js

# Fix directory permissions
chmod 755 directory/
```

#### **3. Handle File Paths Safely**
```javascript
function safeFilePath(filePath) {
  // Normalize path
  const normalized = path.normalize(filePath);
  
  // Resolve to absolute path
  const absolute = path.resolve(normalized);
  
  // Check if file exists
  if (!fs.existsSync(absolute)) {
    throw new Error(`File not found: ${absolute}`);
  }
  
  // Check if readable
  try {
    fs.accessSync(absolute, fs.constants.R_OK);
  } catch (error) {
    throw new Error(`File not readable: ${absolute}`);
  }
  
  return absolute;
}
```

#### **4. Handle Special Characters**
```javascript
function encodeFilePath(filePath) {
  // Handle spaces and special characters
  return encodeURIComponent(filePath);
}

function decodeFilePath(encodedPath) {
  return decodeURIComponent(encodedPath);
}
```

---

## **🔧 Debugging Tools**

### **1. Enable Debug Logging**
```javascript
// Set debug level
process.env.LOG_LEVEL = 'debug';

// Or programmatically
const logger = require('../utils/logger');
logger.setLevel('debug');
```

### **2. Create Debug Script**
```javascript
// debug-claude-code.js
const { query } = require('@anthropic-ai/claude-code');

async function debugClaudeCode() {
  console.log('=== Claude Code Debug ===');
  
  // Test basic functionality
  try {
    console.log('1. Testing basic query...');
    const result = query({ prompt: "Hello" });
    console.log('Query result type:', typeof result);
    console.log('Query result keys:', Object.keys(result));
    
    if (result.sdkMessages) {
      console.log('2. Testing streaming...');
      let response = '';
      for await (const chunk of result.sdkMessages) {
        console.log('Chunk:', chunk);
        if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
          response += chunk.delta.text;
        }
      }
      console.log('Final response:', response);
    }
    
  } catch (error) {
    console.error('Error:', error);
    console.error('Error stack:', error.stack);
  }
}

debugClaudeCode();
```

### **3. Environment Check**
```javascript
// check-environment.js
function checkEnvironment() {
  console.log('=== Environment Check ===');
  
  console.log('Node.js version:', process.version);
  console.log('Platform:', process.platform);
  console.log('Architecture:', process.arch);
  
  console.log('Environment variables:');
  console.log('- ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set');
  console.log('- CLAUDE_CODE_OAUTH_TOKEN:', process.env.CLAUDE_CODE_OAUTH_TOKEN ? 'Set' : 'Not set');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  
  console.log('Package versions:');
  try {
    const claudeCode = require('@anthropic-ai/claude-code/package.json');
    console.log('- @anthropic-ai/claude-code:', claudeCode.version);
  } catch (error) {
    console.log('- @anthropic-ai/claude-code: Not installed');
  }
}

checkEnvironment();
```

---

## **📞 Getting Help**

### **1. Check Logs**
```bash
# View error logs
tail -f logs/error.log

# View info logs
tail -f logs/info.log

# View debug logs
tail -f logs/debug.log
```

### **2. Common Commands**
```bash
# Test Claude Code installation
node -e "console.log(require('@anthropic-ai/claude-code'))"

# Test authentication
npx @anthropic-ai/claude-code setup-token

# Check package version
npm list @anthropic-ai/claude-code

# Reinstall package
npm uninstall @anthropic-ai/claude-code
npm install @anthropic-ai/claude-code
```

### **3. Support Resources**
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs/claude-code)
- [Anthropic API Reference](https://docs.anthropic.com/claude/reference)
- [Meta Team Documentation](./meta-team-guide.md)
- [Error Handling Guide](./error-handling-guide.md)

### **4. Create Issue Report**
When creating an issue report, include:
- Error message and stack trace
- Environment information (Node.js version, OS)
- Package versions
- Steps to reproduce
- Expected vs actual behavior
- Log files (if available)

---

## **✅ Quick Fixes**

### **Most Common Issues:**

1. **"ClaudeCode is not a constructor"**
   ```javascript
   // ✅ Use query function directly
   const { query } = require('@anthropic-ai/claude-code');
   ```

2. **"Invalid API key"**
   ```bash
   # Regenerate and set API key
   export ANTHROPIC_API_KEY="your_new_key"
   ```

3. **"Cannot read sdkMessages"**
   ```javascript
   // ✅ Use for await loop
   for await (const chunk of result.sdkMessages) {
     // Process chunk
   }
   ```

4. **"Rate limit exceeded"**
   ```javascript
   // ✅ Use retry strategy
   const RetryStrategy = require('./utils/retry-strategy');
   ```

5. **"File not found"**
   ```javascript
   // ✅ Use absolute paths
   const absolutePath = path.resolve(filePath);
   ```

---

**Last Updated**: 2025-07-27  
**Version**: 1.0.0  
**Author**: Meta Team - Backend Team 